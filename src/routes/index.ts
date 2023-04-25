import express from 'express';

import transactionRouter from './transaction';
import walletsRouter from './wallets';

const router = express.Router();

router.use('/transactions', transactionRouter);
router.use('/wallets', walletsRouter);

export = router;
