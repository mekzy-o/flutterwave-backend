import { check, validationResult } from 'express-validator';

const validate = {
  requestValidator: [
    check('rule')
      .not()
      .isEmpty()
      .withMessage('rule is required.')
      .custom((value) => {
        if (typeof value == 'object' && !Array.isArray(value)) {
          return true;
        }
        return false;
      })
      .withMessage('rule should be an object.')
      .notEmpty()
      .custom((value) => {
        if (!value.field) {
          throw new Error('rule field is required.');
        }
        if (!value.condition) {
          throw new Error('rule condition is required.');
        }
        if (!value.condition_value) {
          throw new Error('rule condition_value is required.');
        }
        if (!value.condition == ('gte' || 'gt' || 'lt' || 'contains')) {
          throw new Error('Invalid condition_value was provided.');
        }
        return true;
      }),
    check('data')
      .not()
      .isEmpty()
      .withMessage('data is required.')
      .custom((value) => {
        if (
          typeof value == 'object' ||
          Array.isArray(value) ||
          typeof value == 'string'
        ) {
          return true;
        }
        return false;
      })
      .withMessage('data should be an object, array or string.'),
    (req, res, next) => {
      const errors = validationResult(req);
      let errorMessage = '';
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach((error) => {
          errorMessage = error.msg;
        });
        return res.status(400).json({
          message: errorMessage,
          status: 'error',
          data: null,
        });
      }
      return next();
    },
  ],
};

export default validate;
