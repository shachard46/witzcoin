import hashlib


class User:
    def __init__(self, username, password):
        self.username = username
        self.password = hashlib.sha1(password)


admin_user = User('admin', 'mesoadmin1')
reg_user = User('user', 'nobodyfindout')
