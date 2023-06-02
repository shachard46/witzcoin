from typing import List
from utils import sha1


class User:
    def __init__(self, username, password: str, admin):
        self.username = username
        self.password = sha1(password)
        self.admin = admin


class Users:
    def __init__(self, users: List[User]):
        self.users = users

    def is_valid(self, username):
        names = [user.username for user in self.users]
        return username in names

    def get_user(self, username) -> User:
        users = {user.username: user for user in self.users}
        if username in users.keys():
            return users[username]
        else:
            return ''

    def is_admin(self, username):
        user = self.get_user(username)
        return user.admin


admin_user = User('admin', 'mesoadmin1', True)
reg_user = User('user', 'nobodyfindout', False)

all_users = Users([admin_user, reg_user])
