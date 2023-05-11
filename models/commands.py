from unicodedata import name

from scheduale_task import SchedualerTask
import subprocess
import sys
from command import Command

sys.path.append('..\\')


class commands



class RunInCMD(Command):
    def execute(self):
        subprocess.run([self.arg1, self.arg2], shell=True)


class UploadFile(Command):
    def execute(self):
        with open(self.arg2, 'w') as f:
            f.write(self.arg1)


class AddToScheduler(Command):
    def execute(self):
        task = SchedualerTask(self.arg1, self.arg2)
        task.create_task()
