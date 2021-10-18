import { getStyles } from './styles';
import { observer } from 'mobx-react-lite';

interface IAtmTitle {
    enterCard: () => void
}

export const AtmTitle = observer(({
    enterCard
}: IAtmTitle) => {
    const classes = getStyles();
    return (
        <div className={classes.root}>
            <span>Вставьте карту</span>
            <button
                className={classes.button}
                onClick={() => enterCard()}>
                ok
            </button>
        </div>

    )
})
