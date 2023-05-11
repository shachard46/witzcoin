import fastapi


class Command:
    def __init__(self, code='') -> None:
        self.code = code

    def execute(self, params):
        if self.code:
            exec(self.code)
