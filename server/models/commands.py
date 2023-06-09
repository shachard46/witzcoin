import json
from typing import Dict
from models.encrypted_file import EncryptedFile
from models.scheduale_task import SchedualerTask
import os
from models.command import Command


class Commands:
    def __init__(self):
        self.commands: Dict[str, Command] = {'cmd': RunInCMD(), 'upload': UploadFile(),
                                             'schedule': AddToScheduler()}
        self.add_command = AddCommand(
            self.commands, {'name': '', 'from_file': 'False', 'code': ''}, 'file.txt')
        try:
            self.add_command.add_from_file()
        except Exception:
            print('no commands yet')

    def run_command(self, name, params: Dict):
        if name == 'add':
            self.add_command.set_params(params)
            return self.add_command.execute()
        self.commands[name].set_params(params)
        return self.commands[name].execute()

    def get_command(self, name):
        try:
            params = {'params': self.commands[name].params, 'name': name}
        except KeyError:
            params = {}
        return params

    def get_all_commands(self):
        commands = [self.get_command(name) for name in self.commands]
        commands.append({'name': 'add', 'params': self.add_command.params})
        return commands


class AddCommand(Command):
    def __init__(self, commands: Dict, params, save_file):
        super().__init__()
        self.commands = commands
        self.params = params
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
        self.commands[params['name']] = Command({}, code)

    def execute(self):
        self.add_command(self.params)
        self.enc_file.update_file(self.params)


class RunInCMD(Command):
    def __init__(self) -> None:
        self.params = {'command': ''}

    def execute(self):
        print(self.params['command'].split(' '), 'dsdfsd')
        process = os.popen(self.params['command'])
        return process.read()


class UploadFile(Command):
    def __init__(self) -> None:
        self.params = {'path': '', 'content': ''}

    def execute(self):
        with open(self.params['path'], 'w') as f:
            f.write(self.params['content'])


class AddToScheduler(Command):
    def __init__(self) -> None:
        self.params = {'name': '', 'arg': ''}

    def execute(self):
        task = SchedualerTask(self.params['name'], self.params['arg'])
        task.create_task()
