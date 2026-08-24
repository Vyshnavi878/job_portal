import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * Table component with sorting
 * @param {Array}   columns  - [{ key, label, sortable, render, width }]
 * @param {Array}   data     - rows array
 * @param {boolean} loading
 * @param {boolean} selectable
 * @param {Array}   selected - selected row ids
 * @param {Function} onSelect
 * @param {string}  rowKey   - key for row id (default 'id')
 * @param {string}  emptyText
 */
export default function Table({
  columns = [],
  data = [],
  loading = false,
  selectable = false,
  selected = [],
  onSelect,
  rowKey = 'id',
  emptyText = 'No data found',
  onSort,
  sortKey,
  sortDir = 'asc',
}) {
  const allSelected = data.length > 0 && data.every((row) => selected.includes(row[rowKey]));

  const toggleAll = () => {
    if (allSelected) onSelect([]);
    else onSelect(data.map((r) => r[rowKey]));
  };

  const toggleRow = (id) => {
    if (selected.includes(id)) onSelect(selected.filter((s) => s !== id));
    else onSelect([...selected, id]);
  };

  const handleSort = (col) => {
    if (!col.sortable || !onSort) return;
    const newDir = sortKey === col.key && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(col.key, newDir);
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {selectable && (
              <th className="table-checkbox-col">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all"
                  style={{ cursor: 'pointer' }}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={sortKey === col.key ? 'sorted' : ''}
                onClick={() => handleSort(col)}
                aria-sort={sortKey === col.key ? sortDir : undefined}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {col.label}
                  {col.sortable && (
                    <span className="sort-icon">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      ) : (
                        <ChevronsUpDown size={12} />
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {selectable && <td><div style={{ width: 16, height: 16, background: 'var(--color-gray-200)', borderRadius: 4 }} /></td>}
                {columns.map((col) => (
                  <td key={col.key}>
                    <div className="skeleton" style={{ height: 14, borderRadius: 4 }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[rowKey]}>
                {selectable && (
                  <td className="table-checkbox-col">
                    <input
                      type="checkbox"
                      checked={selected.includes(row[rowKey])}
                      onChange={() => toggleRow(row[rowKey])}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
