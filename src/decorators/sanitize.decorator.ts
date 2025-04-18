// File: src/decorators/sanitize.decorator.ts
/**
 * Custom decorator to validate that a string is free of HTML tags after sanitization.
 */

import { registerDecorator, ValidationOptions } from 'class-validator';
import { Transform } from 'class-transformer';

export function SanitizeXSS(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'sanitizeXSS',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const sanitized = value.replace(/<[^>]*>/g, '').trim();
          return sanitized.length > 0; // Ensure non-empty after sanitization
        },
        defaultMessage() {
          return `${propertyName} must be a non-empty string after sanitization`;
        },
      },
    });
  };
}

/**
 * Transformer to strip HTML tags and trim strings, preventing XSS.
 */
export function TransformXSS() {
  return Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/<[^>]*>/g, '').trim() : value,
  );
}
