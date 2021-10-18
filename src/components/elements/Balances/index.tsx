import { getStyles } from './styles';
import { observer } from 'mobx-react-lite';
import { getRootStore } from 'src/store';


export const Balances = observer(() => {

    const {
        atmStore: { arrayFromAtmBalance },
        userStore: { arrayFromUserBalance }
    } = getRootStore();
    const classes = getStyles();

    const balanceConfig = [
        {
            title: 'Atm balance',
            notes: arrayFromAtmBalance,
        },
        {
            title: 'User balance',
            notes: arrayFromUserBalance,
        },
    ]
    return (
        <div className={classes.root}>
            {balanceConfig.map(el => (
                <div key={el.title} className={classes.notes}>
                    <p>{el.title}</p>
                    {el.notes.map(el => (
                        <div key={el.type} className={classes.value}>
                            {el.type}: {el.value}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
})
