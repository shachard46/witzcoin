class Command:
    def __init__(self, params: dict = {}, code='') -> None:
        self.code = code
        self.params = params

    def execute(self):
        print('executing', self.code)
        if self.code:
            exec(self.code)

    def set_params(self, params):
        self.params = params


{'name': 'print', 'code': 'print(params["print"])\nreturn 7'}