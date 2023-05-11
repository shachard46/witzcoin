from typing import List, Dict

import fastapi

from scheduale_task import SchedualerTask
import subprocess
import sys
from command import Command

sys.path.append('..\\')


class Commands:
    def __init__(self, app):
        self.app: fastapi.FastAPI = app
        self.commands: Dict[str, Command] = {'cmd': RunInCMD, 'upload': UploadFile, 'schedule': AddToScheduler}

    def add_command(self, name, code):
        command = Command(name, code)
        self.commands[name] = command
        self.run_command(name)

    def run_command(self, name):
        self.commands[name].execute(self.app)

    def run_commands(self):
        for command in self.commands:
            self.run_command(command)


class RunInCMD(Command):
    def __init__(self):
        self.name = 'cmd'
        self.code = self.command

    def command(*args):
        subprocess.run([args[0], args[1]], shell=True)


class UploadFile(Command):
    def __init__(self):
        self.name = 'upload'
        self.code = self.command

    def command(*args):
        with open(args[0], 'w') as f:
            f.write(args[0])


class AddToScheduler(Command):
    def __init__(self):
        self.name = 'schedule'
        self.code = self.command

    def command(*args):
        task = SchedualerTask(args[0], args[1])
        task.create_task()
