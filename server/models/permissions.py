class Permissions:
    def __init__(self, allowed_ips, blocked_ips, admin_ip):
        self.allowed_ips: list = allowed_ips
        self.blocked_ips: list = blocked_ips
        self.admin_ip: str = admin_ip

    def allow_ip(self, ip):
        self.allowed_ips.append(ip)

    def block_ip(self, ip):
        self.blocked_ips.append(ip)

    def is_admin(self, ip):
        return ip == self.admin_ip

    def is_allowed(self, ip):
        return (ip in self.allowed_ips or self.is_admin(ip)) and ip not in self.blocked_ips
