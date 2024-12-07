import {FC, useContext} from "react";

type MGBoxProps = {
    content: string
}

export const MGBox:FC<MGBoxProps> = ({content}) => {

    const getColor = (curr: number) => {
        switch (curr) {
            case 1:
                return "#606030";
            case 2:
                return "#306030";
            default:
                return "#303030";
        }
    }

    return (
        <>
            <p style={{background: getColor(parseInt(content.split("|")[1])), padding: "0.5rem 1rem" }}>{content.split("|")[0]}</p>
        </>
    )
}

export default MGBox;