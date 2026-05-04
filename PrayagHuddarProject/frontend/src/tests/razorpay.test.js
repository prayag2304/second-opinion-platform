/**
 * Razorpay Integration Tests
 * Tests for payment flows, error handling, and UI feedback
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import razorpayService from '../services/razorpay';
import paymentService from '../services/paymentService';
import patientService from '../services/patientService';
import doctorService from '../services/doctorService';

// Mock dependencies
vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock('../services/paymentService');
vi.mock('../services/patientService');
vi.mock('../services/doctorService');

describe('Razorpay Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.Razorpay
    global.window = {
      ...global.window,
      Razorpay: vi.fn(() => ({
        open: vi.fn(),
        on: vi.fn(),
      })),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Payment Initialization', () => {
    it('should initialize payment with dynamic data fetching', async () => {
      // Mock patient and doctor data
      const mockPatientData = {
        data: {
          id: 'patient-123',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
        },
      };

      const mockDoctorData = {
        data: {
          id: 'doctor-456',
          name: 'Dr. Smith',
          specialty: 'Cardiology',
        },
      };

      const mockPaymentResult = {
        success: true,
        paymentId: 'pay_123456',
        orderId: 'order_123456',
        amount: 50000, // ₹500
      };

      // Setup mocks
      patientService.getProfile.mockResolvedValue(mockPatientData);
      doctorService.getProfile.mockResolvedValue(mockDoctorData);
      paymentService.initiatePayment.mockResolvedValue(mockPaymentResult);

      // Test payment initialization
      const result = await razorpayService.initiatePayment({
        amount: 500,
        description: 'Second opinion consultation',
        applicationId: 'app-123',
      });

      // Verify service calls
      expect(patientService.getProfile).toHaveBeenCalled();
      expect(doctorService.getProfile).toHaveBeenCalled();
      expect(paymentService.initiatePayment).toHaveBeenCalledWith({
        amount: 500,
        description: 'Second opinion consultation',
        patientInfo: {
          id: 'patient-123',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
        },
        doctorInfo: {
          id: 'doctor-456',
          name: 'Dr. Smith',
          specialty: 'Cardiology',
        },
        applicationId: 'app-123',
      });

      expect(result).toEqual(mockPaymentResult);
      expect(toast.success).toHaveBeenCalledWith(
        'Payment initialized successfully!',
        { autoClose: 3000 }
      );
    });

    it('should handle payment initialization errors', async () => {
      const error = new Error('Payment gateway error');
      paymentService.initiatePayment.mockRejectedValue(error);

      await expect(
        razorpayService.initiatePayment({
          amount: 500,
          description: 'Test payment',
        })
      ).rejects.toThrow('Payment gateway error');

      expect(toast.error).toHaveBeenCalledWith(
        'Payment initiation failed. Please try again.'
      );
    });

    it('should handle patient data fetching errors', async () => {
      const error = new Error('Patient not found');
      patientService.getProfile.mockRejectedValue(error);

      await expect(
        razorpayService.initiatePayment({
          amount: 500,
          description: 'Test payment',
        })
      ).rejects.toThrow('Unable to fetch patient information');

      expect(toast.error).toHaveBeenCalledWith(
        'Payment initiation failed. Please try again.'
      );
    });

    it('should handle doctor data fetching errors', async () => {
      const mockPatientData = {
        data: {
          id: 'patient-123',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
        },
      };

      const error = new Error('Doctor not found');
      patientService.getProfile.mockResolvedValue(mockPatientData);
      doctorService.getProfile.mockRejectedValue(error);

      await expect(
        razorpayService.initiatePayment({
          amount: 500,
          description: 'Test payment',
        })
      ).rejects.toThrow('Unable to fetch doctor information');
    });
  });

  describe('Payment Verification', () => {
    it('should verify payment successfully', async () => {
      const mockVerificationData = {
        razorpay_payment_id: 'pay_123456',
        razorpay_order_id: 'order_123456',
        razorpay_signature: 'valid_signature',
        applicationId: 'app-123',
      };

      const mockVerificationResult = {
        verified: true,
        paymentId: 'pay_123456',
        amount: 50000,
        status: 'captured',
      };

      paymentService.verifyPayment.mockResolvedValue(mockVerificationResult);

      const result = await razorpayService.verifyPayment(mockVerificationData);

      expect(paymentService.verifyPayment).toHaveBeenCalledWith(mockVerificationData);
      expect(result).toEqual(mockVerificationResult);
      expect(toast.success).toHaveBeenCalled();
    });

    it('should handle payment verification failure', async () => {
      const mockVerificationData = {
        razorpay_payment_id: 'pay_123456',
        razorpay_order_id: 'order_123456',
        razorpay_signature: 'invalid_signature',
        applicationId: 'app-123',
      };

      const mockVerificationResult = {
        verified: false,
        error: 'Invalid signature',
      };

      paymentService.verifyPayment.mockResolvedValue(mockVerificationResult);

      const result = await razorpayService.verifyPayment(mockVerificationData);

      expect(result.verified).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        'Payment verification failed. Please contact support.'
      );
    });

    it('should handle verification errors', async () => {
      const error = new Error('Verification service error');
      paymentService.verifyPayment.mockRejectedValue(error);

      await expect(
        razorpayService.verifyPayment({
          razorpay_payment_id: 'pay_123456',
          razorpay_order_id: 'order_123456',
          razorpay_signature: 'signature',
        })
      ).rejects.toThrow('Verification service error');

      expect(toast.error).toHaveBeenCalledWith(
        'Payment verification failed. Please try again.'
      );
    });
  });

  describe('Payment Status', () => {
    it('should get payment status successfully', async () => {
      const mockStatusResult = {
        status: 'captured',
        paymentId: 'pay_123456',
        amount: 50000,
        timestamp: '2024-01-15T10:30:00Z',
      };

      paymentService.getPaymentStatus.mockResolvedValue(mockStatusResult);

      const result = await razorpayService.getPaymentStatus('pay_123456');

      expect(paymentService.getPaymentStatus).toHaveBeenCalledWith('pay_123456');
      expect(result).toEqual(mockStatusResult);
      expect(toast.success).toHaveBeenCalledWith('Payment completed successfully');
    });

    it('should handle failed payment status', async () => {
      const mockStatusResult = {
        status: 'failed',
        paymentId: 'pay_123456',
        amount: 50000,
        error: 'Payment failed',
      };

      paymentService.getPaymentStatus.mockResolvedValue(mockStatusResult);

      await razorpayService.getPaymentStatus('pay_123456');

      expect(toast.error).toHaveBeenCalledWith('Payment failed');
    });

    it('should handle pending payment status', async () => {
      const mockStatusResult = {
        status: 'pending',
        paymentId: 'pay_123456',
        amount: 50000,
      };

      paymentService.getPaymentStatus.mockResolvedValue(mockStatusResult);

      await razorpayService.getPaymentStatus('pay_123456');

      expect(toast.info).toHaveBeenCalledWith('Payment is pending');
    });
  });

  describe('Refund Payment', () => {
    it('should process refund successfully', async () => {
      const mockRefundData = {
        amount: 50000,
        reason: 'Patient request',
      };

      const mockRefundResult = {
        refundId: 'refund_123456',
        amount: 50000,
        status: 'processed',
        timestamp: '2024-01-15T11:00:00Z',
      };

      paymentService.refundPayment.mockResolvedValue(mockRefundResult);

      const result = await razorpayService.refundPayment('pay_123456', mockRefundData);

      expect(paymentService.refundPayment).toHaveBeenCalledWith('pay_123456', mockRefundData);
      expect(result).toEqual(mockRefundResult);
      expect(toast.success).toHaveBeenCalled();
    });

    it('should handle refund errors', async () => {
      const error = new Error('Refund failed');
      paymentService.refundPayment.mockRejectedValue(error);

      await expect(
        razorpayService.refundPayment('pay_123456', { amount: 50000 })
      ).rejects.toThrow('Refund failed');

      expect(toast.error).toHaveBeenCalledWith('Refund failed. Please contact support.');
    });
  });

  describe('UPI Validation', () => {
    it('should validate correct UPI ID', () => {
      const validUPI = 'john@okicici';
      const result = razorpayService.validateUPIId(validUPI);
      expect(result).toBe(true);
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('should reject invalid UPI ID', () => {
      const invalidUPI = 'invalid-upi';
      const result = razorpayService.validateUPIId(invalidUPI);
      expect(result).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(
        'Invalid UPI ID format. Please enter a valid UPI ID.'
      );
    });
  });

  describe('Payment Status Display', () => {
    it('should show success status with details', () => {
      const details = {
        paymentId: 'pay_123456',
        amount: 50000,
      };

      razorpayService.showPaymentStatus('success', details);

      expect(toast.success).toHaveBeenCalledWith(
        'Payment completed successfully!',
        expect.objectContaining({
          autoClose: 5000,
          render: expect.any(Function),
        })
      );
    });

    it('should show failed status', () => {
      razorpayService.showPaymentStatus('failed');

      expect(toast.error).toHaveBeenCalledWith(
        'Payment failed. Please try again.',
        { autoClose: 5000 }
      );
    });

    it('should show cancelled status', () => {
      razorpayService.showPaymentStatus('cancelled');

      expect(toast.warning).toHaveBeenCalledWith(
        'Payment was cancelled.',
        { autoClose: 3000 }
      );
    });

    it('should show pending status', () => {
      razorpayService.showPaymentStatus('pending');

      expect(toast.info).toHaveBeenCalledWith(
        'Payment is being processed...',
        { autoClose: 3000 }
      );
    });
  });

  describe('Configuration', () => {
    it('should check if properly configured', () => {
      const isConfigured = razorpayService.isConfigured();
      expect(typeof isConfigured).toBe('boolean');
    });

    it('should get configuration status', () => {
      const status = razorpayService.getConfigurationStatus();
      expect(status).toHaveProperty('keyId');
      expect(status).toHaveProperty('isConfigured');
      expect(status).toHaveProperty('environment');
    });
  });

  describe('Amount Formatting', () => {
    it('should format amount correctly', () => {
      const formatted = razorpayService.formatAmount(50000, 'INR');
      expect(formatted).toBe('₹500.00');
    });

    it('should format amount in different currency', () => {
      const formatted = razorpayService.formatAmount(5000, 'USD');
      expect(formatted).toBe('$50.00');
    });
  });

  describe('Payment Methods', () => {
    it('should get available payment methods', () => {
      const methods = razorpayService.getAvailablePaymentMethods();
      expect(Array.isArray(methods)).toBe(true);
      expect(methods.length).toBeGreaterThan(0);
    });
  });
}); 