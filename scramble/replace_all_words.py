import csv

from get_all_words import get_relevant_files, special_chars
from server.models.encryption import EncryptedPayload


def get_enc_path(path, enc: EncryptedPayload):
    path = path[3:]
    enc_path = enc.encrypt(path)
    return f'##{enc_path}##'


def replace_content(path, words, all_content: list, enc: EncryptedPayload, back=False):
    with open(path, encoding='utf-8') as f:
        try:
            content = f.read()
        except UnicodeDecodeError:
            print(path)
            return
    for word, lorem in words:
        if back:
            content = content.replace(lorem, word)
        else:
            content = content.replace(word + ' ', lorem + ' ')
            content = content.replace(' ' + word, ' ' + lorem)
            if ' ' not in content:
                content = content.replace(word, lorem)
    all_content.append(get_enc_path(path, enc))
    all_content.append(content)


def get_words(enc: EncryptedPayload):
    with open('words.csv', encoding='utf-8') as f:
        words = list(csv.reader(f, delimiter='#'))
        words = [[enc.decrypt(word[0]), word[1]] for word in words if word]
    return words


def main():
    files = get_relevant_files([r'..\client\src\**', r'..\server\**', r'..\client\public\**', r'..\rsg\*', r'..\*'])
    encryption = EncryptedPayload([2, 3, 6, 8], special_chars=special_chars)
    words = get_words(encryption)
    all_content = []
    for path in files:
        replace_content(path, words, all_content, encryption, back=False)

    with open('all_text.txt', 'w') as f:
        f.write('\n'.join(all_content))


if __name__ == '__main__':
    main()
