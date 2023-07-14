from typing import Tuple


class Request:
    def __init__(self, raw: str) -> None:
        self.path, self.payload = self.extract_content(raw)

    def extract_content(self, raw) -> Tuple[str, dict]:
        pass


class Response:
    def __init__(self, path: str, payload: dict):
        self.raw = self.encode_content(path, payload)

    def encode_content(self, path: str, payload: dict) -> str:
        pass
