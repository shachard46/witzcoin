import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useTransactions } from "./transactions-provider";
import { TransactionRow } from "./transaction-row";

export const TransactionHistoryPage: React.FC = () => {
    const transactions = useTransactions()
    return  <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>שם העסקה</TableCell>
            <TableCell align="center">שם הקונה</TableCell>
            <TableCell align="center">שם המוכר</TableCell>
            <TableCell align="center">שם העד</TableCell>
            <TableCell align="center">מחיר</TableCell>
            <TableCell align="center">קטגוריות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TransactionRow key={transactions.indexOf(transaction)} transaction={transaction} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
}