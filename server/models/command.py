class Command:
    def __init__(self, params: list, code='') -> None:
        self.code = code
        self.params = params

    def execute(self):
        if self.code:
            exec(self.code)

    def set_params(self, params):
        self.params = params
