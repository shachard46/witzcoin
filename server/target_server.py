from server.models.commands import Commands
from server.models.route_server import RouteServer

app = RouteServer(host='127.0.0.1', port=5461)
commands = Commands()