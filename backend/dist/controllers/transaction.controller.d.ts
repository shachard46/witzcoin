import { Transaction } from '../interfaces/transaction.interface';
import { TransactionService } from '../services/transaction.service';
import { User } from '../interfaces/user.interface';
export declare class TransactionController {
    private transactionService;
    constructor(transactionService: TransactionService);
    createTransaction(trans: Transaction): Promise<Transaction>;
    getTransactionById(id: number): Promise<Transaction | null>;
    getAllTransactions(): Promise<Transaction[]>;
    getTransactionsWaintingForApproval(): Promise<Transaction[]>;
    getUsersWaitingByTransactionId(id: number): Promise<User[]>;
}
