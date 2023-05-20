from fastapi import FastAPI, HTTPException, Depends, Path, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
import uvicorn
from models.commands import Commands
from models.permissions import Permissions
from models.User import all_users, User
from utils import sha1

app = FastAPI()

commands = Commands()
permissions = Permissions(['127.0.0.1'], [], '1227.0.0.1')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


async def ip_permissions(request: Request):
    headers = request.headers
    path = request.url.path
    ip_address = headers.get(
        "X-Forwarded-For") or headers.get("X-Real-IP") or request.client.host
    if not permissions.is_allowed(ip_address):
        raise HTTPException(status_code=404)
    if '/admin' in path and not permissions.is_admin(ip_address):
        raise HTTPException(status_code=404)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = all_users.get_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def is_admin(user: Annotated[User, Depends(get_current_user)]):
    if not user.admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@app.post('/login', dependencies=[Depends(ip_permissions)])
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    if not all_users.is_valid(form_data.username):
        raise HTTPException(
            status_code=400, detail="Incorrect username or password")
    user = all_users.get_user(form_data.username)
    if sha1(form_data.password) != user.password:
        raise HTTPException(
            status_code=400, detail="Incorrect username or password")
    res = {"access_token": user.username, "token_type": "bearer"}
    if user.admin:
        res["admin"] = True
    return res


@app.get('/admin')
async def get_admin(user: Annotated[User, Depends(is_admin)]):
    return user.admin


@app.get('/perms', dependencies=[Depends(ip_permissions), Depends(is_admin)])
async def change_ip_permissions(allow_ip='', block_ip=''):
    if allow_ip:
        permissions.allow_ip(allow_ip)
    if block_ip:
        permissions.block_ip(block_ip)
    return allow_ip or block_ip


@app.get('/commands', dependencies=[Depends(ip_permissions), Depends(get_current_user)])
async def get_commands():
    return commands.get_all_commands()


@app.get('/commands/{name}', dependencies=[Depends(ip_permissions), Depends(get_current_user)])
async def get_command(name: Annotated[str, Path(title="the name of the command to run")]):
    return commands.get_command(name)


@app.get('/commands/{name}/run', dependencies=[Depends(ip_permissions), Depends(get_current_user)])
async def run_command(name: Annotated[str, Path(title="the name of the command to run")], params):
    return commands.run_command(name, eval(params))


if __name__ == '__main__':
    uvicorn.run(host='127.0.0.1', port=5461, reload=True, app='server:app')
