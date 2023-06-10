import base64
from cryptography.fernet import Fernet
import json
import codecs


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
    def __init__(self, key: list) -> None:
        self.key = key
        self.reverse_key = [-i for i in key]

    def shift_character(self, shift: int, char: str):
        if not char[0].isalpha():
            return char
        shift_range = (65, 90) if char.isupper() else (97, 122)
        char = ord(char[0]) + shift
        if char > shift_range[1]:
            char = shift_range[0] + (char - shift_range[1])
        elif char < shift_range[0]:
            char = shift_range[1] - (shift_range[0] - char)
        return chr(char)

    def shift_word(self, word, dec=False):
        new_word = []
        shift_index = 0
        key = self.reverse_key if dec else self.key
        for char in word:
            shift_index += 1
            if shift_index == len(key):
                shift_index = 0
            new_word.append(self.shift_character(key[shift_index], char))
        return ''.join(new_word)

    def enc_dec_data(self, data: dict | list | str, dec=False):
        if type(data) is list:
            enc_data = []
            for item in data:
                enc_data.append(self.enc_dec_data(item, dec))
        elif type(data) is dict:
            enc_data = {}
            for key, value in data.items():
                if type(value) is dict:
                    enc_data[self.shift_word(
                        key, dec)] = self.enc_dec_data(value, dec)
                else:
                    enc_data[self.shift_word(
                        key, dec)] = self.shift_word(value, dec)
        else:
            enc_data = self.shift_word(data, dec)
        return enc_data

    def decrypt(self, data: dict | list | str):
        return self.enc_dec_data(data, True)

    def encrypt(self, data: dict | list | str):
        return self.enc_dec_data(data, False)
