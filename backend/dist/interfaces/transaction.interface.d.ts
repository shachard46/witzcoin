import { User } from './user.interface';
export declare enum Approver {
    BUYER = 1,
    SELLER = 2,
    WITNESS = 4
}
export declare class Transaction {
    id: number;
    transactionName: string;
    buyerUser: User;
    sellerUser: User;
    witnessUser: User;
    category: string;
    details: string;
    status: number;
    constructor(transactionName: string, buyerUser: User, sellerUser: User, witnessUser: User, category: string, details: string, status: number);
}
