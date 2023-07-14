from typing import Tuple


class Packet:
    def __init__(self) -> None:
        pass

    @staticmethod
    def extract_content(raw) -> Tuple[str, dict]:
        pass

    @staticmethod
    def encode_content(path: str, payload: dict) -> str:
        pass


class Request(Packet):
    def __init__(self, raw: str) -> None:
        super().__init__()
        self.path, self.payload = Request.extract_content(raw)

    @staticmethod
    def send_request(path: str, payload: dict):
        return Request(*Request.encode_content(path, payload))


class Response(Packet):
    def __init__(self, path: str, payload: dict):
        super().__init__()
        self.raw = Response.encode_content(path, payload)

    @staticmethod
    def get_response(raw: str):
        return Response(*Response.extract_content(raw))
