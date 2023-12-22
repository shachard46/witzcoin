"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
const transaction_interface_1 = require("../interfaces/transaction.interface");
const backend_constants_1 = require("../backend-constants");
class TransactionService {
    constructor() {
        this.initializeDatabaseConnection();
    }
    async initializeDatabaseConnection() {
        this.connection = new typeorm_1.DataSource({
            type: 'mysql',
            host: 'localhost',
            port: backend_constants_1.DB_PORT,
            username: backend_constants_1.DB_USERNAME,
            password: backend_constants_1.DB_PASSWORD,
            database: backend_constants_1.DB_NAME,
            logging: true,
            entities: [transaction_interface_1.Transaction],
            synchronize: true,
        });
        await this.connection.initialize();
        this.repository = this.connection.getRepository(transaction_interface_1.Transaction);
    }
    async createTransaction(trans) {
        await this.repository.save(trans);
        return trans;
    }
    async getTransactionById(id) {
        return await this.repository.findOne({ where: { id: id } });
    }
    async getAllTransactions() {
        return await this.repository.find();
    }
    async getTransactionsWaintingForApproval() {
        return await this.repository.find({
            where: {
                status: transaction_interface_1.Approver.BUYER + transaction_interface_1.Approver.SELLER + transaction_interface_1.Approver.WITNESS,
            },
        });
    }
    async getUsersWaitingByTransactionId(id) {
        const trans = await this.getTransactionById(id);
        if (!trans) {
            return [];
        }
        const approvers = [];
        const approver_codes = (0, utils_1.breakToBase2)(trans.status);
        approver_codes.forEach(approver => {
            switch (approver) {
                case transaction_interface_1.Approver.BUYER:
                    approvers.push(trans.buyerUser);
                    break;
                case transaction_interface_1.Approver.SELLER:
                    approvers.push(trans.sellerUser);
                    break;
                case transaction_interface_1.Approver.WITNESS:
                    approvers.push(trans.witnessUser);
                    break;
                default:
                    break;
            }
        });
        return approvers;
    }
    async getUserRoleInTransaction(id, user) {
        const transaction = await this.getTransactionById(id);
        if (transaction?.buyerUser === user)
            return transaction_interface_1.Approver.BUYER;
        if (transaction?.sellerUser === user)
            return transaction_interface_1.Approver.SELLER;
        if (transaction?.witnessUser === user)
            return transaction_interface_1.Approver.WITNESS;
        return null;
    }
    async updateTransactionStatus(id, user) {
        const role = this.getUserRoleInTransaction(id, user);
        if (!role)
            return false;
        this.repository.update(id, { status: () => `status - ${role}` });
        return true;
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map