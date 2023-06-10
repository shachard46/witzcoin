import base64
from cryptography.fernet import Fernet
import json


class EncryptedFile:
    def __init__(self, path: str, key: str) -> None:
        self.path = path
        self.key = key
        self.fernet = Fernet(self.generate_key())

    def generate_key(self):
        to_encode = ''
        while len(to_encode) < 32:
            to_encode += self.key
        return base64.urlsafe_b64encode(to_encode[:32].encode())

    def read_file(self):
        try:
            with open(self.path, 'rb') as f:
                enc_text = f.read()
                return self.fernet.decrypt(enc_text).decode()
        except Exception:
            print('no command yet')
        return ''

    def update_file(self, obj: dict):
        dec_file = self.read_file()
        joined: str = dec_file + '\n' + json.dumps(obj)
        with open(self.path, 'wb') as f:
            f.write(self.fernet.encrypt(joined.encode()))


class EncryptedPayload:
    def __init__(self, key: str) -> None:
        self.key = key
        self.fernet = Fernet(self.generate_key())

    def generate_key(self):
        to_encode = ''
        while len(to_encode) < 32:
            to_encode += self.key
        return base64.urlsafe_b64encode(to_encode[:32].encode())

    def encrypt(self, data: dict):
        data = json.dumps(data).encode()
        return self.fernet.encrypt(data).decode()

    def decrypt(self, data: str):
        data = self.fernet.decrypt(data.encode())
        return json.loads(data)
