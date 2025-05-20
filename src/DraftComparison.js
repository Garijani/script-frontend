//src/DraftComparison.js

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from '@mui/material';

export default function DraftComparison({ script, draftIndexA, draftIndexB }) {
  const draftA = script?.drafts?.[draftIndexA]?.breakdown || [];
  const draftB = script?.drafts?.[draftIndexB]?.breakdown || [];
  const fields = ["sceneNumber", "location", "intExt", "time", "set", "characters", "actionSummary"];
  const maxLength = Math.max(draftA.length, draftB.length);

  const normalize = (v) => (Array.isArray(v) ? v.join(', ') : (v || '').toString());

  const getHighlightStyle = (field, rowIndex) => {
    const valA = normalize(draftA[rowIndex]?.[field]);
    const valB = normalize(draftB[rowIndex]?.[field]);
    return valA !== valB ? { backgroundColor: 'rgba(255, 235, 59, 0.5)' } : {};
  };

  const renderTable = (draft, label, side) => (
    <Card sx={{ flex: 1 }}>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>{label}</Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {fields.map((field) => (
                  <TableCell key={field}><strong>{field.toUpperCase()}</strong></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(maxLength)].map((_, i) => (
                <TableRow key={i}>
                  {fields.map((field) => (
                    <TableCell key={field} sx={getHighlightStyle(field, i)}>
                      {normalize(draft[i]?.[field]) || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ px: 3 }}>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'nowrap' }}>
        {renderTable(draftA, `Draft ${draftIndexA + 1}`, 'A')}
        {renderTable(draftB, `Draft ${draftIndexB + 1}`, 'B')}
      </Box>
    </Box>
  );
}
