import socket

from server.models.packet import Request, Response


class TCPClient:

    def __init__(self, host, port) -> None:
        self.host, self.port = host, port
        self.sok = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def connect(self):
        self.sok.connect((self.host, self.port))

    def send_request(self, path: str, params=None) -> Response:
        if params is None:
            params = {}
        self.sok.sendall(Request.send_request(path, params))
        return Response.get_response(self.sok.recv(1024).decode())
