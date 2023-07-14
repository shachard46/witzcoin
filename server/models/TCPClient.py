from server.models.packet import Request, Response
from server.models.route_server import RouteServer


class TCPClient:

    def __init__(self, server: RouteServer) -> None:
        self.server = server

    def connect(self):
        self.server.sok.connect((self.server.host, self.server.port))

    def send_request(self, request: Request) -> Response:
        return self.server.handle_request(request)
