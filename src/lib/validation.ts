export const validation = {
  email: (email: string): { valid: boolean; error?: string } => {
    if (!email || email.trim() === '') {
      return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Please enter a valid email address' };
    }

    return { valid: true };
  },

  password: (password: string): { valid: boolean; error?: string } => {
    if (!password || password.length < 8) {
      return { valid: false, error: 'Password must be at least 8 characters' };
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
      return { valid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, error: 'Password must contain at least one number' };
    }

    return { valid: true };
  },

  required: (value: string, fieldName: string): { valid: boolean; error?: string } => {
    if (!value || value.trim() === '') {
      return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true };
  },

  minLength: (value: string, min: number, fieldName: string): { valid: boolean; error?: string } => {
    if (value.length < min) {
      return { valid: false, error: `${fieldName} must be at least ${min} characters` };
    }
    return { valid: true };
  },

  maxLength: (value: string, max: number, fieldName: string): { valid: boolean; error?: string } => {
    if (value.length > max) {
      return { valid: false, error: `${fieldName} must be no more than ${max} characters` };
    }
    return { valid: true };
  },

  number: (value: string, fieldName: string): { valid: boolean; error?: string } => {
    const num = Number(value);
    if (isNaN(num)) {
      return { valid: false, error: `${fieldName} must be a valid number` };
    }
    return { valid: true };
  },

  range: (value: number, min: number, max: number, fieldName: string): { valid: boolean; error?: string } => {
    if (value < min || value > max) {
      return { valid: false, error: `${fieldName} must be between ${min} and ${max}` };
    }
    return { valid: true };
  },

  url: (value: string): { valid: boolean; error?: string } => {
    try {
      new URL(value);
      return { valid: true };
    } catch {
      return { valid: false, error: 'Please enter a valid URL' };
    }
  },

  fileSize: (file: File, maxSizeMB: number): { valid: boolean; error?: string } => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
    }
    return { valid: true };
  },

  fileType: (file: File, allowedTypes: string[]): { valid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` };
    }
    return { valid: true };
  },
};

export type ValidationResult = ReturnType<typeof validation.email>;
