// backend/utils/csvExport.ts
import { format } from 'fast-csv';
import { Response } from 'express';

export const exportToCSV = (
  res: Response,
  fileName: string,
  headers: { id: string; title: string }[],
  rows: any[]
) => {
  res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
  res.setHeader('Content-Type', 'text/csv');

  const csvStream = format({ headers: true });
  csvStream.pipe(res);

  rows.forEach((row) => {
    const mapped: Record<string, any> = {};
    headers.forEach((h) => {
      mapped[h.title] = row[h.id]; // match keys to header titles
    });
    csvStream.write(mapped);
  });

  csvStream.end();
};
