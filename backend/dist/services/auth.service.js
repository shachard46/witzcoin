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
exports.AuthService = void 0;
const typeorm_1 = require("typeorm");
const user_interface_1 = require("../interfaces/user.interface");
const common_1 = require("@nestjs/common");
const backend_constants_1 = require("../backend-constants");
let AuthService = class AuthService {
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
            entities: [user_interface_1.User],
            synchronize: true,
        });
        await this.connection.initialize();
        this.repository = this.connection.getRepository(user_interface_1.User);
    }
    async signIn(user) {
        const authorized = await this.repository.exist({
            where: { username: user.username, password: user.password },
        });
        if (!authorized)
            return new common_1.UnauthorizedException();
        const payload = { sub: user.username, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthService);
//# sourceMappingURL=auth.service.js.map