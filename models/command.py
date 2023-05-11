class Command:
    def __init__(self, name, args) -> None:
        self.name = name
        self.arg1, self.arg2 = args

    def execute(self):
        pass
