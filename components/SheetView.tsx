import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useData, useAuth } from '../App';
import { PermissionLevel } from '../types';

const SheetView: React.FC = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const { sheets, updateCell, addColumn } = useData();
  const { hasPermission } = useAuth();
  const [editingCell, setEditingCell] = useState<{ row: number; cell: number } | null>(null);

  const sheet = useMemo(() => sheets.find(s => s.id === sheetId), [sheets, sheetId]);

  const canEdit = hasPermission(PermissionLevel.DATA_ENTRY);
  const canAddColumn = hasPermission(PermissionLevel.EDITOR);

  const handleCellChange = (rowIndex: number, cellIndex: number, value: string) => {
    if (!sheetId) return;
    updateCell(sheetId, rowIndex, cellIndex, value);
  };
  
  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (canEdit) {
      setEditingCell({ row: rowIndex, cell: cellIndex });
    }
  };

  const handleAddColumn = () => {
    if (!sheetId) return;
    const columnName = prompt("الرجاء إدخال اسم الخانة الجديدة:");
    if (columnName && columnName.trim() !== '') {
        addColumn(sheetId, columnName.trim());
    }
  };

  if (!sheet) {
    return <div className="text-center text-red-500">لم يتم العثور على الشيت المطلوب.</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{sheet.title}</h2>
        {canAddColumn && (
            <button
                onClick={handleAddColumn}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
                + إضافة خانة
            </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-blue-800 uppercase tracking-wider border-l border-gray-300 w-12">#</th>
              {sheet.headers.map((header, index) => (
                <th key={index} className="px-6 py-3 text-right text-xs font-bold text-blue-800 uppercase tracking-wider border-l border-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sheet.rows.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-500 border-l border-gray-300">{rowIndex + 1}</td>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cell.id}
                    className={`px-6 py-2 whitespace-nowrap text-sm text-gray-700 border-l border-gray-300 ${canEdit ? 'cursor-pointer' : ''}`}
                    onClick={() => handleCellClick(rowIndex, cellIndex)}
                  >
                    {editingCell?.row === rowIndex && editingCell?.cell === cellIndex ? (
                      <input
                        type="text"
                        defaultValue={cell.value.toString()}
                        onBlur={(e) => {
                            handleCellChange(rowIndex, cellIndex, e.target.value);
                            handleCellBlur();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'Escape') {
                            e.currentTarget.blur();
                          }
                        }}
                        className="w-full p-1 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        autoFocus
                      />
                    ) : (
                      cell.value || <span className="text-gray-400">...</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SheetView;