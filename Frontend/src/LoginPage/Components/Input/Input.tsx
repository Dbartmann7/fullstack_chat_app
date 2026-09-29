import type { Dispatch, SetStateAction } from "react"
import styles from "./Input.module.css"
import { type KeyboardEvent } from "react"

type InputProps = {
    value:string,
    setValue:Dispatch<SetStateAction<string>>,
    type?:string,
    maxLength?:number
    placeholder?:string
    submitFn?:() => void
}

export const Input = ({value, setValue, type="text", maxLength, placeholder, submitFn}:InputProps) => {
    
    const handleSubmit = (e:KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter" && submitFn) submitFn()
    }

    return(
        <div className={styles.inputContainer}>
            <input
                className={styles.input}
                value={value}
                onInput={(e) => setValue(e.currentTarget.value)}
                type={type}
                maxLength={maxLength}
                placeholder={placeholder}
                onKeyDown={handleSubmit}
            />
        </div>
    )
}