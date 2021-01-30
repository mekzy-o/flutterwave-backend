/**
 * @module app
 * @desc Manages the express configuration settings for the application.
 * @requires express
 */

import express from 'express';
import indexRouter from './routes/index.js';
import validationRouter from './routes/validation.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/', indexRouter);
app.use('/validate-rule', validationRouter);

// Throw error when user enters wrong Endpoints
app.use('*', (req, res) =>
  res.status(404).send({
    message:
      'Oops! Endpoint not found, Please Check that you are entering the right thing!',
    status: 'error',
    data: null,
  })
);

app.use(function (err, _, res, next) {
  if (res.headersSent) return next(err);

  if (err.message.search('JSON') !== -1) {
    err.message = 'Invalid JSON payload passed.';
  }

  res.status(err.status || 400).json({
    message: err.message ? err.message : 'Something went wrong!',
    status: 'error',
    data: null,
  });
});

app.listen(port, () => {
  console.log(`Server is live on PORT: ${port}`);
});

export default app;
