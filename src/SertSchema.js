import 'core-js/fn/array/is-array';
import tv4 from 'tv4';
import Sert from 'sert';

let SertSchema = {
    ...Sert
};

function _flatten(error) {
    if (Array.isArray(error.subErrors) && error.subErrors.length > 0) {
        error.message = error.message
            + ' (Possible reasons: ' + error.subErrors.map(err => _flatten(err).message).join(' / ') + ')';
    }

    return error;
}

function _pathMessage(error) {
    return `${error.message} at path "${error.dataPath || '/'}"`;
}

/**
 * Validate an object by a schema
 * @param {object} schema Validation schema
 * @param {object} subject Object to validate
 * @param {object} options Error message options
 * @param {string} [options.message] Error message
 * @param {string} [options.status] Error message status
 * @return {undefined|Error} Error if invalid, undefined if valid
 */
SertSchema.validate = (schema, subject, { message = null, status = null } = {}) => {
    if ((typeof schema) !== 'object') {
        throw new Error('Invalid schema');
    }

    const result = tv4.validateMultiple(subject, schema);
    if (result.valid) {
        return undefined;
    }

    const errors = [].concat(...result.errors.map(_flatten));

    // Generate error message
    let err = new Error(message || `Invalid ${schema.title || 'object'}`);

    err.summary = errors.length > 1 ?
        `${_pathMessage(errors[0])}, and ${errors.length - 1} other validation ${errors.length > 2 ? 'errors' : 'error'}.` // eslint-disable-line max-len
        : _pathMessage(errors[0]);

    err.details = (errors.length > 1 ? 'All validation errors: ' : '') +
        errors.map(_pathMessage).join('. ') + '.';

    if (status) {
        err.status = status;
    }

    err.messages = errors.map(_pathMessage);

    err.propMessages = errors.reduce((propMessages, error) => {
        const existingPathErrors = propMessages[error.dataPath] || [];
        return {
            ...propMessages,
            [error.dataPath]: [...existingPathErrors, error.message]
        };
    }, {});

    return err;
};

/**
 * Assert an object to be valid by a schema, throwing an error if not valid
 * @param {object} schema Validation schema
 * @param {object} subject Object to validate
 * @param {object} options Error message options
 * @param {string} [options.message] Error message
 * @param {string} [options.status] Error message status
 * @return {object} Subject (for call chains)
 */
SertSchema.assertValid = (schema, subject, { message = null, status = null } = {}) => {
    const res = SertSchema.validate(schema, subject, { message, status });
    if (res instanceof Error) {
        throw res;
    }
    return subject;
};

/**
 * Validate an object by a schema
 * @param {object} schema Validation schema
 * @param {object} subject Object to validate
 * @return {bool} True if valid, false if invalid
 */
SertSchema.isValid = (schema, subject) => {
    return tv4.validate(subject, schema);
};



export default SertSchema;
