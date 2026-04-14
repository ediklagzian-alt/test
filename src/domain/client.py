import uuid

class Client:
    def __init__(self, first_name, last_name, address=None, passport=None):
        self.id = str(uuid.uuid4())
        self.first_name = first_name
        self.last_name = last_name
        self.address = address
        self.passport = passport
        
    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def is_verified(self):
        return self.address is not None and self.passport is not None

    def set_address(self, address):
        self.address = address

    def set_passport(self, passport):
        self.passport = passport
