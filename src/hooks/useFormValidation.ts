import { useState, useCallback, useEffect } from 'react';

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  custom?: (value: any) => string | null;
};

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export type TouchedFields<T> = {
  [K in keyof T]?: boolean;
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules<T>,
  validateOnChange = true
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<TouchedFields<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const validateField = useCallback(
    (name: keyof T, value: any): string | null => {
      const rule = rules[name];
      if (!rule) return null;

      if (rule.required && (!value || value.toString().trim() === '')) {
        return 'This field is required';
      }

      if (rule.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
      }

      if (rule.minLength && value && value.length < rule.minLength) {
        return `Must be at least ${rule.minLength} characters`;
      }

      if (rule.maxLength && value && value.length > rule.maxLength) {
        return `Must be no more than ${rule.maxLength} characters`;
      }

      if (rule.min !== undefined && value < rule.min) {
        return `Must be at least ${rule.min}`;
      }

      if (rule.max !== undefined && value > rule.max) {
        return `Must be no more than ${rule.max}`;
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        return 'Invalid format';
      }

      if (rule.custom) {
        return rule.custom(value);
      }

      return null;
    },
    [rules]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    Object.keys(rules).forEach((key) => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, values, validateField]);

  useEffect(() => {
    if (validateOnChange && Object.keys(touched).length > 0) {
      const newErrors: ValidationErrors<T> = {};

      Object.keys(touched).forEach((key) => {
        if (touched[key as keyof T]) {
          const error = validateField(key as keyof T, values[key as keyof T]);
          if (error) {
            newErrors[key as keyof T] = error;
          }
        }
      });

      setErrors(newErrors);
    }
  }, [values, validateOnChange, touched, validateField]);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void> | void) => {
      setIsSubmitting(true);
      setSubmitCount((prev) => prev + 1);

      const allTouched = Object.keys(rules).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as TouchedFields<T>
      );
      setTouched(allTouched);

      const isValid = validateForm();

      if (isValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }

      setIsSubmitting(false);
    },
    [values, validateForm, rules]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }));
  }, []);

  const isValid = Object.keys(errors).length === 0;
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateForm
  };
}

export function useFieldValidation(
  value: any,
  rule: ValidationRule,
  validateOnChange = true
) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!validateOnChange || !touched) return;

    let errorMessage: string | null = null;

    if (rule.required && (!value || value.toString().trim() === '')) {
      errorMessage = 'This field is required';
    } else if (rule.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address';
      }
    } else if (rule.minLength && value && value.length < rule.minLength) {
      errorMessage = `Must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value && value.length > rule.maxLength) {
      errorMessage = `Must be no more than ${rule.maxLength} characters`;
    } else if (rule.min !== undefined && value < rule.min) {
      errorMessage = `Must be at least ${rule.min}`;
    } else if (rule.max !== undefined && value > rule.max) {
      errorMessage = `Must be no more than ${rule.max}`;
    } else if (rule.pattern && value && !rule.pattern.test(value)) {
      errorMessage = 'Invalid format';
    } else if (rule.custom) {
      errorMessage = rule.custom(value);
    }

    setError(errorMessage);
  }, [value, rule, validateOnChange, touched]);

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  return { error, touched, handleBlur, setTouched };
}
