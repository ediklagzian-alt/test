import uuid
from domain.account import DebitAccount, DepositAccount, CreditAccount

class AccountFactory:
    @staticmethod
    def create_debit(client):
        return DebitAccount(str(uuid.uuid4()), client)

    @staticmethod
    def create_deposit(client, end_date):
        return DepositAccount(str(uuid.uuid4()), client, end_date)

    @staticmethod
    def create_credit(client, limit, commission):
        return CreditAccount(str(uuid.uuid4()), client, limit, commission)
