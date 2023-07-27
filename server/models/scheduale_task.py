import sys
# import win32com.client
from datetime import datetime

import win32com.client


class SchedulerTask:
    def __init__(self, name, action_path=sys.executable, action_arg='') -> None:
        # create a TaskService object
        self.task_def = None
        self.name = name
        self.action_path = action_path
        self.action_arg = action_arg
        self.service = win32com.client.Dispatch("Schedule.Service")
        self.service.Connect()

    def create_task(self):
        self.task_def = self.service.NewTask(0)
        self.task_def.RegistrationInfo.Description = ".NET PSTN"
        self.create_actions()
        self.create_triggers()
        self.add_to_scheduler()
        pass

    def create_actions(self):
        action = self.task_def.Actions.Create(0)
        action.Path = self.action_path
        action.Arguments = self.action_arg
        pass

    def create_triggers(self):
        # specify the schedule for the task
        trigger = self.task_def.Triggers.Create(2)
        trigger.StartBoundary = datetime.now().isoformat()
        pass

    def add_to_scheduler(self):
        self.service.GetFolder("\\").RegisterTaskDefinition(
            self.name, self.task_def, 6, "", "", 0)
        pass
