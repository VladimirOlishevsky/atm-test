import React, { useState } from 'react';
import { TextField, Typography } from '@material-ui/core';
import { getStyles } from './styles';
import { observer } from 'mobx-react-lite';
import { getRootStore } from 'src/store';
import { defaultPincode, Operation } from 'src/constants';
import { AtmTitle, Balances, ButtonGroup, Card } from 'src/components';


export const App = observer(() => {

    const [inputValue, setInputValue] = useState('');
    const [pincode, setPincode] = useState('');
    const [enteredCard, setEnteredCard] = useState(false);
    const [openAtmField, setOpenAtmField] = useState(false);

    const classes = getStyles();
    const {
        atmStore: { atmUserOperations, setToAllBalances, writeOffFromAllBalances, tooltip, setTooltip, resetTooltip },
    } = getRootStore();

    const personalAction = (type: Operation) => {
        atmUserOperations(type, Number(inputValue), setInputValue)
    }
    const setToAll = () => {
        setToAllBalances(Number(inputValue), setInputValue)
    }
    const writeOffFromAll = () => {
        writeOffFromAllBalances(Number(inputValue), setInputValue)
    }
    const checkPincode = () => {
        if (pincode === defaultPincode) {
            resetTooltip();
            setPincode('');
            setInputValue('');
            setOpenAtmField(true);
        } else {
            setTooltip('Неверный пинкод. Попробуйте еще раз')
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
                    setOpenAtmField={setOpenAtmField}
                    setEnteredCard={setEnteredCard}
                    pincode={pincode}
                    setPincode={setPincode}
                    checkPincode={checkPincode} />}

            {openAtmField &&
                <div className={classes.atmService}>
                    <TextField
                        autoFocus
                        value={inputValue}
                        className={classes.input}
                        onChange={(e) => setInputValue(e.currentTarget.value)} />
                    {tooltip && <div style={{ display: 'flex', width: 250, justifyContent: 'center' }}>
                        <Typography>{tooltip}</Typography>
                    </div>}
                    <ButtonGroup buttonConfig={buttonsConfig.filter(el => el.type === 'personal')} />
                    <ButtonGroup buttonConfig={buttonsConfig.filter(el => el.type === 'all')} />
                </div>}

            {openAtmField && <Balances />}
        </div>
    );
})
