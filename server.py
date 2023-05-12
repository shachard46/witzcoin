from fastapi import FastAPI, HTTPException, Depends, dependencies, Path, Request
from typing import Annotated
import uvicorn
from models.commands import Commands
from models.permissions import Permissions
import string

app = FastAPI()

commands = Commands()
permissions = Permissions(['127.0.0.1'], [], '1227.0.0.1')


async def ip_permissions(request: Request):
    headers = request.headers
    path = request.url.path
    ip_address = headers.get("X-Forwarded-For") or headers.get("X-Real-IP") or request.client.host
    if not permissions.is_allowed(ip_address):
        raise HTTPException(status_code=404)
    if '/admin' in path and not permissions.is_admin(ip_address):
        raise HTTPException(status_code=404)


@app.get('/admin', dependencies=[Depends(ip_permissions)])
async def admin_page(allow_ip='', block_ip=''):
    if allow_ip:
        permissions.allow_ip(allow_ip)
    if block_ip:
        permissions.block_ip(block_ip)
    return allow_ip or block_ip


@app.get('/commands', dependencies=[Depends(ip_permissions)])
async def get_commands():
    return commands.commands


@app.get('/commands/{name}')
async def run_command(name: Annotated[str, Path(title="the name of the command to run")], params):
    return commands.run_command(name, eval(params))

#
# if __name__ == '__main__':
#     uvicorn.run(host='127.0.0.1', port=5461, reload=True, app='server:app')
