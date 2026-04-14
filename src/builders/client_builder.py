from domain.client import Client

class ClientBuilder:
    def __init__(self):
        self.first_name = None
        self.last_name = None
        self.address = None
        self.passport = None

    def set_name(self, first, last):
        self.first_name = first
        self.last_name = last
        return self

    def set_address(self, address):
        self.address = address
        return self

    def set_passport(self, passport):
        self.passport = passport
        return self

    def build(self):
        if not self.first_name or not self.last_name:
            raise Exception("Имя и фамилия обязательны")
        return Client(self.first_name, self.last_name, self.address, self.passport)
