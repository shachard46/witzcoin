from typing import Tuple, List


class Packet:
    PACKET_SIZE = 60
    codes = {
        'path': '19e5',
        'param_part': '673a',
        'end_packet': '9494'
    }

    def __init__(self) -> None:
        pass

    @staticmethod
    def extract_line_from_raw(line: str, field):
        if not line.startswith(Packet.codes[field]):
            return ''
        return Packet.decode_value(line.replace(Packet.codes[field], ''))

    @staticmethod
    def join_to_line(code, value, more=True):
        line = code + Packet.encode_value(value) + Packet.codes['end_packet'] if more else code + Packet.encode_value(
            value) + '8543'
        line += '0' * (Packet.PACKET_SIZE - len(line))
        return line

    @staticmethod
    def encode_value(value: str) -> str:
        return ''.join([hex(ord(c))[2:] for c in value])

    @staticmethod
    def decode_value(value: str) -> str:
        res = []
        for i in range(0, len(value), 2):
            if value[i: i + 2] is not '00':
                res.append(chr(int(value[i: i + 2], 16)))
        return ''.join(res)

    @staticmethod
    def extract_content(raw: List[str]) -> Tuple[str, dict]:
        path, params = '', {}
        path = Packet.extract_line_from_raw(raw[0], 'path')
        if len(raw) < 2 or not path:
            return path, params
        for i in range(1, len(raw) - 2, 2):
            param_name = Packet.extract_line_from_raw(raw[i], 'param_name')
            param_value = Packet.extract_line_from_raw(raw[i + 1], 'param_value')
            params[param_name] = param_value
        return path, params

    @staticmethod
    def encode_content(path: str, payload: dict) -> List[str]:
        more = True if payload else False
        raw = [Packet.join_to_line(Packet.codes['path'], path, more)]
        string_payload = str(payload)
        payload_packet_size = len(string_payload) // (Packet.PACKET_SIZE - len(Packet.codes['param_part'] * 2))
        for start in range(0, len(string_payload), payload_packet_size):
            more = start + payload_packet_size < len(string_payload)
            end = payload_packet_size if more else len(string_payload)
            packet_string = string_payload[start: end]
            raw.append(Packet.join_to_line(Packet.codes['param_part'], Packet.encode_value(packet_string), more))
        return raw


class Request(Packet):
    def __init__(self, raw: List[str]) -> None:
        super().__init__()
        self.path, self.payload = Request.extract_content(raw)

    @staticmethod
    def send_request(path: str, payload: dict):
        return Request.encode_content(path, payload)


class Response(Packet):
    def __init__(self, path: str, payload: dict):
        super().__init__()
        self.raw = Response.encode_content(path, payload)

    @staticmethod
    def get_response(raw: List[str]):
        return Response(*Response.extract_content(raw))
