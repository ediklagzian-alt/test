from commands.base_command import Command

class WithdrawCommand(Command):
    def __init__(self, account, amount):
        super().__init__()
        self.account = account
        self.amount = amount

    def execute(self):
        self.account.withdraw(self.amount)
        self.executed = True

    def undo(self):
        if self.executed:
            self.account.deposit(self.amount)
            self.executed = False

    def get_actors(self):
        return self.account, None, self.amount, "withdraw"
