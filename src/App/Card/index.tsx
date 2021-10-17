import React from 'react';
import { TextField } from '@material-ui/core';
import { getStyles } from './styles';
import { observer } from 'mobx-react-lite';
import { getRootStore } from '../../store';

interface ICard {
    openAtmField: boolean,
    pincode: string,
    setPincode: (value: React.SetStateAction<string>) => void,
    checkPincode: () => void
} 

export const Card = observer(({
    openAtmField,
    pincode,
    setPincode,
    checkPincode
}: ICard) => {
    const {
        userStore: { userBalance },
    } = getRootStore();
    const classes = getStyles();
    return (
        <div className={classes.card}>
            <TextField
                autoFocus
                disabled={openAtmField}
                value={pincode}
                onChange={(e) => setPincode(e.currentTarget.value)} />
            <button
                disabled={openAtmField}
                onClick={() => checkPincode()}>
                enter pincode
            </button>
           {openAtmField && <span>{`Ваш баланс ${userBalance}`} </span>}
        </div>
    )
})
