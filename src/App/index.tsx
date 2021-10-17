import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { getStyles } from './styles';
import { getRootStore } from '../store';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

// const bank = [
//     { name: 5000, count: 4 },
//     { name: 2000, count: 6 },
//     { name: 1000, count: 9 },
//     { name: 500, count: 8 },
//     { name: 200, count: 2 },
//     { name: 100, count: 5 }
// ]

// const bank1 = [
//     [ 5000, 4 ],
//     [ 2000, 6 ],
//     [ 1000, 9 ],
//     [ 500, 8 ],
//     [ 200, 2 ],
//     [ 100, 5 ],

//     [ 2000, 1 ],
//     [ 1000, 4 ],
//     [ 100, 2 ],
// ]



// const user = [
//     { name: 2000, count: 1 },
//     { name: 1000, count: 4 },
//     { name: 100, count: 2 }
// ]

const funcForCheck = (checkValue: number, balanceKeys: number[], balance: Map<number, number>) => {
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

type Operation = 'getFromAtm' | 'setToAtm' | 'setToAll' | 'getFromAll';

export const App = observer(() => {

    const [mainValue, setMainValue] = useState('');
    const [pincode, setPincode] = useState('');
    const [enteredCard, setEnteredCard] = useState(false);
    const [openAtmField, setOpenAtmField] = useState(false);

    const classes = getStyles();
    const {
        atmStore: { atmInitValue, atmBalance, setAtmBalance, writeOffAtmBalance, atmBalanceKeys, setToOneBalance },
        userStore: { userBalance, userInitValue, setUserBalance, writeOffUserBalance, userBalanceKeys }
    } = getRootStore();


    const click = (type: Operation) => {

        setToOneBalance(type, Number(mainValue), setMainValue)
        // if (Number(mainValue) > userBalance) {
        //     console.log('Операция не может быть выполнена. На вашем балансе недостаточно средств')
        //     return
        // } else if (Number(mainValue) > atmBalance && type === 'getFromAtm') {
        //     console.log('Операция не может быть выполнена. В банкомате нет достаточной суммы')
        //     return
        // }

        // let initValue = type === 'getFromAtm' ? atmInitValue : userInitValue;
        // let initBalanceKeys = type === 'getFromAtm' ? atmBalanceKeys : userBalanceKeys;

        // let difference = Number(mainValue);
        // const atmOperations = (diff: number, atmCell: number) => {
        //     let notesHave = initValue.get(atmCell) || 0;
        //     let notesNeed = Math.floor(diff / atmCell);
        //     let minNotesNeed = Math.min(notesHave, notesNeed);

        //     if (notesHave && minNotesNeed) {
        //         if (notesHave >= minNotesNeed) {
        //             if (type === 'getFromAtm') {
        //                 writeOffAtmBalance(atmCell, minNotesNeed)
        //                 setUserBalance(atmCell, minNotesNeed)
        //             }
        //             if (type === 'setToAtm') {
        //                 setAtmBalance(atmCell, minNotesNeed)
        //                 writeOffUserBalance(atmCell, minNotesNeed)
        //             }
        //         } else {
        //             return
        //         }
        //     }
        //     difference = diff - minNotesNeed * atmCell
        //     return difference
        // }
        // const resCheck = funcForCheck(Number(mainValue), initBalanceKeys, initValue)
        // console.log('resCheck', resCheck)
        // for (let el of initBalanceKeys) {
        //     if (!resCheck) {
        //         let res = atmOperations(difference, el)
        //         if (res) {
        //             atmOperations(difference, el)
        //         } else {
        //             setMainValue('')
        //             return
        //         }
        //     } else {
        //         console.log('Операция не может быть выполнена. В банкомате нет необходимых купюр')
        //         return
        //     }
        // }
    }

    console.log(toJS(atmInitValue))
    console.log(toJS(userInitValue))


    const checkPincode = () => {
        if (pincode === '0000') {
            setPincode('');
            setOpenAtmField(true);
        }
    };
    const enterCard = () => {
        setEnteredCard(!enteredCard)
        // setOpenAtmField(!openAtmField)
    }
    return (
        <div className={classes.app}>

            <div style={{ display: 'flex', gap: 32, alignItems: 'center', marginBottom: 50 }}>
                <span>Вставьте карту</span>
                <button style={{ width: 50 }} onClick={() => enterCard()}>ok</button>
            </div>


            {enteredCard && <div className={classes.card}>
                <TextField
                    autoFocus
                    disabled={openAtmField}
                    value={pincode}
                    onChange={(e) => setPincode(e.currentTarget.value)} />
                <button
                    disabled={openAtmField}
                    style={{ width: 50, height: 30 }} onClick={() => checkPincode()}>enter</button>


            </div>}

            {openAtmField && <div>
                <TextField
                    autoFocus
                    value={mainValue}
                    className={classes.input}
                    onChange={(e) => setMainValue(e.currentTarget.value)} />

                <div style={{ display: 'flex', gap: 32 }}>
                    <button onClick={() => click('getFromAtm')}>
                        get
                    </button>
                    <button onClick={() => click('setToAtm')}>
                        set
                    </button>
                </div>
                <div>
                    {mainValue}
                </div>
            </div>}

        </div>
    );
})
