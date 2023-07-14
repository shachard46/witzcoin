import abc
import socket
from abc import ABC

from server.models.packet import Response, Request

DEF = ('127.0.0.1', 8765)


class TCPServer(ABC):

    def __init__(self, host: str, port: int) -> None:
        self.KILL = False
        self.host = host
        self.port = port
        self.sok = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def __bind_connection(self):
        self.sok.bind((self.host, self.port))
        self.sok.listen()

    def __wait_for_connection(self):
        conn, addr = self.sok.accept()
        while not self.KILL:
            self.__on_connection(conn)

    @staticmethod
    def __receive_packets(conn: socket.socket):
        packets = []
        p = conn.recv(1024).decode()
        while p.endswith(Request.codes['end_packet']):
            packets.append(p)
            p = conn.recv(1024).decode()
        return packets

    def __on_connection(self, conn: socket.socket):
        packets = TCPServer.__receive_packets(conn)
        request = Request(packets)
        response: Response = self.handle_request(request)
        if not response:
            return
        for packet in response.raw:
            conn.sendall(packet.encode())

    def close(self):
        self.sok.close()

    def raise_server(self):
        self.__bind_connection()
        self.__wait_for_connection()

    @abc.abstractmethod
    def handle_request(self, request: Request) -> Response:
        pass
