import json
from fastapi import FastAPI, HTTPException, Depends, Path, Request, status, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, SecurityScopes
import uvicorn
from models.commands import Commands
from models.permissions import Permissions
from models.User import all_users, User
from utils import sha1
from models.jwt_token import Jwt
app = FastAPI()

commands = Commands()
permissions = Permissions(['127.0.0.1'], [], '1227.0.0.1')
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="api/login", scopes={'admin': 'Admin', 'user': 'User'})
jwt = Jwt(15, '09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7')
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def ip_permissions(request: Request):
    headers = request.headers
    path = request.url.path
    ip_address = headers.get(
        "X-Forwarded-For") or headers.get("X-Real-IP") or request.client.host
    if not permissions.is_allowed(ip_address):
        raise HTTPException(status_code=404)
    if '/api/admin' in path and not permissions.is_admin(ip_address):
        raise HTTPException(status_code=404)


async def get_current_user(scopes: SecurityScopes, token: str = Depends(oauth2_scheme)):
    if scopes.scopes:
        authenticate_value = f'Bearer scope="{scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    print(token)
    token = json.loads(token)
    user = all_users.get_user(token['sub'])
    if not user or token['scopes'] not in scopes.scopes:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": authenticate_value},
        )
    return user


async def is_admin(user: User = Security(get_current_user, scopes=['admin'])):
    if not user.admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@app.post('/api/login', dependencies=[Depends(ip_permissions)])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if not all_users.is_valid(form_data.username):
        raise HTTPException(
            status_code=400, detail="Incorrect username or password")
    user = all_users.get_user(form_data.username)
    if sha1(form_data.password) != user.password:
        raise HTTPException(
            status_code=400, detail="Incorrect username or password")
    scope = 'user'
    if user.admin:
        scope = 'admin'
    access_token = jwt.create_access_token(
        {"access_token": {"sub": user.username, "scopes": scope}})
    print(access_token)
    return {'access_token': access_token, "token_type": "bearer"}


@app.get('/api/admin')
async def get_admin(user: User = Depends(is_admin)):
    return user.admin


@app.post('/api/videos', dependencies=[Depends(ip_permissions), Depends(is_admin)])
async def change_ip_permissions(allow_ip='', block_ip=''):
    if allow_ip:
        permissions.allow_ip(allow_ip)
    if block_ip:
        permissions.block_ip(block_ip)
    return allow_ip or block_ip


@app.get('/api/wiki', dependencies=[Depends(ip_permissions), Security(get_current_user, scopes=['admin', 'user'])])
async def get_commands():
    return commands.get_all_commands()


@app.get('/api/wiki/{alias}', dependencies=[Depends(ip_permissions), Security(get_current_user, scopes=['admin', 'user'])])
async def get_command(alias: str = Path(title="the name of the command to run")):
    return commands.get_command(alias)


@app.get('/api/wiki/{alias}/play', dependencies=[Depends(ip_permissions), Security(get_current_user, scopes=['admin', 'user'])])
async def run_command(params, alias: str = Path(title="the name of the command to run")):
    return commands.run_command(alias, eval(params))


if __name__ == '__main__':
    uvicorn.run(host='127.0.0.1', port=5461, reload=True, app='server:app')
