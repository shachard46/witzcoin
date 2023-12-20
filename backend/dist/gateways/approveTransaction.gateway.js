"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveTransactionGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const transaction_service_1 = require("../services/transaction.service");
let ApproveTransactionGateway = class ApproveTransactionGateway {
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    handleConnection(client) {
        this.server.emit('connection', 'A new client has connected.');
    }
    handleDisconnect(client) {
        this.server.emit('connection', 'A client has disconnected.');
    }
    SendNewApprovingUsers(id) {
        return this.transactionService.getUsersWaitingByTransactionId(id);
    }
};
exports.ApproveTransactionGateway = ApproveTransactionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ApproveTransactionGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('new_transaction'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ApproveTransactionGateway.prototype, "SendNewApprovingUsers", null);
exports.ApproveTransactionGateway = ApproveTransactionGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], ApproveTransactionGateway);
//# sourceMappingURL=approveTransaction.gateway.js.map