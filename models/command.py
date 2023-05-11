import fastapi


class Command:
    def __init__(self, name, code: str | callable) -> None:
        self.name = name
        self.code = code

    def execute(self, app: fastapi.FastAPI):
        route = f'/commands/{self.name}'

        @app.get(route)
        async def commands(**args):
            if type(self.code) is str:
                exec(self.code)
            else:
                self.code()
