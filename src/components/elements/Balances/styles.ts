import { makeStyles } from '@material-ui/core';

export const getStyles = makeStyles(() => ({
    root: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '50%'
    },
    notes: {
        display: 'flex', 
        flexDirection: 'column' 
    },
    value: {
        display: 'flex', 
        flexDirection: 'row'
    }
}));