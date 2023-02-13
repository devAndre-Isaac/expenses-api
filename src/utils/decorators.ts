import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsFuture(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isFuture',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'date cannot be in the future ',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          return value instanceof Date && value < new Date();
        },
      },
    });
  };
}
