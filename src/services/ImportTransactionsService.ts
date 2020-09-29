import path from 'path';

import uploadConfig from '../config/upload';
import csvparser from '../utils/csvparser';

interface Request {
  csvFilename: string;
}
interface TransactionImported {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class ImportTransactionsService {
  async execute({ csvFilename }: Request): Promise<TransactionImported[]> {
    if (!csvFilename) {
      throw new Error('CSV was not found');
    }
    const csvFilePath = path.join(uploadConfig.directory, csvFilename);
    const transactionsImported = await csvparser(csvFilePath);
    if (!transactionsImported) {
      throw new Error('no transactions found');
    } else {
      return transactionsImported;
    }
  }
}

export default ImportTransactionsService;
