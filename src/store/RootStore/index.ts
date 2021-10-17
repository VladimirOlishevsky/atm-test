import { AtmStore, UserStore } from "..";

export class RootStore {
  atmStore: AtmStore;
  userStore: UserStore;

  constructor() {
    this.atmStore = new AtmStore();
    this.userStore = new UserStore();
  }
}

const rootStore = new RootStore();
export const getRootStore = (): RootStore => rootStore;
