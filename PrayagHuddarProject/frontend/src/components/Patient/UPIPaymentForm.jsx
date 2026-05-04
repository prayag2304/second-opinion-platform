import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  CreditCardIcon, 
  DevicePhoneMobileIcon, 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Button from '../Common/Button';
import paymentService from '../../services/paymentService';

const UPIPaymentForm = ({
  doctor,
  amount,
  patientInfo,
  applicationId,
  onSuccess,
  onError,
  loading: externalLoading = false
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [upiId, setUpiId] = useState('');

  const isLoading = loading || externalLoading;

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const paymentData = await paymentService.initiatePayment({
        amount: amount,
        description: `Second Opinion Consultation - ${doctor.name}`,
        patientInfo: patientInfo,
        doctorInfo: doctor,
        applicationId: applicationId,
      });

      onSuccess({
        paymentId: paymentData.paymentId,
        method: 'razorpay',
        amount: amount,
        status: 'success',
        orderId: paymentData.orderId,
      });
    } catch (error) {
      console.error('Payment failed:', error);
      onError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = async () => {
    if (!upiId.trim()) {
      toast.error('Please enter UPI ID');
      return;
    }

    // Validate UPI ID format
    if (!paymentService.validateUPIId(upiId)) {
      toast.error('Please enter a valid UPI ID (e.g., name@bank)');
      return;
    }

    setLoading(true);
    try {
      // For production, this should integrate with Razorpay's UPI API
      // For now, we'll show a message that UPI payments are handled through Razorpay
      toast.info('UPI payments are processed through Razorpay gateway. Please use the Razorpay option for UPI payments.');
      setPaymentMethod('razorpay');
    } catch (error) {
      onError(error.message || 'UPI payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'razorpay') {
      setUpiId(''); // Clear UPI ID when switching to Razorpay
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCardIcon className="w-5 h-5 mr-2 text-primary-600" />
          Payment Summary
        </h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-medium text-gray-900">{doctor.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Specialty:</span>
            <span className="font-medium text-gray-900">{doctor.specialty}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Consultation Fee:</span>
            <span className="font-semibold text-gray-900">₹{amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Platform Fee:</span>
            <span className="font-semibold text-green-600">₹0</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-xl font-bold text-primary-600">₹{amount}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Select Payment Method</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Razorpay Option */}
          <label className={`
            relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
            ${paymentMethod === 'razorpay' 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}>
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              checked={paymentMethod === 'razorpay'}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center space-x-3">
              <CreditCardIcon className="w-8 h-8 text-primary-600" />
              <div>
                <div className="font-medium text-gray-900">Razorpay Gateway</div>
                <div className="text-sm text-gray-500">UPI, Cards, Net Banking</div>
              </div>
            </div>
            {paymentMethod === 'razorpay' && (
              <CheckCircleIcon className="w-5 h-5 text-primary-600 absolute top-2 right-2" />
            )}
          </label>

          {/* Direct UPI Option - Disabled for production */}
          <label className={`
            relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
            ${paymentMethod === 'upi' 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-200 hover:border-gray-300'
            }
            opacity-50 cursor-not-allowed
          `}>
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              className="sr-only"
              disabled
            />
            <div className="flex items-center space-x-3">
              <DevicePhoneMobileIcon className="w-8 h-8 text-green-600" />
              <div>
                <div className="font-medium text-gray-900">Direct UPI</div>
                <div className="text-sm text-gray-500">Coming Soon</div>
              </div>
            </div>
            {paymentMethod === 'upi' && (
              <CheckCircleIcon className="w-5 h-5 text-primary-600 absolute top-2 right-2" />
            )}
          </label>
        </div>
      </div>

      {/* UPI ID Input (if UPI method selected) */}
      {paymentMethod === 'upi' && (
        <div className="space-y-3">
          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
            <DevicePhoneMobileIcon className="w-4 h-4 inline mr-1" />
            UPI ID
          </label>
          <input
            type="text"
            id="upiId"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="yourname@paytm, yourname@googlepay, etc."
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            disabled
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
              Direct UPI payments are coming soon. Please use Razorpay for UPI payments.
            </p>
          </div>
        </div>
      )}

      {/* Configuration Warning */}
      {!paymentService.isConfigured() && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">Payment Gateway Not Configured</h4>
              <p className="text-sm text-red-700">
                Razorpay is not properly configured. Please check your environment variables.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Environment Info */}
      {import.meta.env.MODE === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Development Mode</h4>
              <p className="text-sm text-yellow-700">
                This is a development environment. Use test credentials for payment testing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Button */}
      <div className="space-y-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : handleUPIPayment}
          disabled={isLoading || !paymentService.isConfigured() || (paymentMethod === 'upi' && !upiId.trim())}
          loading={isLoading}
          leftIcon={<ShieldCheckIcon className="w-5 h-5" />}
        >
          {isLoading ? 'Processing Payment...' : `Pay ₹${amount} Securely`}
        </Button>

        {/* Security Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <ShieldCheckIcon className="w-4 h-4 mr-1" />
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>

      {/* Payment Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xs text-gray-600">Instant Payment</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-gray-600">Secure & Safe</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CreditCardIcon className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-xs text-gray-600">Multiple Options</p>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentForm;