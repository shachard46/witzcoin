export interface Transaction {
buyerUsername: string
sellerUsername: string
witnessUsername: string
transactionName: string
    category: string[]
    price: number
    details: string
    status: number
}

export enum Approver {
  BUYER = 1,
  SELLER = 2,
  WITNESS = 4,
  DECLINE = 1000,
  NON = 0,
  ALL = 7,
}
