import csvParse from 'csv-parse';
import fs from 'fs';

interface TransactionCSV {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
export default async function csvparser(
  filepath: string,
): Promise<TransactionCSV[]> {
  const readCSVStream = fs.createReadStream(filepath);
  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const transactionList: TransactionCSV[] = [];

  parseCSV.on('data', line => {
    // transactionList.push(line.);
    transactionList.push({
      title: line[0],
      type: line[1],
      value: line[2],
      category: line[3],
    });
  });

  await new Promise(resolve => parseCSV.on('end', resolve));

  return transactionList;
}
