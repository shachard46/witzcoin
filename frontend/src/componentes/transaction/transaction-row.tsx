import React from "react";
import { Transaction } from "./models";
import { Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export const TransactionRow: React.FC<Transaction> = (transaction: Transaction) => {
      const [open, setOpen] = React.useState(false);

    return <React.Fragment>
        <TableRow>

            <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
            <TableCell align="center">{transaction.transactionName}</TableCell>
            <TableCell align="center">{transaction.buyerUsername}</TableCell>
            <TableCell align="center">{transaction.sellerUsername}</TableCell>
            <TableCell align="center">{transaction.witnessUsername}</TableCell>
            <TableCell align="center">{transaction.price}</TableCell>
            <TableCell align="center">{transaction.category.reduce((a, b)=> a+'\n'+b)}</TableCell> {/*need to expand to list */}
        </TableRow>
        <TableRow>
            <Collapse in={open}>
                <div>{transaction.details}</div>
                <div>{transaction.status}</div>
            </Collapse>
        </TableRow>
    </React.Fragment>
}