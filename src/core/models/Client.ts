export interface ClientData {
  firstName: string;
  lastName: string;
  address?: string;
  passport?: string;
}

export class Client {
  public firstName: string;
  public lastName: string;
  public address?: string;
  public passport?: string;

  constructor(data: ClientData) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.address = data.address;
    this.passport = data.passport;
  }

  get isDoubtful(): boolean {
    return !this.address || !this.passport;
  }

  updateAddress(address: string) {
    this.address = address;
  }

  updatePassport(passport: string) {
    this.passport = passport;
  }
}
