
export interface INotes {
    type: number,
    value?: number
}

export type Operation = 'getFromAtm' | 'setToAtm' | 'setToAll' | 'getFromAll';

export const defaultPincode = '0000';