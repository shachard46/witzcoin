from typing import Tuple, List

from server import utils


class Packet:
    PACKET_SIZE = 15
    CODE_SIZE = 4
    codes = {
        'path': '19e5',
        'param_part': '673a',
        'end_packet': '9494',
        'pasten': '1991'
    }

    def __init__(self) -> None:
        pass

    @staticmethod
    def _extract_line_from_raw(line: str) -> Tuple:
        code = line[:Packet.CODE_SIZE]
        field = ''
        for f, c in Packet.codes.items():
            if c == code:
                field = f
                break
        if not field:
            return '', ''
        return field, Packet._decode_value(line.replace(code, '', 1))

    @staticmethod
    def _join_to_line(code, value, more=True):
        line = code + Packet._encode_value(value) if more else code + Packet._encode_value(
            value)
        line += '0' * (Packet.PACKET_SIZE - Packet.CODE_SIZE - len(line))
        line += Packet.codes['end_packet'] if more else Packet.codes['pasten']
        return line

    @staticmethod
    def _encode_value(value: str) -> str:
        return ''.join([hex(ord(c))[2:] for c in value])

    @staticmethod
    def _decode_value(value: str) -> str:
        res = []
        for i in range(0, len(value) - Packet.CODE_SIZE, 2):
            if value[i: i + 4] == '0000':
                break
            res.append(chr(int(value[i: i + 2], 16)))
        return ''.join(res)

    @staticmethod
    def extract_content(raw: List[str]) -> Tuple[str, dict]:
        path = ''
        payload = []
        for packet in raw:
            field, value = Packet._extract_line_from_raw(packet)
            if field == 'path':
                path += value
            else:
                payload.append(value)
        try:
            return path, eval(utils.filter_unreadable_chars(''.join(payload)))
        except SyntaxError:
            return path, utils.filter_unreadable_chars(''.join(payload))

    @staticmethod
    def encode_content(path: str, payload: dict) -> List[str]:
        more = True if payload else False
        raw = [Packet._join_to_line(Packet.codes['path'], path, more)]
        if not payload:
            return raw
        string_payload = str(payload)
        content_size = (Packet.PACKET_SIZE - Packet.CODE_SIZE * 2) // 2
        for start in range(0, len(string_payload), content_size):
            more = start + content_size < len(string_payload)
            end = content_size + start if more else len(string_payload)
            packet_string = string_payload[start: end]
            raw.append(Packet._join_to_line(Packet.codes['param_part'], packet_string, more))
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
