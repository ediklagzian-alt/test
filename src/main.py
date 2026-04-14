import os

from builders.client_builder import ClientBuilder
from factories.account_factory import AccountFactory
from domain.bank import Bank
from commands.withdraw_command import WithdrawCommand
from commands.transfer_command import TransferCommand

def get_suspicious_limit():
    raw_value = os.getenv("BANK_SUSPICIOUS_LIMIT", "1000")
    try:
        limit = int(raw_value)
        if limit <= 0:
            raise ValueError
        return limit
    except ValueError:
        print("BANK_SUSPICIOUS_LIMIT задан некорректно, используется 1000")
        return 1000

bank = Bank(get_suspicious_limit())
clients = []
accounts = []

def read_int(prompt):
    try:
        return int(input(prompt))
    except ValueError:
        print("Нужно ввести число")
        return None

def create_client():
    f = input("Имя: ")
    l = input("Фамилия: ")
    addr = input("Адрес: ")
    pas = input("Паспорт: ")

    b = ClientBuilder().set_name(f, l)
    if addr:
        b.set_address(addr)
    if pas:
        b.set_passport(pas)

    c = b.build()
    bank.add_client(c)
    clients.append(c)

    print("Создан клиент:", c.id)


def create_account():
    if not clients:
        print("Нет клиентов")
        return

    for i, c in enumerate(clients):
        print(i, c.first_name, c.last_name)

    i = read_int("Выбор клиента: ")
    if i is None or i < 0 or i >= len(clients):
        print("Некорректный выбор")
        return
    client = clients[i]

    print("""
1. Дебетовый счет
2. Депозит
3. Кредитный счет
""")

    acc_type = input("Тип счета: ")

    if acc_type == "1":
        acc = AccountFactory.create_debit(client)

    elif acc_type == "2":
        from datetime import datetime, timedelta
        days = int(input("Срок депозита (дней): "))
        end_date = datetime.now() + timedelta(days=days)
        acc = AccountFactory.create_deposit(client, end_date)

    elif acc_type == "3":
        limit = read_int("Кредитный лимит: ")
        commission = read_int("Комиссия: ")
        if limit is None or commission is None:
            return
        acc = AccountFactory.create_credit(client, limit, commission)

    else:
        print("Ошибка")
        return

    bank.add_account(acc)
    accounts.append(acc)

    print("Счет создан:", acc)


def deposit():
    if not accounts:
        print("Нет счетов")
        return

    for i, a in enumerate(accounts):
        print(i, a.id, a.balance)

    i = read_int("Счет: ")
    amt = read_int("Сумма: ")
    if i is None or amt is None or i < 0 or i >= len(accounts):
        print("Некорректные данные")
        return

    try:
        accounts[i].deposit(amt)
    except ValueError as e:
        print("Ошибка:", e)


def withdraw():
    if not accounts:
        print("Нет счетов")
        return

    for i, a in enumerate(accounts):
        print(i, a.id, a.balance)

    i = read_int("Счет: ")
    amt = read_int("Сумма: ")
    if i is None or amt is None or i < 0 or i >= len(accounts):
        print("Некорректные данные")
        return

    try:
        cmd = WithdrawCommand(accounts[i], amt)
        bank.execute_transaction(cmd)
    except ValueError as e:
        print("Ошибка:", e)


def transfer():
    if len(accounts) < 2:
        print("Нужно минимум 2 счета")
        return

    for i, a in enumerate(accounts):
        print(i, a.id, a.balance)

    f = read_int("Откуда: ")
    t = read_int("Куда: ")
    amt = read_int("Сумма: ")
    if (
        f is None or t is None or amt is None or
        f < 0 or t < 0 or f >= len(accounts) or t >= len(accounts)
    ):
        print("Некорректные данные")
        return

    try:
        cmd = TransferCommand(accounts[f], accounts[t], amt)
        bank.execute_transaction(cmd)
    except ValueError as e:
        print("Ошибка:", e)

def rollback_last():
    try:
        bank.rollback()
        print("Последняя транзакция отменена")
    except ValueError as e:
        print("Ошибка:", e)


def show():
    for a in accounts:
        print(a.id, "Баланс:", a.balance)


while True:
    print("""
1. Создать клиента
2. Открыть счет
3. Пополнить
4. Снять
5. Перевод
6. Показать баланс
7. Отменить последнюю транзакцию
0. Выход
""")

    c = input("> ")

    if c == "1":
        create_client()
    elif c == "2":
        create_account()
    elif c == "3":
        deposit()
    elif c == "4":
        withdraw()
    elif c == "5":
        transfer()
    elif c == "6":
        show()
    elif c == "7":
        rollback_last()
    elif c == "0":
        break