// src/components/Table/Table.tsx
import React from 'react';
import './Table.css';

interface TableProps {
  columns: string[];
  data: (string | number)[][];
}

const Table = ({ columns, data }: TableProps) => {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rIdx) => (
          <tr key={rIdx}>
            {row.map((cell, cIdx) => (
              <td key={cIdx}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
