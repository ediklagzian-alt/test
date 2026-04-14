from abc import ABC, abstractmethod

class Command(ABC):
    def __init__(self):
        self.executed = False

    @abstractmethod
    def execute(self):
        pass

    @abstractmethod
    def undo(self):
        pass

    @abstractmethod
    def get_actors(self):
        pass
