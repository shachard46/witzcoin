import csv

from get_all_words import get_relevant_files


def replace_content(path, words, back=False):
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
    with open(path, 'w') as f:
        f.write(content)


def get_words():
    with open('words.csv', encoding='utf-8') as f:
        words = list(csv.reader(f, delimiter='#'))
        words = [word for word in words if word]
    return words


def main():
    files = get_relevant_files([r'..\client\src\**', r'..\server\**', r'..\client\public\**', r'..\rsg\*', r'..\*'])
    words = get_words()
    for path in files:
        replace_content(path, words, back=True)


if __name__ == '__main__':
    main()
