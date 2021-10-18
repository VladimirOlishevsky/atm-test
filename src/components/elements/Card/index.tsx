import React from 'react';
import { TextField, Tooltip } from '@material-ui/core';
import { getStyles } from './styles';
import { observer } from 'mobx-react-lite';
import { getRootStore } from 'src/store';

interface ICard {
    openAtmField: boolean,
    setOpenAtmField: React.Dispatch<React.SetStateAction<boolean>>,
    setEnteredCard: React.Dispatch<React.SetStateAction<boolean>>,
    pincode: string,
    setPincode: (value: React.SetStateAction<string>) => void,
    checkPincode: () => void
}

export const Card = observer(({
    openAtmField,
    setOpenAtmField,
    setEnteredCard,
    pincode,
    setPincode,
    checkPincode
}: ICard) => {
    const {
        atmStore: { tooltip, resetTooltip },
        userStore: { userBalance },
    } = getRootStore();
    const classes = getStyles();

    const clickExit = () => {
        resetTooltip();
        setOpenAtmField(false);
        setEnteredCard(false)
    }

    const onChange = (value: string) => {
        resetTooltip();
        setPincode(value)
    }
    return (
        <div className={classes.card}>
            {openAtmField
                ? null
                : <>
                <Tooltip placement="top" title={tooltip} arrow open={tooltip ? true : false}>
                    <TextField
                        type='password'
                        autoFocus
                        disabled={openAtmField}
                        value={pincode}
                        onChange={(e) => onChange(e.currentTarget.value)} />
                </Tooltip>
                    
                    <button
                        disabled={openAtmField}
                        onClick={() => checkPincode()}>
                        ввести пинкод
                    </button>
                </>}
            {openAtmField &&
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <span>{`Ваш баланс ${userBalance}`} </span>
                    <button
                        onClick={() => clickExit()}>
                        завершить сеанс
                    </button>
                </div>}
        </div>
    )
})
