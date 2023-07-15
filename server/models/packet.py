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
        return Packet.decode_value(line.replace(Packet.codes[field], '', 1))

    @staticmethod
    def join_to_line(code, value, more=True):
        line = code + Packet.encode_value(value) if more else code + Packet.encode_value(
            value)
        line += '0' * (Packet.PACKET_SIZE - len(Packet.codes['end_packet']) - len(line))
        line += Packet.codes['end_packet'] if more else '8543'
        return line

    @staticmethod
    def encode_value(value: str) -> str:
        return ''.join([hex(ord(c))[2:] for c in value])

    @staticmethod
    def decode_value(value: str) -> str:
        res = []
        for i in range(0, len(value) - len(Packet.codes['end_packet']), 2):
            if value[i: i + 4] == '0000':
                break
            res.append(chr(int(value[i: i + 2], 16)))
        return ''.join(res)

    @staticmethod
    def extract_content(raw: List[str]) -> Tuple[str, dict]:
        path = Packet.extract_line_from_raw(raw[0], 'path')
        if len(raw) < 2 or not path:
            return path, {}
        payload = []
        for packet in raw:
            payload.append(Packet.extract_line_from_raw(packet, 'param_part'))
        return path, eval(''.join(payload))

    @staticmethod
    def encode_content(path: str, payload: dict) -> List[str]:
        more = True if payload else False
        raw = [Packet.join_to_line(Packet.codes['path'], path, more)]
        if not payload:
            return raw
        string_payload = str(payload)
        packet_size = (Packet.PACKET_SIZE - len(Packet.codes['param_part']) * 2) // 2
        for start in range(0, len(string_payload), packet_size):
            more = start + packet_size < len(string_payload)
            end = packet_size + start if more else len(string_payload)
            packet_string = string_payload[start: end]
            raw.append(Packet.join_to_line(Packet.codes['param_part'], packet_string, more))
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
        return Response.extract_content(raw)[1]
