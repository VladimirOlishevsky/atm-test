import { makeStyles } from '@material-ui/core';

export const getStyles = makeStyles(() => ({
    card: {
        display: 'flex',
        borderRadius: 32,
        backgroundColor: '#fff',
        width: 400,
        height: 200,
        color: '#000',
        flexDirection: 'column',
        boxSizing: 'border-box',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
}));