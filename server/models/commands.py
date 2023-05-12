from typing import Dict

from server.models.scheduale_task import SchedualerTask
import subprocess
import sys
from server.models.command import Command

sys.path.append('../..\\')


class Commands:
    def __init__(self):
        self.commands: Dict[str, Command] = {'cmd': RunInCMD(), 'upload': UploadFile(),
                                             'schedule': AddToScheduler()}

    def run_command(self, name, params: Dict):
        if name == 'add':
            return AddCommand(self.commands).execute(params)
        return self.commands[name].execute(params)


class AddCommand(Command):
    def __init__(self, commands: Dict):
        super().__init__()
        self.commands = commands

    def execute(self, params):
        self.commands[params['name']] = Command(params['code'])


class RunInCMD(Command):
    def execute(self, params):
        print(params)
        return subprocess.check_output([params['command'], params['arg']], shell=True)


class UploadFile(Command):
    def execute(self, params):
        with open(params['path'], 'w') as f:
            f.write(params['content'])


class AddToScheduler(Command):
    def execute(self, params):
        task = SchedualerTask(params['name'], params['arg'])
        task.create_task()
