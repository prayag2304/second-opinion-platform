import paymentService from './paymentService';
import patientService from './patientService';
import doctorService from './doctorService';
import { getRazorpayConfig } from '../utils/envValidation';
import { toast } from 'react-toastify';

/**
 * Razorpay Payment Service - Enhanced with UI Feedback and Dynamic Data
 * Uses backend integration for order creation and payment verification
 */
class RazorpayService {
  constructor() {
    const config = getRazorpayConfig();
    this.keyId = config.keyId;
    
    if (!this.keyId) {
      console.warn('Razorpay Key ID not found in environment variables');
      toast.warning('Payment gateway not configured properly');
    }
  }

  /**
   * Initialize Razorpay payment with dynamic data fetching
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
    showUI = true
  }) {
    try {
      if (showUI) {
        toast.info('Initializing payment...', { autoClose: 2000 });
      }

      // Fetch patient and doctor details if not provided
      let finalPatientInfo = patientInfo;
      let finalDoctorInfo = doctorInfo;

      if (!finalPatientInfo) {
        try {
          const patientProfile = await patientService.getProfile();
          finalPatientInfo = {
            id: patientProfile.data.id,
            name: patientProfile.data.name,
            email: patientProfile.data.email,
            phone: patientProfile.data.phone
          };
        } catch (error) {
          console.error('Failed to fetch patient info:', error);
          throw new Error('Unable to fetch patient information');
        }
      }

      if (!finalDoctorInfo) {
        try {
          const doctorProfile = await doctorService.getProfile();
          finalDoctorInfo = {
            id: doctorProfile.data.id,
            name: doctorProfile.data.name,
            specialty: doctorProfile.data.specialty
          };
        } catch (error) {
          console.error('Failed to fetch doctor info:', error);
          throw new Error('Unable to fetch doctor information');
        }
      }

      const result = await paymentService.initiatePayment({
        amount,
        currency,
        description,
        patientInfo: finalPatientInfo,
        doctorInfo: finalDoctorInfo,
        applicationId,
      });

      if (showUI) {
        toast.success('Payment initialized successfully!', { autoClose: 3000 });
      }

      return result;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      if (showUI) {
        toast.error(error.message || 'Payment initiation failed. Please try again.');
      }
      throw error;
    }
  }

  /**
   * Verify payment signature via backend with UI feedback
   * @param {Object} paymentData - Payment verification data
   * @returns {Promise} - Promise resolving to verification result
   */
  async verifyPayment(paymentData, showUI = true) {
    try {
      if (showUI) {
        toast.info('Verifying payment...', { autoClose: 2000 });
      }

      const result = await paymentService.verifyPayment(paymentData);

      if (result.verified) {
        if (showUI) {
          toast.success('Payment verified successfully!', {
            autoClose: 5000,
            render: () => (
              <div>
                <div className="font-semibold">Payment Successful!</div>
                <div className="text-sm">Payment ID: {result.paymentId}</div>
                <div className="text-sm">Amount: ₹{(result.amount / 100).toFixed(2)}</div>
              </div>
            )
          });
        }
      } else {
        if (showUI) {
          toast.error('Payment verification failed. Please contact support.');
        }
      }

      return result;
    } catch (error) {
      console.error('Payment verification failed:', error);
      if (showUI) {
        toast.error('Payment verification failed. Please try again.');
      }
      throw error;
    }
  }

  /**
   * Get payment status with UI feedback
   * @param {string} paymentId - Payment ID
   * @returns {Promise} - Promise resolving to payment status
   */
  async getPaymentStatus(paymentId, showUI = true) {
    try {
      if (showUI) {
        toast.info('Checking payment status...', { autoClose: 2000 });
      }

      const result = await paymentService.getPaymentStatus(paymentId);

      if (showUI) {
        const statusMessages = {
          'captured': 'Payment completed successfully',
          'failed': 'Payment failed',
          'pending': 'Payment is pending',
          'refunded': 'Payment has been refunded'
        };

        const message = statusMessages[result.status] || `Payment status: ${result.status}`;
        
        if (result.status === 'captured') {
          toast.success(message);
        } else if (result.status === 'failed') {
          toast.error(message);
        } else {
          toast.info(message);
        }
      }

      return result;
    } catch (error) {
      console.error('Failed to get payment status:', error);
      if (showUI) {
        toast.error('Failed to get payment status. Please try again.');
      }
      throw error;
    }
  }

  /**
   * Refund payment with UI feedback
   * @param {string} paymentId - Payment ID
   * @param {Object} refundData - Refund data
   * @returns {Promise} - Promise resolving to refund result
   */
  async refundPayment(paymentId, refundData, showUI = true) {
    try {
      if (showUI) {
        toast.info('Processing refund...', { autoClose: 2000 });
      }

      const result = await paymentService.refundPayment(paymentId, refundData);

      if (showUI) {
        toast.success('Refund processed successfully!', {
          autoClose: 5000,
          render: () => (
            <div>
              <div className="font-semibold">Refund Successful!</div>
              <div className="text-sm">Refund ID: {result.refundId}</div>
              <div className="text-sm">Amount: ₹{(result.amount / 100).toFixed(2)}</div>
            </div>
          )
        });
      }

      return result;
    } catch (error) {
      console.error('Failed to refund payment:', error);
      if (showUI) {
        toast.error('Refund failed. Please contact support.');
      }
      throw error;
    }
  }

  /**
   * Validate UPI ID format
   * @param {string} upiId - UPI ID to validate
   * @returns {boolean} - Is valid UPI ID
   */
  validateUPIId(upiId) {
    const isValid = paymentService.validateUPIId(upiId);
    
    if (!isValid) {
      toast.error('Invalid UPI ID format. Please enter a valid UPI ID.');
    }
    
    return isValid;
  }

  /**
   * Format amount for display
   * @param {number} amount - Amount in paise
   * @param {string} currency - Currency code
   * @returns {string} - Formatted amount
   */
  formatAmount(amount, currency = 'INR') {
    return paymentService.formatAmount(amount, currency);
  }

  /**
   * Get available payment methods
   * @returns {Array} - Available payment methods
   */
  getAvailablePaymentMethods() {
    return paymentService.getAvailablePaymentMethods();
  }

  /**
   * Check if Razorpay is properly configured
   * @returns {boolean} - Is properly configured
   */
  isConfigured() {
    return !!this.keyId;
  }

  /**
   * Get configuration status
   * @returns {Object} - Configuration status
   */
  getConfigurationStatus() {
    return {
      keyId: !!this.keyId,
      isConfigured: this.isConfigured(),
      environment: import.meta.env.MODE,
    };
  }

  /**
   * Show payment status in UI
   * @param {string} status - Payment status
   * @param {Object} details - Payment details
   */
  showPaymentStatus(status, details = {}) {
    const statusConfig = {
      success: {
        type: 'success',
        message: 'Payment completed successfully!',
        autoClose: 5000
      },
      failed: {
        type: 'error',
        message: 'Payment failed. Please try again.',
        autoClose: 5000
      },
      cancelled: {
        type: 'warning',
        message: 'Payment was cancelled.',
        autoClose: 3000
      },
      pending: {
        type: 'info',
        message: 'Payment is being processed...',
        autoClose: 3000
      }
    };

    const config = statusConfig[status] || {
      type: 'info',
      message: `Payment status: ${status}`,
      autoClose: 3000
    };

    if (config.type === 'success' && details.paymentId) {
      toast.success(config.message, {
        autoClose: config.autoClose,
        render: () => (
          <div>
            <div className="font-semibold">Payment Successful!</div>
            <div className="text-sm">Payment ID: {details.paymentId}</div>
            {details.amount && (
              <div className="text-sm">Amount: ₹{(details.amount / 100).toFixed(2)}</div>
            )}
          </div>
        )
      });
    } else {
      toast[config.type](config.message, { autoClose: config.autoClose });
    }
  }
}

export default new RazorpayService();
