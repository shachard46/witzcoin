from server.models.commands import Commands
from server.models.route_server import RouteServer
from server.models.tcp_client import TCPClient

app = RouteServer(host='127.0.0.1', port=5461)
commands = Commands()


@app.route('run/{command}')
def run_command(command: str, params: dict):
    pass


@app.route('get')
def get_all_commands():
    pass


@app.route('get/{command}')
def get_command(command: str):
    pass


@app.route('delete/{command}')
def delete_command(command: str):
    pass
