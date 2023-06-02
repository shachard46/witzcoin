from typing import Dict

from models.scheduale_task import SchedualerTask
import os
from models.command import Command


class Commands:
    def __init__(self):
        self.commands: Dict[str, Command] = {'cmd': RunInCMD(), 'upload': UploadFile(),
                                             'schedule': AddToScheduler()}
        self.add_command = AddCommand(self.commands, {'name': '', 'code': ''})

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
    def __init__(self, commands: Dict, params):
        super().__init__()
        self.commands = commands
        self.params = params

    def execute(self):
        self.commands[self.params['name']] = Command({}, self.params['code'])


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
