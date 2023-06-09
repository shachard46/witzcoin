from cryptography.fernet import Fernet
import json


class EncryptedFile:
    def __init__(self, path: str, key: str) -> None:
        self.path = path
        self.key = key
        self.fernet = Fernet(key)

    def read_file(self):
        with open(self.path) as f:
            enc_text = f.read()
            return self.fernet.decrypt(enc_text)

    def update_file(self, obj: dict):
        dec_file = self.read_file()
        joined = dec_file + '\n' + json.dumps(obj)
        with open(self.path, 'w') as f:
            f.write(self.fernet.encrypt(joined))
