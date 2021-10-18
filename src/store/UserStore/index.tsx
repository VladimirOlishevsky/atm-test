import {
  makeAutoObservable
} from 'mobx';
import { INotes } from 'src/constants';


export class UserStore {
  userInitValue: Map<number, number> = new Map([
    [5000, 0],
    [2000, 1],
    [1000, 4],
    [500, 0],
    [200, 0],
    [100, 2]
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

  get arrayFromUserBalance(): INotes[] {
    const arr = this.userBalanceKeys.map(el => ({
      type: el,
      value: this.userInitValue.get(el)
    }))
    return arr
  }
}
