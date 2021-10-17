import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { getStyles } from './styles';
import { getRootStore } from '../store';
import { observer } from 'mobx-react-lite';
import { Card } from './Card';
import { AtmTitle } from './AtmTitle';
import { ButtonGroup } from './ButtonGroup';

type Operation = 'getFromAtm' | 'setToAtm' | 'setToAll' | 'getFromAll';

export const App = observer(() => {

    const [mainValue, setMainValue] = useState('');
    const [pincode, setPincode] = useState('');
    const [enteredCard, setEnteredCard] = useState(false);
    const [openAtmField, setOpenAtmField] = useState(false);

    const classes = getStyles();
    const {
        atmStore: { setToOneBalance, setToAllBalances, writeOffFromAllBalances },
    } = getRootStore();

    const personalAction = (type: Operation) => {
        setToOneBalance(type, Number(mainValue), setMainValue)
    }
    const setToAll = () => {
        setToAllBalances(Number(mainValue), setMainValue)
    }
    const writeOffFromAll = () => {
        writeOffFromAllBalances(Number(mainValue), setMainValue)
    }
    const checkPincode = () => {
        if (pincode === '0000') {
            setPincode('');
            setOpenAtmField(true);
        }
    };
    const enterCard = () => {
        setEnteredCard(!enteredCard)
    }

    const buttonsConfig = [
        {
            type: 'personal',
            title: 'Выдать',
            onClick: () => personalAction('getFromAtm')
        },
        {
            type: 'personal',
            title: 'Внести',
            onClick: () => personalAction('setToAtm')
        }, 
        {
            type: 'all',
            title: 'Внести на все',
            onClick: () => setToAll()
        },
        {
            type: 'all',
            title: 'Списать со всех',
            onClick: () => writeOffFromAll()
        },
    ]

    return (
        <div className={classes.app}>
            {!enteredCard && <AtmTitle enterCard={enterCard} />}
            {enteredCard &&
                <Card
                    openAtmField={openAtmField}
                    pincode={pincode}
                    setPincode={setPincode}
                    checkPincode={checkPincode} />}

            {openAtmField &&
                <div className={classes.atmService}>
                    <TextField
                        autoFocus
                        value={mainValue}
                        className={classes.input}
                        onChange={(e) => setMainValue(e.currentTarget.value)} />
                    <ButtonGroup buttonConfig={buttonsConfig.filter(el => el.type === 'personal')} />
                    <ButtonGroup buttonConfig={buttonsConfig.filter(el => el.type === 'all')} />
                </div>}
        </div>
    );
})
