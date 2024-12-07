import {FC, useId, useState} from "react"; 

type InputFieldProps = {
    onChange: (data?:string) => void;
    defaultValue?: string;
}

export const InputField:FC<InputFieldProps> = ({onChange, defaultValue}) => {
    const [value, setValue] = useState(defaultValue);
    const id = useId();
 
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };
 
    return (
        <label htmlFor={id}>
            <input type="text" value={value} onChange={handleChange} />
        </label>
    );
}

export default InputField;