import os
import re

pattern = re.compile(r"params\[[\"'](\w+?)[\"']]")


class Command:
    def __init__(self, name, alias, params=None, code='') -> None:
        if params is None:
            params = {}
        self.name = name
        self.code = code
        self.alias = alias
        self.params = self.get_params_from_code() if code else params

    def execute(self):
        print('executing', self.code)
        if self.code:
            try:
                exec(self.code)
            except Exception:
                print('bad command')
            try:
                with open(self.params['path']) as f:
                    to_return = f.read()
                os.remove(self.params['path'])
                return to_return
            except Exception:
                print('no file')
        return ''

    def set_params(self, params):
        self.params = params

    def get_params_from_code(self):
        params = set(pattern.findall(self.code))
        return {param: '' for param in params}

    def to_json(self):
        return {'params': self.params,
                'name': self.name, 'alias': self.alias}
