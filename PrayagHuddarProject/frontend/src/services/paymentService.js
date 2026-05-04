import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { getRazorpayConfig } from '../utils/envValidation';

/**
 * Payment service for Razorpay integration with backend
 */
class PaymentService {
  constructor() {
    const config = getRazorpayConfig();
    this.keyId = config.keyId;
    this.keySecret = config.keySecret;

    if (!this.keyId) {
      console.warn('Razorpay Key ID not found in environment variables');
    }
  }

  /**
   * Create a Razorpay order via backend
   * @param {Object} orderData - Order data
   * @returns {Promise} - Promise resolving to order details
   */
  async createOrder(orderData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  /**
   * Verify payment signature via backend
   * @param {Object} paymentData - Payment verification data
   * @returns {Promise} - Promise resolving to verification result
   */
  async verifyPayment(paymentData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.VERIFY_PAYMENT, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error('Payment verification failed');
    }
  }

  /**
   * Get payment status
   * @param {string} paymentId - Payment ID
   * @returns {Promise} - Promise resolving to payment status
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PAYMENTS.GET_PAYMENT_STATUS}/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw new Error('Failed to get payment status');
    }
  }

  /**
   * Refund payment
   * @param {string} paymentId - Payment ID
   * @param {Object} refundData - Refund data
   * @returns {Promise} - Promise resolving to refund result
   */
  async refundPayment(paymentId, refundData) {
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.PAYMENTS.REFUND_PAYMENT}/${paymentId}`, refundData);
      return response.data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw new Error('Failed to refund payment');
    }
  }

  /**
   * Initialize Razorpay payment with backend order creation
   * @param {Object} paymentConfig - Payment configuration
   * @returns {Promise} - Promise resolving to payment result
   */
  async initiatePayment({
    amount,
    currency = 'INR',
    description,
    patientInfo,
    doctorInfo,
    applicationId,
  }) {
    try {
      // Create order via backend
      const orderData = {
        amount: amount * 100, // Convert to paise
        currency: currency,
        description: description,
        patientInfo: patientInfo,
        doctorInfo: doctorInfo,
        applicationId: applicationId,
      };

      const order = await this.createOrder(orderData);

      return new Promise((resolve, reject) => {
        const options = {
          key: this.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'Second Opinion',
          description: order.description,
          image: '/logo.png',
          order_id: order.id,
          handler: async (response) => {
            try {
              // Verify payment with backend
              const verificationData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                applicationId: applicationId,
              };

              const verificationResult = await this.verifyPayment(verificationData);

              if (verificationResult.verified) {
                resolve({
                  success: true,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  status: 'success',
                  amount: amount,
                  method: 'razorpay',
                });
              } else {
                reject(new Error('Payment verification failed'));
              }
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: patientInfo.name,
            email: patientInfo.email,
            contact: patientInfo.phone || '9999999999',
          },
          notes: {
            doctor_id: doctorInfo.id,
            doctor_name: doctorInfo.name,
            application_id: applicationId,
            consultation_type: 'second_opinion',
          },
          theme: {
            color: '#007BFF',
          },
          method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
          },
          modal: {
            ondismiss: function () {
              reject(new Error('Payment cancelled by user'));
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (response) {
          reject(new Error(response.error.description || 'Payment failed'));
        });

        rzp.open();
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate UPI ID format
   * @param {string} upiId - UPI ID to validate
   * @returns {boolean} - Is valid UPI ID
   */
  validateUPIId(upiId) {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
    return upiRegex.test(upiId);
  }

  /**
   * Format amount for display
   * @param {number} amount - Amount in paise
   * @param {string} currency - Currency code
   * @returns {string} - Formatted amount
   */
  formatAmount(amount, currency = 'INR') {
    const amountInRupees = amount / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amountInRupees);
  }

  /**
   * Get payment methods available
   * @returns {Array} - Available payment methods
   */
  getAvailablePaymentMethods() {
    return [
      {
        id: 'razorpay',
        name: 'Razorpay Gateway',
        description: 'UPI, Cards, Net Banking',
        icon: 'CreditCardIcon',
        enabled: true,
      },
      {
        id: 'upi',
        name: 'Direct UPI',
        description: 'Pay with UPI ID',
        icon: 'DevicePhoneMobileIcon',
        enabled: true,
      },
    ];
  }
}

export default new PaymentService(); 