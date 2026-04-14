class Bank:
    def __init__(self, suspicious_limit):
        self.clients = []
        self.accounts = []
        self.transactions = []
        self.suspicious_limit = suspicious_limit

    def add_client(self, client):
        self.clients.append(client)

    def add_account(self, account):
        self.accounts.append(account)

    def execute_transaction(self, command):
        self._check_limits(command)
        command.execute()
        self.transactions.append(command)

    def rollback(self, command=None):
        if not self.transactions:
            raise ValueError("Нет транзакций для отмены")

        if command is None:
            command = self.transactions[-1]
        elif command not in self.transactions:
            raise ValueError("Транзакция не найдена в истории банка")

        command.undo()
        self.transactions.remove(command)

    def _check_limits(self, command):
        from commands.withdraw_command import WithdrawCommand
        from commands.transfer_command import TransferCommand

        if isinstance(command, WithdrawCommand):
            acc = command.account
            if not acc.client.is_verified() and command.amount > self.suspicious_limit:
                raise ValueError("Ограничение для сомнительного клиента")

        if isinstance(command, TransferCommand):
            from_acc = command.from_acc
            if not from_acc.client.is_verified() and command.amount > self.suspicious_limit:
                raise ValueError("Ограничение для сомнительного клиента")
