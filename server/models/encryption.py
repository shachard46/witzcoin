import base64
from typing import Union
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

    def read_file(self) -> list:
        try:
            with open(self.path, 'rb') as f:
                enc_text = f.read()
                return eval(self.fernet.decrypt(enc_text).decode())
        except Exception:
            print('no command yet')
        return []
    def check_for_dups(self, objs, obj):
        without = [o for o in objs if o['name'] !=obj['name']]
        without.append(obj)
        return without
            
    def update_file(self, obj):
        objs = self.read_file()
        with open(self.path, 'wb') as f:
            if obj:
                objs = self.check_for_dups(objs, obj)
            f.write(self.fernet.encrypt(str(objs).encode()))
    
    def remove_from_file(self, key, value):
        objs = self.read_file()
        print(objs)
        for obj in objs:
            if key in obj.keys() and obj[key] == value:
                objs.remove(obj)
                print('here', objs, obj)
                self.update_file(objs)
                return True
        return False


class EncryptedPayload:
    def __init__(self, key: list) -> None:
        self.key = key
        self.reverse_key = [-i for i in key]

    def shift_character(self, shift: int, char: str):
        if not char[0].isalpha():
            return char
        shift_range = (65, 90) if char.isupper() else (97, 122)
        char_ascii = ord(char[0]) + shift
        if char_ascii > shift_range[1]:
            char_ascii = shift_range[0] + (char_ascii - shift_range[1] - 1)
        elif char_ascii < shift_range[0]:
            char_ascii = shift_range[1] - (shift_range[0] - char_ascii - 1)
        return chr(char_ascii)

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

    def enc_dec_data(self, data: Union[dict , list , str], dec=False):
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
        elif type(data) is str:
            enc_data = self.shift_word(data, dec)
        else:
            return data
        return enc_data

    def decrypt(self, data: Union[dict , list , str]):
        return self.enc_dec_data(data, True)

    def encrypt(self, data: Union[dict , list , str]):
        return self.enc_dec_data(data, False)
