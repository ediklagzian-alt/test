from commands.base_command import Command

class TransferCommand(Command):
    def __init__(self, from_acc, to_acc, amount):
        super().__init__()
        self.from_acc = from_acc
        self.to_acc = to_acc
        self.amount = amount

    def execute(self):
        self.from_acc.withdraw(self.amount)
        self.to_acc.deposit(self.amount)
        self.executed = True

    def undo(self):
        if self.executed:
            if self.to_acc.balance < self.amount:
                raise ValueError("Невозможно отменить перевод: недостаточно средств на счете получателя")
            self.to_acc.balance -= self.amount
            self.from_acc.deposit(self.amount)
            self.executed = False

    def get_actors(self):
        return self.from_acc, self.to_acc, self.amount, "transfer"
