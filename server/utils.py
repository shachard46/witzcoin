import hashlib


def sha1(string):
    hash_func = hashlib.sha1()
    hash_func.update(string.encode())
    return hash_func.hexdigest()


def filter_unreadable_chars(text: str):
    filtered_text = ''.join(c for c in text if c.isprintable())
    return filtered_text
