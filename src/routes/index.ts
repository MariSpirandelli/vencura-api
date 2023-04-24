import express from 'express';

import walletsRouter from './wallets';

const router = express.Router();

router.use('/wallets', walletsRouter);

export = router;
