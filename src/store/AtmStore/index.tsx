import {
  makeAutoObservable
} from 'mobx';
import { INotes, Operation } from 'src/constants';
import { getRootStore } from '..';

export class AtmStore {

  atmInitValue = new Map([
    [5000, 4],
    [2000, 6],
    [1000, 9],
    [500, 8],
    [200, 2],
    [100, 5]
  ]);

  tooltip = '';

  constructor() {
    makeAutoObservable(this);
  }

  setAtmBalance = (key: number, value: number) => {
    this.atmInitValue.set(key, (this.atmInitValue.get(key) || 0) + value)
  }

  writeOffAtmBalance = (key: number, value: number) => {
    this.atmInitValue.set(key, (this.atmInitValue.get(key) || 0) - value)
  }

  valueFromBalance = (value: number) => {
    return this.atmInitValue.get(value)
  }

  get atmBalance(): number {
    let sum = 0;
    this.atmInitValue.forEach((key, value) => sum += key * value)
    return sum
  }

  get atmBalanceKeys(): number[] {
    return Array.from(this.atmInitValue.keys())
  }

  get arrayFromAtmBalance(): INotes[] {
    const arr = this.atmBalanceKeys.map(el => ({
      type: el,
      value: this.atmInitValue.get(el)
    }))
    return arr
  }

  setTooltip = (value: string) => {
    this.tooltip = value;
  }

  resetTooltip = () => {
    this.tooltip = '';
  }

  checkFunction = (checkValue: number, balanceKeys: number[], balance: Map<number, number>) => {
    let differenceForCheck = checkValue;
    balanceKeys.forEach(el => {
      let notesHave = balance.get(el) || 0;
      let notesNeed = Math.floor(differenceForCheck / el);
      let minNotesNeed = Math.min(notesHave, notesNeed);

      if (notesHave && minNotesNeed) {
        if (notesHave >= minNotesNeed) {
          differenceForCheck = differenceForCheck - minNotesNeed * el
          return differenceForCheck
        } else {
          return
        }
      }
    })
    return differenceForCheck
  }

  setToAllBalances = (inputValue: number, setInputValue: React.Dispatch<React.SetStateAction<string>>) => {
    const {
      userStore: { setUserBalance, userBalanceKeys }
    } = getRootStore();

    let difference = inputValue;
    const atmOperations = (diff: number, atmCell: number) => {
      let notesNeed = Math.floor(diff / atmCell);

      if (notesNeed) {
        setUserBalance(atmCell, notesNeed);
        this.setAtmBalance(atmCell, notesNeed)
      } else {
        return
      }
      difference = diff - notesNeed * atmCell
      return difference
    }

    for (let el of this.atmBalanceKeys) {
      let res = atmOperations(difference, el)
      if (res) {
        atmOperations(difference, el)
      }
    }

    for (let el of userBalanceKeys) {
      let res = atmOperations(difference, el)
      if (res) {
        atmOperations(difference, el)
      }
    }
    setInputValue('');
    this.resetTooltip();
  }

  writeOffFromAllBalances = (inputValue: number, setInputValue: React.Dispatch<React.SetStateAction<string>>) => {
    const {
      userStore: { userBalance, userInitValue, writeOffUserBalance, userBalanceKeys }
    } = getRootStore();

    if (inputValue > userBalance) {
      this.setTooltip('Операция не может быть выполнена. На вашем балансе недостаточно средств')
      return
    } else if (inputValue > this.atmBalance) {
      this.setTooltip('Операция не может быть выполнена. В банкомате нет достаточной суммы')
      return
    }

    let difference = inputValue;
    let difference1 = inputValue;
    const atmOperations = (initValue: Map<number, number>, diff: number, atmCell: number, type: string) => {
      let notesHave = initValue.get(atmCell) || 0;
      let notesNeed = Math.floor(diff / atmCell);
      let minNotesNeed = Math.min(notesHave, notesNeed);

      if (notesHave && minNotesNeed) {
        if (notesHave >= minNotesNeed) {
          type === 'atm' && this.writeOffAtmBalance(atmCell, minNotesNeed)
          type === 'user' && writeOffUserBalance(atmCell, minNotesNeed)
        } else {
          return
        }
      }
      if (type === 'atm') {
        difference = diff - minNotesNeed * atmCell
        return difference
      }
      if (type === 'user') {
        difference1 = diff - minNotesNeed * atmCell
        return difference1
      }
    }

    const resultCheckAtm = this.checkFunction(inputValue, this.atmBalanceKeys, this.atmInitValue);
    const resultCheckUser = this.checkFunction(inputValue, userBalanceKeys, userInitValue);

    for (let el of this.atmBalanceKeys) {
      if (!resultCheckAtm && !resultCheckUser) {
        let res = atmOperations(this.atmInitValue, difference, el, 'atm')
        if (res) {
          atmOperations(this.atmInitValue, difference, el, 'atm')
        }
      } else {
        if (resultCheckAtm) {
          this.setTooltip('Операция не может быть выполнена. В банкомате нет необходимых купюр');
          return
        }
        if (resultCheckUser) {
          this.setTooltip('Операция не может быть выполнена. У пользователя нет необходимых купюр')
          return
        }
      }
    }

    for (let el of userBalanceKeys) {
      let res = atmOperations(userInitValue, difference1, el, 'user')
      if (res) {
        atmOperations(userInitValue, difference1, el, 'user')
      }
    }

    setInputValue('');
    this.resetTooltip();
  }

  atmUserOperations = (type: Operation, inputValue: number, setInputValue: React.Dispatch<React.SetStateAction<string>>) => {
    const {
      userStore: { userBalance, userInitValue, setUserBalance, writeOffUserBalance, userBalanceKeys }
    } = getRootStore();

    if (inputValue > userBalance) {
      this.setTooltip('Операция не может быть выполнена. На вашем балансе недостаточно средств. Введите другую сумму или верните карту')
      return
    } else if (inputValue > this.atmBalance && type === 'getFromAtm') {
      this.setTooltip('Операция не может быть выполнена. В банкомате нет достаточной суммы. Введите другую сумму или верните карту')
      return
    }

    let initValue = type === 'getFromAtm' ? this.atmInitValue : userInitValue;
    let initBalanceKeys = type === 'getFromAtm' ? this.atmBalanceKeys : userBalanceKeys;

    let difference = inputValue;
    const atmOperations = (diff: number, atmCell: number) => {
      let notesHave = initValue.get(atmCell) || 0;
      let notesNeed = Math.floor(diff / atmCell);
      let minNotesNeed = Math.min(notesHave, notesNeed);

      if (notesHave && minNotesNeed) {
        if (notesHave >= minNotesNeed) {
          if (type === 'getFromAtm') {
            this.writeOffAtmBalance(atmCell, minNotesNeed)
            setUserBalance(atmCell, minNotesNeed)
          }
          if (type === 'setToAtm') {
            this.setAtmBalance(atmCell, minNotesNeed)
            writeOffUserBalance(atmCell, minNotesNeed)
          }
        } else {
          return
        }
      }
      difference = diff - minNotesNeed * atmCell
      return difference
    }

    const resCheck = this.checkFunction(inputValue, initBalanceKeys, initValue);
    for (let el of initBalanceKeys) {
      if (!resCheck) {
        let res = atmOperations(difference, el)
        if (res) {
          atmOperations(difference, el)
        } else {
          setInputValue('');
          this.resetTooltip();
          return
        }
      } else {
        if (type === 'setToAtm') {
          this.setTooltip('Операция не может быть выполнена. У вас нет необходимых купюр. Введите другую сумму или верните карту')
        }
        if (type === 'getFromAtm') {
          this.setTooltip('Операция не может быть выполнена. В банкомате нет необходимых купюр. Введите другую сумму или верните карту')
        }
        return
      }
    }
  }
}
