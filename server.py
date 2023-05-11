from fastapi import FastAPI

from models.commands import Commands

app = FastAPI()

commands = Commands()


@app.get('/commands')
async def get_commands():
    return commands.commands


@app.get('/commands/{name}')
async def run_command(name, params):
    return commands.run_command(name, eval(params))
