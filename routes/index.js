import express from 'express';
const router = express.Router();

router.get('/', (_, res) => {
  res.json({
    message: 'My Rule-Validation API',
    status: 'success',
    data: {
      name: 'Ofe Emeka',
      github: '@mekzy-o',
      email: 'emekaofe22@gmail.com',
      mobile: '08138518677',
      twitter: '@EmekaOfe',
    },
  });
});

export default router;
