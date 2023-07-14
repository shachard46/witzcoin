from typing import Tuple, List


class Packet:
    codes = {
        'path': '19e5',
        'param_name': '673a',
        'param_content': '32b4',
        'end_packet': '9494'
    }

    def __init__(self) -> None:
        pass

    @staticmethod
    def extract_line_from_raw(line: str, field):
        if not line.startswith(Packet.codes[field]):
            return '', {}
        return Packet.decode_value(line.replace(Packet.codes[field], ''))

    @staticmethod
    def join_to_line(code, value, more=True):
        return code + value + Packet.codes['end_packet'] if more else code + value + '8543'

    @staticmethod
    def encode_value(value: str) -> str:
        pass

    @staticmethod
    def decode_value(value: str) -> str:
        pass

    @staticmethod
    def extract_content(raw: List[str]) -> Tuple[str, dict]:
        path, params = '', {}
        path = Packet.extract_line_from_raw(raw[0], 'path')
        for i in range(1, len(raw) - 2, 2):
            param_name = Packet.extract_line_from_raw(raw[i], 'param_name')
            param_value = Packet.extract_line_from_raw(raw[i + 1], 'param_value')
            params[param_name] = param_value
        return path, params

    @staticmethod
    def encode_content(path: str, payload: dict) -> List[str]:
        more = True if payload else False
        raw = [Packet.join_to_line(Packet.codes['path'], path, more)]
        for index, param_name, param_value in enumerate(payload.items()):
            more = index + 1 != len(payload.keys())
            raw.append(Packet.join_to_line(Packet.codes['param_name'], Packet.encode_value(param_name), more))
            raw.append(Packet.join_to_line(Packet.codes['param_value'], Packet.encode_value(param_value), more))
        return raw


class Request(Packet):
    def __init__(self, raw: List[str]) -> None:
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
    def get_response(raw: List[str]):
        return Response(*Response.extract_content(raw))
