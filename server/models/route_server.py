import inspect
import re
from typing import Tuple, Callable, List, Any

from server.models.packet import Response, Request
from server.models.tcp_server import TCPServer

param_pattern = re.compile(r"\{.*?}")


class Route:
    def __init__(self, path: str, args: list, action: Callable):
        self.path = path
        self.args = args
        self.action = action
        self.is_wildcard = '{' in path

    def handle_params_in_path(self) -> Tuple[re.Pattern, list]:
        if not self.is_wildcard:
            return re.compile(self.path), []
        params = param_pattern.findall(self.path)
        formatted_route = re.compile(param_pattern.sub(r'(.*?)', self.path) + '$')
        return formatted_route, params

    def run(self, *args) -> Tuple[str, dict]:
        if args:
            return self.path, self.action(*args)
        else:
            return self.path, self.action()


class RouteServer(TCPServer):
    def __init__(self, host: str, port: int):
        super().__init__(host, port)
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

    def find_route(self, path: str) -> tuple[Any, Any] | tuple[None, None]:
        for route in self.routes:
            formatted_route, params = route.handle_params_in_path()
            params_value = formatted_route.findall(path)
            if params_value:
                return route, params_value
        return None, None

    def handle_request(self, request: Request) -> Response:
        route, params = self.find_route(request.path)
        if not route:
            return Response(request.path, {'error': 'no such route'})
        if request.payload:
            return Response(*route.run(*params, request.payload))
        return Response(*route.run(*params))
