import React from 'react';

const TableManager = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            {columns.map((col, index) => (
              <th key={index} className={`px-6 py-4 font-medium ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
            {actions && <th className="px-6 py-4 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-right">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-400 text-sm">
          No data available
        </div>
      )}
    </div>
  );
};

export default TableManager;
