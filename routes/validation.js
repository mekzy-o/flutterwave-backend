import express from 'express';
import dataValidations from '../utils/ruleValidator.js';
import requestBodyValidation from '../middleware/requestValidation.js';

const router = express.Router();

router.post('/', requestBodyValidation, (req, res) => {
  const { rule, data } = req.body;
  const { field } = rule;
  const successMessage = `field ${field} successfully validated.`;
  const errorMessage = `field ${field} failed validation.`;
  const result = dataValidations(req.body);
  let splitField = field.split('.');
  const field_value =
    splitField.length === 2
      ? data[splitField[0]][splitField[1]]
      : data[splitField[0]];

  try {
    if (result) {
      return res.status(200).json({
        message: successMessage,
        status: 'success',
        data: {
          validation: {
            error: false,
            field: field,
            field_value: field_value,
            condition: rule.condition,
            condition_value: rule.condition_value,
          },
        },
      });
    }

    return res.status(400).json({
      message: errorMessage,
      status: 'error',
      data: {
        validation: {
          error: true,
          field: field,
          field_value: field_value,
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: 'error',
      data: null,
    });
  }
});

export default router;
