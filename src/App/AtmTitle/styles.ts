import { makeStyles } from '@material-ui/core';

export const getStyles = makeStyles(() => ({
    root: {
        display: 'flex', 
        gap: 32, 
        alignItems: 'center', 
    },
    button: {
        padding: `8px 32px`
    },
}));