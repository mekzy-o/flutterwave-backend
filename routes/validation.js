import express from 'express';
import dataValidations from '../utils/ruleValidator.js';
import validate from '../middleware/requestValidation.js';

const router = express.Router();
const { requestValidator } = validate;

router.post('/', requestValidator, (req, res) => {
  const { rule } = req.body;
  const { field } = rule;
  const successMessage = `field ${field} successfully validated.`;
  const errorMessage = `field ${field} failed validation.`;
  const result = dataValidations(req.body);
  try {
    if (result) {
      return res.status(200).json({
        message: successMessage,
        status: 'success',
        data: {
          validation: {
            error: false,
            field: field,
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
          condition: rule.condition,
          condition_value: rule.condition_value,
        },
      },
    });
  } catch (error) {
    console.log(error, 'caught here');

    res.status(400).json({
      message: error.message,
      status: 'error',
      data: null,
    });
  }
});

export default router;
