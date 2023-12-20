import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { User } from 'src/interfaces/user.interface'
import { TransactionService } from 'src/services/transaction.service'

@WebSocketGateway()
export class ApproveTransactionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server
  constructor(private transactionService: TransactionService) {}

  handleConnection(client: Socket) {
    this.server.emit('connection', 'A new client has connected.')
  }

  handleDisconnect(client: Socket) {
    this.server.emit('connection', 'A client has disconnected.')
  }
  @SubscribeMessage('new_transaction')
  SendNewApprovingUsers(@MessageBody() id: number): Promise<User[]> {
    return this.transactionService.getUsersWaitingByTransactionId(id)
  }
}
