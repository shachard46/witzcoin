import re


pattern = re.compile(r"params\[[\"'](\w+?)[\"']]")


class Command:
    def __init__(self, params=None, code='') -> None:
        if params is None:
            params = {}
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
        return {param: '' for param in params}
