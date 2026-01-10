import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Loader, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

import api from '../utils/api';
import CustomDropdown from './CustomDropdown';


// Simple debounce utility if lodash is not installed or to keep it light
/**
 * Custom hook for debouncing values.
 * @param {any} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {any} The debounced value.
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

/**
 * ApiTableManager Component
 * 
 * A reusable table component that handles server-side pagination, searching, and data fetching.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.fetchUrl - The API endpoint URL to fetch data from.
 * @param {Array<Object>} props.columns - Array of column definitions.
 * @param {Function} [props.actions] - Render prop for action buttons for each row.
 * @param {string} [props.title="List"] - Title of the table section.
 * @param {string} [props.searchPlaceholder="Search..."] - Placeholder text for the search input.
 * @returns {JSX.Element} The rendered ApiTableManager component.
 */
const ApiTableManager = ({ 
  fetchUrl, 
  columns, 
  actions, 
  title = "List", 
  searchPlaceholder = "Search..." 
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(fetchUrl, {
        params: {
          page,
          limit,
          search: debouncedSearch
        }
      });
      
      const responseData = response.data;
      
      // Handle different API response structures if needed, strictly following the one seen:
      // { success: true, page: 1, limit: 20, total: 2, count: 2, data: [...] }
      if (responseData.data) {
        setData(responseData.data);
        setTotal(responseData.total || responseData.count || 0);
      } else if (Array.isArray(responseData)) {
        // Fallback for direct array response
        setData(responseData);
        setTotal(responseData.length);
      } else {
        setData([]);
        setTotal(0);
      }
      
    } catch (err) {
      console.error('Error fetching table data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, page, limit, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const totalPages = Math.ceil(total / limit);

  // Reset page to 1 when limit changes
  useEffect(() => {
    setPage(1);
  }, [limit]);

  // Clamp page if totalPages changes (e.g. deletion reduces pages)
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(Math.max(1, totalPages));
    }
  }, [page, totalPages]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header Controls */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          <button 
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
            onClick={fetchData} 
            title="Refresh"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
           <Loader className="animate-spin text-purple-600" size={32} />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-500 gap-2">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-t-xl">
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
                {data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr key={row._id || row.id || rowIndex} className="hover:bg-gray-50 transition-colors">
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-400">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <p>Showing {data.length} of {total}</p>
              <div className="w-24">
                <CustomDropdown 
                  options={[
                    { label: '10', value: 10 },
                    { label: '20', value: 20 },
                    { label: '50', value: 50 }
                  ]}
                  value={limit} 
                  onChange={(val) => setLimit(Number(val))}
                  className="ml-2"
                  dropUp={true}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="flex items-center px-2">Page {page} of {Math.max(1, totalPages)}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
              >
                 Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ApiTableManager;
