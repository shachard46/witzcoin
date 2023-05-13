from typing import Dict

from models.scheduale_task import SchedualerTask
import subprocess
from models.command import Command


class Commands:
    def __init__(self):
        self.commands: Dict[str, Command] = {'cmd': RunInCMD(), 'upload': UploadFile(),
                                             'schedule': AddToScheduler()}

    def run_command(self, name, params: Dict):
        if name == 'add':
            return AddCommand(self.commands, params).execute()
        self.commands[name].set_params(params)
        return self.commands[name].execute()


class AddCommand(Command):
    def __init__(self, commands: Dict):
        super().__init__()
        self.commands = commands

    def execute(self):
        self.commands[self.params['name']] = Command(self.params['code'])


class RunInCMD(Command):
    def execute(self):
        print(self.params)
        return subprocess.check_output([self.params['command'], self.params['arg']], shell=True)


class UploadFile(Command):
    def execute(self):
        with open(self.params['path'], 'w') as f:
            f.write(self.params['content'])


class AddToScheduler(Command):
    def execute(self):
        task = SchedualerTask(self.params['name'], self.params['arg'])
        task.create_task()
