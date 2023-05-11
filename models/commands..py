from scheduale_task import SchedualerTask
import subprocess
import sys
sys.path.append('..\\')


class Command:
    def __init__(self, name, args) -> None:
        self.name = name
        self.arg1, self.arg2 = args

    def execute(self):
        pass


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
