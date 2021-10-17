import {
  observable, makeAutoObservable, action, computed
} from 'mobx';
// import { computedFn } from 'mobx-utils';

interface InitValue {
  name: number,
  count: number
}


export class UserStore {

  userInitValue: Map<number, number> = new Map([
    [2000, 4],
    [1000, 0],
    [100, 2],
  ]);

  constructor() {
    makeAutoObservable(this, {
      userInitValue: observable,
      setUserBalance: action,
      userBalance: computed,
    });
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
    return Array.from(this.userInitValue.keys())
  }

  // private addMoney = (statusKey: string) => {
  //   this.loadingStatuses.delete(statusKey);
  // };

  // getFinalMarkById = computedFn((yearId: number) => {
  //   const {
  //     sessionStore: {
  //       activeStudentProfileId,
  //     },
  //   } = getCommonStore();
  //   return this.studentProfilesWithFinalMarksCollection.get(activeStudentProfileId)?.get(yearId);
  // });

  // setCash = () => {
  //   this.cash.set();
  //   this.setStudentProfiles(yearId);
  // };

  // setStudentProfiles = (yearId: number) => {
  //   const {
  //     sessionStore: {
  //       activeStudentProfileId,
  //     },
  //   } = getCommonStore();
  //   if (!this.studentProfilesWithFinalMarksCollection
  //     .has(activeStudentProfileId)) { this.finalMarkAtProfile = new Map(); }
  //   this.studentProfilesWithFinalMarksCollection
  //     .set(activeStudentProfileId, this.finalMarkAtProfile.set(yearId, this.finalMarksList));
  // };

  // private finalMarksAdapter = (marks: IFinalMarksApi[]) => {
  //   return runInAction(() => {
  //     return marks.map((item) => {
  //       const finalMarkYear = new FinalMarksYear();
  //       finalMarkYear.fromApi(item);
  //       return finalMarkYear;
  //     });
  //   });
  // };
}
