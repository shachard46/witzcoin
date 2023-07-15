import abc
import socket
from abc import ABC

from server.models.packet import Response, Request, Packet


class TCPServer(ABC):

    def __init__(self, host: str, port: int) -> None:
        self.KILL = False
        self.host = host
        self.port = port
        self.sok = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.empty_packets = 0

    def __bind_connection(self):
        self.sok.bind((self.host, self.port))
        self.sok.listen()

    def __wait_for_connection(self):
        print('listening on port ' + str(self.port))
        conn, addr = self.sok.accept()
        print('found connection')
        while not self.KILL:
            try:
                self.__on_connection(conn)
            except Exception as e:
                print(e)
                self.restart()

    def handle_empty_packets(self, packet):
        if not packet:
            print(self.empty_packets, packet, ':)')
            self.empty_packets += 1
            if self.empty_packets > 15:
                self.restart()
            return ''
        self.empty_packets = 0
        return 'not empty'

    def __receive_packets(self, conn: socket.socket):
        packets = []
        while True:
            packet = conn.recv(Packet.PACKET_SIZE).decode()
            if not self.handle_empty_packets(packet):
                break
            packets.append(packet)
            if not packet.endswith(Request.codes['end_packet']):
                break
        return packets

    def __on_connection(self, conn: socket.socket):
        packets = self.__receive_packets(conn)
        if not packets:
            return
        request = Request(packets)
        if not request.path:
            self.KILL = request.path == 'kill'
            return
        response: Response = self.handle_request(request)
        if not response:
            return
        for packet in response.raw:
            print(f'responding on {request.path}')
            conn.sendall(packet.encode())

    def restart(self):
        print('restarting')
        self.__wait_for_connection()

    def raise_server(self):
        self.__bind_connection()
        self.__wait_for_connection()

    @abc.abstractmethod
    def handle_request(self, request: Request) -> Response:
        pass
