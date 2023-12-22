import { AuthUserDto } from 'interfaces/user.interface';
import { AuthService } from 'services/auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(user: AuthUserDto): Promise<any>;
}
