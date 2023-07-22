import csv
import glob
import os.path
import re

from server import utils


def get_relevant_files(folders):
    all_files = []
    for folder in folders:
        all_files.extend([f for f in glob.glob(folder, recursive=True) if os.path.isfile(f)])
    print(all_files)
    return all_files


def get_all_words(files):
    words = []
    for path in files:
        with open(path, encoding='utf-8') as f:
            try:
                content = f.read()
                words.extend(content.split(' '))
            except UnicodeDecodeError:
                print(path)
    words = list(set(words))
    words = [word for word in words if not (word.isalpha() and len(word) <= 2) and word]
    words.sort(key=lambda w: len(w), reverse=True)
    return words


def get_lorem_ipsum_words(length, words):
    pattern = re.compile(r'(\w.*? .*? .*? .*?\w) ')
    # res = requests.get('https://baconipsum.com/api/?type=meat-and-filler&paras=100000')
    with open('lorem.txt') as f:
        ipsum_words = list(set(pattern.findall(f.read())))
        ipsum_words = [word for word in ipsum_words if not utils.is_in_list(' ' + word + ' ', words) and word.isascii()]
        return ipsum_words[:length]


def main():
    files = get_relevant_files(
        [r'..\client\src\**', r'..\server\**', r'..\client\public\**', r'..\rsg\*', r'..\*'])
    words = get_all_words(files)
    lorem_words = get_lorem_ipsum_words(len(words), words)
    joined = [{'word': ws, 'lorem': lws} for ws, lws in zip(words, lorem_words)]
    with open('words.csv', 'w', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['word', 'lorem'], delimiter='#')
        writer.writerows(joined)


if __name__ == '__main__':
    main()
