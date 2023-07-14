import abc
import socket
from abc import ABC
from typing import Tuple

from server.models.packet import Response, Request

DEF = ('127.0.0.1', 8765)


class TCPServer(ABC):

    def __init__(self, address: Tuple[str, int]) -> None:
        self.KILL = False
        self.address = address
        self.sok = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def __bind_connection(self):
        self.sok.bind(self.address)
        self.sok.listen()

    def __wait_for_connection(self):
        conn, addr = self.sok.accept()
        while not self.KILL:
            self.__on_connection(conn)

    def __on_connection(self, conn: socket.socket):
        request = Request(conn.recv(1024).decode())
        response: Response = self.handle_request(request)
        self.handle_response(response)

    def close(self):
        self.sok.close()

    def raise_server(self):
        self.__bind_connection()
        self.__wait_for_connection()

    @abc.abstractmethod
    def handle_request(self, request: Request) -> Response:
        pass

    @abc.abstractmethod
    def handle_response(self, response: Response):
        pass


