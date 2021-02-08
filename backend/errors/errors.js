import mongoose from 'mongoose';

function FriendlyError(message, stack) {
  this.message = message;
  this.stack = stack ?? new Error().stack;
}
FriendlyError.prototype.name = 'FriendlyError';
FriendlyError.prototype = new Error();

function InputError(message, stack) {
  this.message = message;
  this.stack = stack ?? new Error().stack;
}
InputError.prototype.name = 'InputError';
InputError.prototype = new Error();

function ValidationError(message, stack) {
  this.message = message;
  this.stack = stack ?? new Error().stack;
}
ValidationError.prototype.name = 'ValidationError';
ValidationError.prototype = new Error();

function DataConstraintError(message, stack) {
  this.message = message;
  this.stack = stack ?? new Error().stack;
}
DataConstraintError.prototype.name = 'DataConstraintError';
DataConstraintError.prototype = new Error();

function convertToFriendlyError(error) {
  if (error instanceof FriendlyError) return error;

  if (error.message.startsWith('E11000')) {
    const [fieldName, fieldValue] = Object.entries(error.keyValue)[0];
    const formattedfieldValue = capitalise(fieldValue);
    return new DataConstraintError(
      `${formattedfieldValue} already registered. Please choose another.`,
      error.stack
    );
  } else if (error instanceof mongoose.Error.ValidationError) {
    const [kind, path, value] = Object.entries(error.errors)[0];
    const formattedPath = capitalise(path.path);

    switch (path.kind) {
      case 'required':
        return new ValidationError(`${formattedPath} is required`, error.stack);
      case 'minlength':
        return new ValidationError(
          `${formattedPath} must be ${path.properties.minlength} characters or more`,
          error.stack
        );
      case 'maxlength':
        return new ValidationError(
          `${formattedPath} must be ${path.properties.maxlength} characters or less`,
          error.stack
        );
    }
  }

  if (
    process.env.NODE_ENV === 'production' &&
    !(error instanceof FriendlyError)
  ) {
    return new Error('Something went wrong, please try again later.');
  }

  return error;
}

const capitalise = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export {
  FriendlyError,
  InputError,
  ValidationError,
  DataConstraintError,
  convertToFriendlyError,
};
