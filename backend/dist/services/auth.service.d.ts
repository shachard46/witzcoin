import { DataSource, Repository } from 'typeorm';
import { AuthUserDto, User } from '../interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    connection: DataSource;
    repository: Repository<User>;
    jwtService: JwtService;
    constructor();
    private initializeDatabaseConnection;
    signIn(user: AuthUserDto): Promise<any>;
}
