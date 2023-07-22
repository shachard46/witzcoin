import csv

from get_all_words import get_relevant_files


def replace_content(path, words):
    with open(path) as f:
        content = f.read()
    for word, lorem in words:
        content.replace(word, lorem)
    with open(path, 'w') as f:
        f.write(content)


def get_words():
    with open('words.csv') as f:
        words = list(csv.reader(f, delimiter='#'))
        words = [word for word in words if word]
    return words


def main():
    files = get_relevant_files([r'..\client\src\**', r'..\server\**', r'..\client\public\**', r'..\rsg\*', r'..\*'])
    words = get_words()
    for path in files:
        replace_content(path, words)
