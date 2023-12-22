import { DataSource, Repository } from 'typeorm';
import { User } from '../interfaces/user.interface';
export declare class UserService {
    connection: DataSource;
    repository: Repository<User>;
    constructor();
    private initializeDatabaseConnection;
    createUser(user: User): Promise<User>;
    getUserByUsername(username: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    auth(username: string, password: string): Promise<boolean>;
}
