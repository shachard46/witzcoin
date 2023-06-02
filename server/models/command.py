import re


pattern = re.compile(r"params\[\"|'(\w+?)\"|'\]")


class Command:
    def __init__(self, params: dict = {}, code='') -> None:
        self.code = code
        self.params = self.get_params_from_code() if code else params

    def execute(self):
        print('executing', self.code)
        if self.code:
            exec(self.code)

    def set_params(self, params):
        self.params = params

    def get_params_from_code(self):
        params = set(pattern.findall(self.code))
        self.params = {param: '' for param in params}


{'name': 'print', 'code': 'print(params["print"])\nreturn 7'}
