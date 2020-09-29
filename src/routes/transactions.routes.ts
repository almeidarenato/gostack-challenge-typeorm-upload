import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;
    const createTransaction = new CreateTransactionService();
    const { id } = await createTransaction.execute({
      title,
      value,
      type,
      category,
    });
    return response.json({ id, title, value, type, category });
  } catch (err) {
    return response.status(400).json({ status: 'error', message: err.message });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const deleteTransaction = new DeleteTransactionService();
    await deleteTransaction.execute({ id });
    return response.status(203).send();
  } catch (err) {
    return response.status(400).json({ status: 'error', message: err.message });
  }
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    try {
      const importTransactions = new ImportTransactionsService();
      const transactions = await importTransactions.execute({
        csvFilename: request.file.filename,
      });

      const createTransaction = new CreateTransactionService();

      const savedTransactions = transactions.map(transaction => {
        const newTransaction = createTransaction.execute(transaction);
        return newTransaction;
      });

      Promise.all(savedTransactions).then(values => {
        return response.json({ values });
      });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'error', message: err.message });
    }
  },
);

export default transactionsRouter;
