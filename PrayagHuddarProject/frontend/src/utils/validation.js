import * as Yup from 'yup';
import {
  VALIDATION_RULES,
  MEDICAL_SPECIALTIES,
  REGEX_PATTERNS,
  FILE_UPLOAD_LIMITS,
  FILE_CATEGORIES,
} from '../config/constants';

// Email validation regex
const EMAIL_REGEX = REGEX_PATTERNS.EMAIL;

// Password validation regex
const PASSWORD_REGEX = REGEX_PATTERNS.PASSWORD;

export const loginSchema = Yup.object({
  email: Yup.string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const patientRegistrationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`
    )
    .matches(
      PASSWORD_REGEX,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits'),
  termsAccepted: Yup.boolean()
    .oneOf([true], 'You must accept the terms of service')
    .required('You must accept the terms of service'),
});

export const doctorRegistrationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`
    )
    .matches(
      PASSWORD_REGEX,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('Password is required'),
  specialty: Yup.string()
    .oneOf(MEDICAL_SPECIALTIES, 'Please select a valid specialty')
    .required('Specialty is required'),
  licenseNumber: Yup.string()
    .min(5, 'License number must be at least 5 characters')
    .required('License number is required'),
  yearsOfExperience: Yup.number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience cannot exceed 50')
    .required('Years of experience is required'),
  termsAccepted: Yup.boolean()
    .oneOf([true], 'You must accept the terms of service')
    .required('You must accept the terms of service'),
});

export const secondOpinionSchema = Yup.object({
  description: Yup.string()
    .min(
      VALIDATION_RULES.DESCRIPTION_MIN_LENGTH,
      `Description must be at least ${VALIDATION_RULES.DESCRIPTION_MIN_LENGTH} characters`
    )
    .max(
      VALIDATION_RULES.DESCRIPTION_MAX_LENGTH,
      `Description must be less than ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`
    )
    .required('Case description is required'),
});

export const profileUpdateSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits'),
  address: Yup.string().max(200, 'Address must be less than 200 characters'),
  medicalHistory: Yup.string().max(
    1000,
    'Medical history must be less than 1000 characters'
  ),
});

export const doctorProfileSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  specialty: Yup.string()
    .oneOf(MEDICAL_SPECIALTIES, 'Please select a valid specialty')
    .required('Specialty is required'),
  qualifications: Yup.string()
    .min(10, 'Qualifications must be at least 10 characters')
    .max(200, 'Qualifications must be less than 200 characters')
    .required('Qualifications are required'),
  fee: Yup.number()
    .min(25, 'Minimum fee is $25')
    .max(500, 'Maximum fee is $500')
    .required('Fee is required'),
  yearsOfExperience: Yup.number()
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience cannot exceed 50')
    .required('Years of experience is required'),
});

export const notificationSchema = Yup.object({
  recipient: Yup.string().required('Recipient is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters')
    .required('Message is required'),
});

// Enhanced file validation for medical reports
export const validateFile = (file, options = {}) => {
  const errors = [];
  const {
    maxSize = FILE_UPLOAD_LIMITS.maxSize,
    allowedTypes = FILE_UPLOAD_LIMITS.allowedTypes,
    category = FILE_CATEGORIES.MEDICAL_REPORT
  } = options;

  if (!file) {
    errors.push('File is required');
    return errors;
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    const allowedTypesList = allowedTypes
      .map(type => type.split('/')[1]?.toUpperCase() || type)
      .join(', ');
    errors.push(`Only ${allowedTypesList} files are allowed`);
  }

  // Additional validation for specific categories
  if (category === FILE_CATEGORIES.IMAGING) {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff', 'image/webp'];
    if (!imageTypes.includes(file.type)) {
      errors.push('Imaging files must be image formats (JPEG, PNG, GIF, BMP, TIFF, WebP)');
    }
  }

  return errors;
};

export const validateFiles = (files, options = {}) => {
  const errors = [];
  const {
    maxFiles = FILE_UPLOAD_LIMITS.maxFiles,
    maxTotalSize = FILE_UPLOAD_LIMITS.maxTotalSize,
    allowedTypes = FILE_UPLOAD_LIMITS.allowedTypes,
    category = FILE_CATEGORIES.MEDICAL_REPORT
  } = options;

  if (!files || files.length === 0) {
    errors.push('At least one file is required');
    return errors;
  }

  // Check number of files
  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} files allowed`);
  }

  // Check total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > maxTotalSize) {
    const maxTotalSizeMB = Math.round(maxTotalSize / (1024 * 1024));
    errors.push(`Total file size must be less than ${maxTotalSizeMB}MB`);
  }

  // Validate each file
  files.forEach((file, index) => {
    const fileErrors = validateFile(file, { maxSize: FILE_UPLOAD_LIMITS.maxSize, allowedTypes, category });
    if (fileErrors.length > 0) {
      errors.push(`File ${index + 1}: ${fileErrors.join(', ')}`);
    }
  });

  return errors;
};

// File upload schema for forms
export const fileUploadSchema = Yup.object({
  files: Yup.array()
    .of(
      Yup.mixed()
        .test('fileSize', 'File size is too large', (value) => {
          if (!value) return true;
          return value.size <= FILE_UPLOAD_LIMITS.maxSize;
        })
        .test('fileType', 'Invalid file type', (value) => {
          if (!value) return true;
          return FILE_UPLOAD_LIMITS.allowedTypes.includes(value.type);
        })
    )
    .min(1, 'At least one file is required')
    .max(FILE_UPLOAD_LIMITS.maxFiles, `Maximum ${FILE_UPLOAD_LIMITS.maxFiles} files allowed`),
  category: Yup.string()
    .oneOf(Object.values(FILE_CATEGORIES), 'Please select a valid file category')
    .required('File category is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
});

// Additional validation schemas
export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`
    )
    .matches(
      PASSWORD_REGEX,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`
    )
    .matches(
      PASSWORD_REGEX,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const contactSchema = Yup.object({
  name: Yup.string()
    .min(VALIDATION_RULES.NAME_MIN_LENGTH, 'Name must be at least 2 characters')
    .max(
      VALIDATION_RULES.NAME_MAX_LENGTH,
      'Name must be less than 50 characters'
    )
    .required('Name is required'),
  email: Yup.string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters')
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .required('Message is required'),
});

// Utility functions for validation
export const validateEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

export const validatePassword = (password) => {
  return (
    password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH &&
    PASSWORD_REGEX.test(password)
  );
};

export const validatePhone = (phone) => {
  return (
    REGEX_PATTERNS.PHONE.test(phone) &&
    phone.length >= VALIDATION_RULES.PHONE_MIN_LENGTH
  );
};

export const validateFileSize = (file, maxSize = FILE_UPLOAD_LIMITS.maxSize) => {
  return file.size <= maxSize;
};

export const validateFileType = (file, allowedTypes = FILE_UPLOAD_LIMITS.allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// File utility functions
export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase();
};

export const getFileCategory = (fileType) => {
  if (fileType.startsWith('image/')) {
    return FILE_CATEGORIES.IMAGING;
  } else if (fileType === 'application/pdf') {
    return FILE_CATEGORIES.MEDICAL_REPORT;
  }
  return FILE_CATEGORIES.OTHER;
};

// Import formatters for consistent formatting
import { formatFileSize } from './formatters';

// Re-export formatFileSize for backward compatibility
export { formatFileSize };
