from abc import ABC, abstractmethod
from datetime import datetime

class Account(ABC):
    def __init__(self, id, client, balance=0):
        self.id = id
        self.client = client
        self.balance = balance
    
    def __str__(self):
        return f"ID: {self.id} | Баланс: {self.balance}"

    def deposit(self, amount):
        self._validate_amount(amount)
        self.balance += amount

    @abstractmethod
    def withdraw(self, amount):
        pass

    def transfer(self, target, amount):
        if self.id == target.id:
            raise ValueError("Нельзя перевести деньги на тот же счет")
        self.withdraw(amount)
        target.deposit(amount)

    def _validate_amount(self, amount):
        if amount <= 0:
            raise ValueError("Сумма должна быть больше нуля")

class DebitAccount(Account):
    def withdraw(self, amount):
        self._validate_amount(amount)
        if self.balance < amount:
            raise ValueError("Недостаточно средств")
        self.balance -= amount

class DepositAccount(Account):
    def __init__(self, id, client, end_date, balance=0):
        super().__init__(id, client, balance)
        self.end_date = end_date

    def withdraw(self, amount):
        self._validate_amount(amount)
        if datetime.now() < self.end_date:
            raise ValueError("Срок депозита не истек")
        if self.balance < amount:
            raise ValueError("Недостаточно средств")
        self.balance -= amount

class CreditAccount(Account):
    def __init__(self, id, client, credit_limit, commission, balance=0):
        super().__init__(id, client, balance)
        self.credit_limit = credit_limit
        self.commission = commission

    def withdraw(self, amount):
        self._validate_amount(amount)
        if self.balance - amount < -self.credit_limit:
            raise ValueError("Превышен кредитный лимит")

        self.balance -= amount
        self._apply_commission()

    def _apply_commission(self):
        if self.balance < 0:
            print(f"Списана комиссия {self.commission}")
            self.balance -= self.commission
