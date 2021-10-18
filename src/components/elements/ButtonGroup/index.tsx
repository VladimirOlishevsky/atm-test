import { getStyles } from './styles';
import { observer } from 'mobx-react-lite';

interface IButton {
    title: string;
    onClick: () => void;
}

interface IButtonGroup {
    buttonConfig: IButton[]
}

export const ButtonGroup = observer(({
    buttonConfig
}: IButtonGroup) => {
    const classes = getStyles();
    return (
        <div className={classes.buttonGroup}>
            {buttonConfig.map(el => (
                <button key={el.title} onClick={el.onClick}>
                    {el.title}
                </button>
            ))}
        </div>
    )
})
