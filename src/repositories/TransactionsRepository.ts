import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const findBalance = await this.find();
    const outcome = findBalance.reduce(
      (accumulator, current) => {
        if (current.type === 'outcome') accumulator.value += current.value;
        return accumulator;
      },
      { value: 0 },
    ).value;
    const income = findBalance.reduce(
      (accumulator, current) => {
        if (current.type === 'income') accumulator.value += current.value;
        return accumulator;
      },
      { value: 0 },
    ).value;

    const total = income - outcome;

    const balance = { outcome, income, total };
    return balance;
  }
}

export default TransactionsRepository;
