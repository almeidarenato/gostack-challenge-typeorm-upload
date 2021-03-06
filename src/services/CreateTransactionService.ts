// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new Error('value has to be lower than the balance');
    }
    const findCategory = await categoriesRepository.findOne({
      where: { title: category },
    });
    if (!findCategory) {
      const newCategory = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(newCategory);

      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category: newCategory,
      });
      await transactionsRepository.save(transaction);

      return transaction;
    }
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: findCategory,
    });
    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
