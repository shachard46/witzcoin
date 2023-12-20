import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from '../interfaces/user.interface';
import { TransactionService } from '../services/transaction.service';
export declare class ApproveTransactionGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private transactionService;
    server: Server;
    constructor(transactionService: TransactionService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    SendNewApprovingUsers(id: number): Promise<User[]>;
}
