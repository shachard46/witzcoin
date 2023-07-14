from server.models.packet import Request, Response
from server.models.route_server import RouteServer


class TCPClient:

    def __init__(self, server: RouteServer) -> None:
        self.server = server

    def connect(self):
        self.server.sok.connect((self.server.host, self.server.port))

    def send_request(self, path: str, params=None) -> Response:
        if params is None:
            params = {}
        middle_response = Response(path, params)
        return self.server.handle_request(Request(middle_response.raw))
