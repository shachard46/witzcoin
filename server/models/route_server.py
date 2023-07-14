import inspect
from typing import Tuple, Callable, List

from server.models.packet import Response, Request
from server.models.tcp_server import TCPServer


class Route:
    def __init__(self, path: str, args: list, action: Callable):
        self.path = path
        self.args = args
        self.action = action

    def run(self, *args) -> Tuple[str, dict]:
        return self.path, self.action(args)


class RouteServer(TCPServer):
    def __init__(self, address: Tuple[str, int]):
        super().__init__(address)
        self.routes: List[Route] = []

    def add_route(self, path: str, action: Callable):
        args = list(inspect.signature(action).parameters.keys())
        route = Route(path, args, action)
        self.routes.append(route)

    def route(self, path: str):
        def decorator(func):
            self.add_route(path, func)
            return func

        return decorator

    def find_route(self, path: str):
        for route in self.routes:
            if route.path == path:
                return route
        return None

    def handle_request(self, request: Request) -> Response:
        route = self.find_route(request.path)
        if not route:
            return Response(request.path, {'error': 'no such route'})
        return Response(*route.run(request.payload))
