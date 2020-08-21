// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const findTransaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!findTransaction) throw new Error('transaction was not found');
    await transactionRepository.remove(findTransaction);
  }
}

export default DeleteTransactionService;
