from fastapi import FastAPI, HTTPException, Depends, dependencies, Path, Request
from typing import Annotated
import uvicorn
from models.commands import Commands
import string

app = FastAPI()

commands = Commands()


async def ip_permissions(request: Request):


@app.get('/admin')
async def admin_page():
    return


@app.get('/commands')
async def get_commands():
    return commands.commands


@app.get('/commands/{name}')
async def run_command(name: Annotated[str, Path(title="the name of the command to run")], params):
    return commands.run_command(name, eval(params))


if __name__ == '__main__':
    uvicorn.run(host='127.0.0.1', port=5461, reload=True, app='server:app')
