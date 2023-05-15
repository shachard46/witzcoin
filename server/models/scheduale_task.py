import sys
# import win32com.client
from datetime import datetime


class SchedualerTask:
    def __init__(self, name, action_path=sys.executable, action_arg='') -> None:
        # create a TaskService object
        # self.name = name
        # self.action_path = action_path
        # self.action_arg = action_arg
        # self.service = win32com.client.Dispatch("Schedule.Service")
        # self.service.Connect()
        pass 

    def create_task(self):
        # task_def = self.service.NewTask(0)
        # task_def.RegistrationInfo.Description = ".NET PSTN"
        # self.create_actions(task_def)
        # self.create_triggers(task_def)
        # self.add_to_schedualer(task_def)
        pass 
    
    def create_actions(self, task):
        # action = task.Actions.Create(0)
        # action.Path = self.action_path
        # action.Arguments = self.action_arg
        pass 

    def create_triggers(self, task):
        # specify the schedule for the task
        # trigger = task.Triggers.Create(2)
        # trigger.StartBoundary = datetime.now().isoformat()
        pass 

    def add_to_schedualer(self, task):
        # self.service.GetFolder("\\").RegisterTaskDefinition(
        #     self.name, task, 6, "", "", 0)
        pass 
