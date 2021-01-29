/**
 * @module app
 * @desc Manages the express configuration settings for the application.
 * @requires express
 */

import express from 'express';
import indexRouter from './routes/index.js';
import validationRouter from './routes/validation.js';

const app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/validate', validationRouter);

// Throw error when user enters wrong Endpoints
app.use('*', (req, res) =>
  res.status(404).send({
    error:
      'Oops! Endpoint not found, Please Check that you are entering the right thing!',
  })
);

app.use((err, _, res, next) => {
  if (res.headersSent) return next(err);

  if (err.message.search('JSON') !== -1) {
    err.message = 'Invalid JSON payload passed.';
  }
  res.status(500).json({
    message: err.message,
    status: 'error',
    data: null,
  });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is live on PORT: ${port}`);
});

export default app;
