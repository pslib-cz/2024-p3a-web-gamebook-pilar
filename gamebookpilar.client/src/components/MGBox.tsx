import {FC, useContext} from "react";
import s from './MGBox.module.css';

type MGBoxProps = {
    content: string
}

export const MGBox:FC<MGBoxProps> = ({content}) => {

    const getColor = (curr: number) => {
        console.log(curr);
        switch (curr) {
            case 1:
                return "#606030";
            case 2:
                return "#306030";
            case 3:
                console.log("AAAAAAAAAAA");
                return "#603030";
            default:
                return "#303030";
        }
    }

    return (
        <p className={s.main} style={{background: getColor(parseInt(content.split("|")[1]))}}>{content.split("|")[0]}</p>
    )
}

export default MGBox;