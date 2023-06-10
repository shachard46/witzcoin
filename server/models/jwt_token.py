import datetime
import jwt


class Jwt:
    def __init__(self, expires: int, key) -> None:
        self.key = key
        self.expires = datetime.timedelta(minutes=expires)

    def create_access_token(self, data: dict):
        to_encode: dict = data.copy()
        expire = datetime.datetime.utcnow() + self.expires
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, key=self.key, algorithm='HS256')

    def get_token(self, token):
        return jwt.decode(token, key=self.key, algorithms=['HS256'])
