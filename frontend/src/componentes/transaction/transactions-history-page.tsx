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
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
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