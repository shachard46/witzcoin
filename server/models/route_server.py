from typing import Tuple

from server.models.packet import Response, Request
from server.models.tcp_server import TCPServer


class RouteServer(TCPServer):
    def __init__(self, address: Tuple[str, int]):
        super().__init__(address)

    def handle_request(self, request: Request) -> Response:
        pass

    def handle_response(self, response: Response):
        pass
