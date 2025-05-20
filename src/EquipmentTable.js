//src/EquipmentTable.js

import React, { useState, useEffect, useRef } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';

export default function EquipmentTable({
  columns = [],
  rows = [],
  onDeleteRow = () => {},
  onDeleteColumn = () => {},
  onAddColumnLeft = () => {},
  onAddColumnRight = () => {},
  onRenameColumn = () => {},
  onEditCell = () => {},
}) {
  const [headerMenu, setHeaderMenu] = useState({ anchor: null, colIndex: null });
  const [rowMenu, setRowMenu] = useState({ anchor: null, rowId: null });

  const [editingHeaderIdx, setEditingHeaderIdx] = useState(null);
  const [headerValue, setHeaderValue] = useState('');
  const headerInputRef = useRef();

  const [editingCell, setEditingCell] = useState({ rowId: null, col: null });
  const [cellValue, setCellValue] = useState('');
  const cellInputRef = useRef();
  const user = JSON.parse(localStorage.getItem('user'));
  const canEdit = user?.permissions?.includes('manageInventory') || user?.role === 'Admin';


  useEffect(() => {
    if (editingHeaderIdx !== null && headerInputRef.current) {
      headerInputRef.current.focus();
      headerInputRef.current.select();
    }
  }, [editingHeaderIdx]);

  useEffect(() => {
    if (editingCell.rowId !== null && cellInputRef.current) {
      cellInputRef.current.focus();
      cellInputRef.current.select();
    }
  }, [editingCell]);

  const openHeaderMenu = (e, idx) => {
    e.preventDefault();
    setHeaderMenu({ anchor: e.currentTarget, colIndex: idx });
  };
  const closeHeaderMenu = () => setHeaderMenu({ anchor: null, colIndex: null });

  const openRowMenu = (e, id) => {
    e.preventDefault();
    setRowMenu({ anchor: e.currentTarget, rowId: id });
  };
  const closeRowMenu = () => setRowMenu({ anchor: null, rowId: null });

  const handleHeaderDoubleClick = idx => {
    setHeaderValue(columns[idx]);
    setEditingHeaderIdx(idx);
  };

  const commitHeader = () => {
    if (headerValue.trim() && headerValue !== columns[editingHeaderIdx]) {
      onRenameColumn(editingHeaderIdx, headerValue.trim());
    }
    setEditingHeaderIdx(null);
  };
  const cancelHeader = () => setEditingHeaderIdx(null);

  const handleCellDoubleClick = (rowId, col) => {
    const row = rows.find(r => r.id === rowId);
    const safeKey = Object.keys(row).find(k => k.trim() === col.trim());
    setCellValue(row[safeKey] ?? '');
    setEditingCell({ rowId, col });
  };

  const commitCell = () => {
    onEditCell(editingCell.rowId, editingCell.col, cellValue);
    setEditingCell({ rowId: null, col: null });
  };
  const cancelCell = () => setEditingCell({ rowId: null, col: null });

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={`${col}-${idx}`}
                  onContextMenu={e => openHeaderMenu(e, idx)}
                  onDoubleClick={canEdit ? () => handleHeaderDoubleClick(idx) : undefined}
                  sx={{
                    fontWeight: 'bold',
                    borderBottom: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {editingHeaderIdx === idx && canEdit ? (
                    <TextField
                      inputRef={headerInputRef}
                      size="small"
                      value={headerValue}
                      onChange={e => setHeaderValue(e.target.value)}
                      onBlur={commitHeader}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitHeader();
                        if (e.key === 'Escape') cancelHeader();
                      }}
                    />
                  ) : (
                    col
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map(row => (
              <TableRow
                key={row.id}
                hover
                onContextMenu={e => openRowMenu(e, row.id)}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                {columns.map(col => {
                  const safeKey = Object.keys(row).find(k => k.trim() === col.trim());

                  return (
                    <TableCell
                      key={`${row.id}-${col}`}
                      sx={{ border: 0, cursor: 'pointer' }}
                      onDoubleClick={canEdit ? () => handleCellDoubleClick(row.id, col) : undefined}
                    >
                      {editingCell.rowId === row.id && editingCell.col === col && canEdit ? (
                        <TextField
                          inputRef={cellInputRef}
                          size="small"
                          value={cellValue}
                          onChange={e => setCellValue(e.target.value)}
                          onBlur={commitCell}
                          onKeyDown={e => {
                            if (e.key === 'Enter') commitCell();
                            if (e.key === 'Escape') cancelCell();
                          }}
                        />
                      ) : (
                        row[safeKey] ?? ''
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {canEdit && (
        <Menu open={Boolean(headerMenu.anchor)} anchorEl={headerMenu.anchor} onClose={closeHeaderMenu}>
          <MenuItem onClick={() => { onDeleteColumn(headerMenu.colIndex); closeHeaderMenu(); }}>
            Delete Column
          </MenuItem>
          <MenuItem onClick={() => { onAddColumnLeft(headerMenu.colIndex); closeHeaderMenu(); }}>
            Add Column to Left
          </MenuItem>
          <MenuItem onClick={() => { onAddColumnRight(headerMenu.colIndex); closeHeaderMenu(); }}>
            Add Column to Right
          </MenuItem>
        </Menu>
      )}

      {canEdit && (
        <Menu open={Boolean(rowMenu.anchor)} anchorEl={rowMenu.anchor} onClose={closeRowMenu}>
          <MenuItem onClick={() => { onDeleteRow(rowMenu.rowId); closeRowMenu(); }}>
            Delete Row
          </MenuItem>
        </Menu>
      )}
    </>
  );
}
