from server.models.commands import Commands
from server.models.route_server import RouteServer

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
