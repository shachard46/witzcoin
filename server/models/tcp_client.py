import socket

from server.models.packet import Request, Response, Packet


class TCPClient:

    def __init__(self, host, port) -> None:
        self.host, self.port = host, port
        self.sok = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def connect(self):
        self.sok.connect((self.host, self.port))

    def __receive_packets(self):
        packets = []
        while True:
            packet = self.sok.recv(Packet.PACKET_SIZE).decode()
            if not packet:
                break
            packets.append(packet)
            if packet.endswith(Request.codes['end_packet']):
                break
        return packets

    def send_request(self, path: str, params=None) -> Response:
        if params is None:
            params = {}
        request = Request.send_request(path, params)
        for packet in request:
            self.sok.sendall(packet.encode())
        packets = self.__receive_packets()
        return Response.get_response(packets)
