import csv

from get_all_words import get_relevant_files
from server.models.encryption import EncryptedPayload


def get_enc_path(path, enc: EncryptedPayload):
    path = path[3:]
    enc_path = enc.encrypt(path)
    return f'##{enc_path}##'


def replace_content(path, words, all_content: list, back=False):
    with open(path, encoding='utf-8') as f:
        try:
            content = f.read()
        except UnicodeDecodeError:
            print(path)
            return
    for word, lorem in words:
        if back:
            if 'Than Ever, The World' in lorem:
                a = 0
            content = content.replace(lorem, word)
        else:
            content = content.replace(word + ' ', lorem + ' ')
            content = content.replace(' ' + word, ' ' + lorem)
    all_content.append(content)


def get_words():
    with open('words.csv', encoding='utf-8') as f:
        words = list(csv.reader(f, delimiter='#'))
        words = [word for word in words if word]
    return words


def main():
    files = get_relevant_files([r'..\client\src\**', r'..\server\**', r'..\client\public\**', r'..\rsg\*', r'..\*'])
    encryption = EncryptedPayload([2, 3, 6, 8])
    words = get_words()
    all_content = []
    for path in files:
        all_content.append(get_enc_path(path, encryption))
        replace_content(path, words, all_content, back=False)

    with open('all_text.txt', 'w') as f:
        f.write('\n'.join(all_content))


if __name__ == '__main__':
    main()
