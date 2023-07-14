from typing import Tuple, Callable

from server.models.packet import Response, Request
from server.models.tcp_server import TCPServer


class Route:
    def __init__(self, path: str, args: list, action: Callable):
        self.path = path
        self.args = args
        self.action = action

    def run(self, *args):
        self.action(args)


class RouteServer(TCPServer):
    def __init__(self, address: Tuple[str, int]):
        super().__init__(address)
        self.routes =

    def handle_request(self, request: Request) -> Response:
        pass

    def handle_response(self, response: Response):
        pass
