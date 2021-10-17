import {
  makeAutoObservable
} from 'mobx';
import { getRootStore } from '..';

type Operation = 'getFromAtm' | 'setToAtm' | 'setToAll' | 'getFromAll';

export class AtmStore {

  atmInitValue = new Map([
    [5000, 0],
    [2000, 0],
    [1000, 3],
    [500, 8],
    [200, 0],
    [100, 0]
  ]);

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
    setInputValue('')
  }

  writeOffFromAllBalances = (inputValue: number, setInputValue: React.Dispatch<React.SetStateAction<string>>) => {
    const {
      userStore: { userBalance, userInitValue, writeOffUserBalance, userBalanceKeys }
    } = getRootStore();

    if (inputValue > userBalance) {
      console.log('Операция не может быть выполнена. На вашем балансе недостаточно средств')
      return
    } else if (inputValue > this.atmBalance) {
      console.log('Операция не может быть выполнена. В банкомате нет достаточной суммы')
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

    const resCheck = this.checkFunction(inputValue, this.atmBalanceKeys, this.atmInitValue);
    const resCheck1 = this.checkFunction(inputValue, userBalanceKeys, userInitValue);

    const cycleConfig = [
      {
        isHaveReminder: resCheck,
        values: this.atmBalanceKeys,
        initValue: this.atmInitValue,
        diff: difference,
        type: 'atm',
        error: 'Операция не может быть выполнена. В банкомате нет необходимых купюр'
      },
      {
        isHaveReminder: resCheck1,
        values: userBalanceKeys,
        initValue: userInitValue,
        diff: difference1,
        type: 'user',
        error: 'Операция не может быть выполнена. У пользователя нет необходимых купюр'
      },
    ]

    cycleConfig.forEach(item => {
      for (let el of item.values) {
        if (!resCheck) {
          let res = atmOperations(item.initValue, item.diff, el, item.type)
          if (res) {
            atmOperations(item.initValue, item.diff, el, item.type)
          }
        } else {
          console.log(item.error)
          return
        }
      }
    })

    // for (let el of this.atmBalanceKeys) {
    //   if (!resCheck) {
    //     let res = atmOperations(this.atmInitValue, difference, el, 'atm')
    //     if (res) {
    //       atmOperations(this.atmInitValue, difference, el, 'atm')
    //     }
    //   } else {
    //     console.log('Операция не может быть выполнена. В банкомате нет необходимых купюр')
    //     return
    //   }
    // }

    // for (let el of userBalanceKeys) {
    //   if (!resCheck1) {
    //     let res = atmOperations(userInitValue, difference1, el, 'user')
    //     if (res) {
    //       atmOperations(userInitValue, difference1, el, 'user')
    //     }
    //   } else {
    //     console.log('Операция не может быть выполнена. У пользователя нет необходимых купюр')
    //     return
    //   }
    // }
  }

  setToOneBalance = (type: Operation, inputValue: number, setInputValue: React.Dispatch<React.SetStateAction<string>>) => {
    const {
      userStore: { userBalance, userInitValue, setUserBalance, writeOffUserBalance, userBalanceKeys }
    } = getRootStore();

    if (inputValue > userBalance) {
      console.log('Операция не может быть выполнена. На вашем балансе недостаточно средств')
      return
    } else if (inputValue > this.atmBalance && type === 'getFromAtm') {
      console.log('Операция не может быть выполнена. В банкомате нет достаточной суммы')
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
          setInputValue('')
          return
        }
      } else {
        if (type === 'setToAtm') {
          console.log('Операция не может быть выполнена. У вас нет необходимых купюр')
        }
        if (type === 'getFromAtm') {
          console.log('Операция не может быть выполнена. В банкомате нет необходимых купюр')
        }
        return
      }
    }
  }
}
