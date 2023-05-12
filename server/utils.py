import hashlib


def sha1(string):
    hash_func = hashlib.sha1()
    hash_func.update(string.encode())
    return hash_func.hexdigest()