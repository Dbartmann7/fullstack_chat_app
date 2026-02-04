import type { Dispatch, SetStateAction } from "react"
import styles from "./Input.module.css"


type InputProps = {
    value:string,
    setValue:Dispatch<SetStateAction<string>>,
    type?:string,
    maxLength?:number
    placeholder?:string
}

export const Input = ({value, setValue, type="text", maxLength, placeholder}:InputProps) => {
    


    return(
        <div className={styles.inputContainer}>
            <input
                className={styles.input}
                value={value}
                onInput={(e) => setValue(e.currentTarget.value)}
                type={type}
                maxLength={maxLength}
                placeholder={placeholder}
            />
        </div>
    )
}