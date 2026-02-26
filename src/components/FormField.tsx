import { memo, InputHTMLAttributes } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  icon?: React.ReactNode;
  showValidation?: boolean;
}

export const FormField = memo(function FormField({
  label,
  error,
  touched,
  helpText,
  icon,
  showValidation = true,
  className = '',
  ...props
}: FormFieldProps) {
  const hasError = touched && error;
  const isValid = touched && !error && props.value;

  return (
    <div className="mb-4">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          {...props}
          className={`
            w-full px-4 py-3 ${icon ? 'pl-10' : ''} ${
            showValidation && (hasError || isValid) ? 'pr-10' : ''
          }
            border-2 rounded-xl
            focus:ring-4 focus:outline-none
            transition-all duration-200
            dark:bg-gray-800 dark:text-white
            ${
              hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900'
                : isValid && showValidation
                ? 'border-green-500 focus:border-green-500 focus:ring-green-100 dark:focus:ring-green-900'
                : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-100 dark:focus:ring-teal-900'
            }
            ${className}
          `}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={
            hasError
              ? `${props.id || props.name}-error`
              : helpText
              ? `${props.id || props.name}-help`
              : undefined
          }
        />

        {showValidation && hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <AlertCircle className="w-5 h-5" aria-hidden="true" />
          </div>
        )}

        {showValidation && isValid && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <CheckCircle className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>

      {hasError && (
        <p
          id={`${props.id || props.name}-error`}
          className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}

      {!hasError && helpText && (
        <p
          id={`${props.id || props.name}-help`}
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          {helpText}
        </p>
      )}
    </div>
  );
});

interface TextAreaFieldProps
  extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  rows?: number;
}

export const TextAreaField = memo(function TextAreaField({
  label,
  error,
  touched,
  helpText,
  rows = 4,
  className = '',
  ...props
}: TextAreaFieldProps) {
  const hasError = touched && error;

  return (
    <div className="mb-4">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        {...(props as any)}
        rows={rows}
        className={`
          w-full px-4 py-3
          border-2 rounded-xl
          focus:ring-4 focus:outline-none
          transition-all duration-200
          dark:bg-gray-800 dark:text-white
          resize-vertical
          ${
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900'
              : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-100 dark:focus:ring-teal-900'
          }
          ${className}
        `}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={
          hasError
            ? `${props.id || props.name}-error`
            : helpText
            ? `${props.id || props.name}-help`
            : undefined
        }
      />

      {hasError && (
        <p
          id={`${props.id || props.name}-error`}
          className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}

      {!hasError && helpText && (
        <p
          id={`${props.id || props.name}-help`}
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          {helpText}
        </p>
      )}
    </div>
  );
});

interface SelectFieldProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  touched?: boolean;
  helpText?: string;
  options: Array<{ value: string; label: string }>;
}

export const SelectField = memo(function SelectField({
  label,
  error,
  touched,
  helpText,
  options,
  className = '',
  ...props
}: SelectFieldProps) {
  const hasError = touched && error;

  return (
    <div className="mb-4">
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <select
        {...(props as any)}
        className={`
          w-full px-4 py-3
          border-2 rounded-xl
          focus:ring-4 focus:outline-none
          transition-all duration-200
          dark:bg-gray-800 dark:text-white
          ${
            hasError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900'
              : 'border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-100 dark:focus:ring-teal-900'
          }
          ${className}
        `}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={
          hasError
            ? `${props.id || props.name}-error`
            : helpText
            ? `${props.id || props.name}-help`
            : undefined
        }
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {hasError && (
        <p
          id={`${props.id || props.name}-error`}
          className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {error}
        </p>
      )}

      {!hasError && helpText && (
        <p
          id={`${props.id || props.name}-help`}
          className="mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          {helpText}
        </p>
      )}
    </div>
  );
});
