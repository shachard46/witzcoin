class Request:
    def __init__(self, raw: str) -> None:
        self.payload = self.extract_content(raw)

    def extract_content(self, raw) -> dict:
        pass


class Response:
    def __init__(self, payload: dict):
        self.raw = self.encode_content(payload)

    def encode_content(self, payload: dict) -> str:
        pass
