import {
  observable, action, computed, makeAutoObservable
} from 'mobx';
import { getRootStore } from '..';

interface InitValue {
  name: number,
  count: number
}

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
    makeAutoObservable(this, {
      // academicYearId: observable,
      // createdAt: observable,
      // gradeSystemType: observable,
      // id: observable,
      // studentProfileId: observable,
      // subjectName: observable,
      // value: observable,
      // fromApi: action,
      atmInitValue: observable,
      setAtmBalance: action,
      valueFromBalance: action,
      atmBalance: computed,
      atmBalanceKeys: computed,
      atmBalanceValues: computed
    });
  }

  // setAtmBalance = (key: number, value: number) => {
  //   this.atmInitValue.set(key, value)
  // }

  setAtmBalance = (key: number, value: number) => {
    this.atmInitValue.set(key, (this.atmInitValue.get(key) || 0) + value)
  }

  writeOffAtmBalance = (key: number, value: number) => {
    this.atmInitValue.set(key, (this.atmInitValue.get(key) || 0) - value)
  }

  resetBalance = () => {
    this.atmInitValue = new Map()
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

  get atmBalanceValues(): number[] {
    return Array.from(this.atmInitValue.values())
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

  setToOneBalance = (type: Operation, inputValue: number, setinputValue: React.Dispatch<React.SetStateAction<string>>) => {
    const {
      // atmStore: { atmInitValue, atmBalance, setAtmBalance, writeOffAtmBalance, atmBalanceKeys },
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
    const resCheck = this.checkFunction(inputValue, initBalanceKeys, initValue)
    console.log('resCheck', resCheck)
    for (let el of initBalanceKeys) {
      if (!resCheck) {
        let res = atmOperations(difference, el)
        if (res) {
          atmOperations(difference, el)
        } else {
          setinputValue('')
          return
        }
      } else {
        if(type === 'setToAtm') {
          console.log('Операция не может быть выполнена. У вас нет необходимых купюр')
        }
        if(type === 'getFromAtm') {
           console.log('Операция не может быть выполнена. В банкомате нет необходимых купюр')
        }
       
        return
      }
    }
  }
}
