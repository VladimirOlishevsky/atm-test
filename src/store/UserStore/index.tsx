import {
  makeAutoObservable
} from 'mobx';

export class UserStore {
  userInitValue: Map<number, number> = new Map([
    [2000, 4],
    [1000, 0],
    [100, 2],
  ]);
  constructor() {
    makeAutoObservable(this);
  }

  setUserBalance = (key: number, value: number) => {
    this.userInitValue.set(key, (this.userInitValue.get(key) || 0) + value)
  }

  writeOffUserBalance = (key: number, value: number) => {
    this.userInitValue.set(key, (this.userInitValue.get(key) || 0) - value)
  }

  get userBalance(): number {
    let sum = 0;
    this.userInitValue.forEach((key, value) => sum += key * value)
    return sum
  }

  get userBalanceKeys(): number[] {
    return Array.from(this.userInitValue.keys()).sort((a, b) => b - a)
  }
}
