from server.models.commands import Commands
from server.models.route_server import RouteServer

app = RouteServer(host='127.0.0.1', port=5461)
commands = Commands()


@app.route('run/{alias}')
def run_command(alias: str, params: dict):
    return commands.run_command(alias, params)


@app.route('get')
def get_all_commands():
    return commands.get_all_commands()


@app.route('get/{alias}')
def get_command(alias: str):
    return commands.get_command(alias)


@app.route('delete/{alias}')
def delete_command(alias: str):
    try:
        return commands.remove_by_alias(alias)
    except:
        return 'no such flower'
