import { DataSource, Repository } from 'typeorm';
import { Approver, Transaction } from '../interfaces/transaction.interface';
import { User } from '../interfaces/user.interface';
export declare class TransactionService {
    connection: DataSource;
    repository: Repository<Transaction>;
    constructor();
    createTransaction(trans: Transaction): Promise<Transaction>;
    getTransactionById(id: number): Promise<Transaction | null>;
    getAllTransactions(): Promise<Transaction[]>;
    getTransactionsWaintingForApproval(): Promise<Transaction[]>;
    getUsersWaitingByTransactionId(id: number): Promise<User[]>;
    getUserRoleInTransaction(id: number, user: User): Promise<Approver | null>;
    updateTransactionStatus(id: number, user: User): Promise<boolean>;
}
