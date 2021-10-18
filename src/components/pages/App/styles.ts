import {
    makeStyles,
} from '@material-ui/core';


export const getStyles = makeStyles(() => ({
    app: {
        color: 'rgba(245,245,220,0.7)',
        padding: '100px 0px 100px',
        textAlign: 'center',
        backgroundColor: '#282c34',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 'calc(10px + 2vmin)',
        gap: 50
    },
    input: {
        width: 250,
        '& .MuiInputLabel-root': {
            color: "beige"
          },
        '& .MuiInputBase-input': {
            color: 'beige',
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: '#fff8',
        },
        '& .MuiInput-underline:hover:before': {
            borderBottomColor: '#fff',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#fff',
        },
    },
    atmService: {
        display: 'flex', 
        flexDirection: 'column', 
        gap: 40
    },
    buttonGroup: {
        display: 'flex', 
        gap: 32
    },
    container: {
        width: '50%',
        paddingBottom: 100
    }
}));