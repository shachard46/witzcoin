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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Approver = void 0;
const typeorm_1 = require("typeorm");
const user_interface_1 = require("./user.interface");
var Approver;
(function (Approver) {
    Approver[Approver["BUYER"] = 1] = "BUYER";
    Approver[Approver["SELLER"] = 2] = "SELLER";
    Approver[Approver["WITNESS"] = 4] = "WITNESS";
})(Approver || (exports.Approver = Approver = {}));
let Transaction = class Transaction {
    constructor(transactionName, buyerUser, sellerUser, witnessUser, category, details, status) {
        this.transactionName = transactionName;
        this.buyerUser = buyerUser;
        this.sellerUser = sellerUser;
        this.witnessUser = witnessUser;
        this.category = category;
        this.details = details;
        this.status = status;
    }
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "transactionName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_interface_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'buyerUserId' }),
    __metadata("design:type", user_interface_1.User)
], Transaction.prototype, "buyerUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_interface_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'sellerUserId' }),
    __metadata("design:type", user_interface_1.User)
], Transaction.prototype, "sellerUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_interface_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'witnessUserId' }),
    __metadata("design:type", user_interface_1.User)
], Transaction.prototype, "witnessUser", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transaction.prototype, "status", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, user_interface_1.User,
        user_interface_1.User,
        user_interface_1.User, String, String, Number])
], Transaction);
//# sourceMappingURL=transaction.interface.js.map