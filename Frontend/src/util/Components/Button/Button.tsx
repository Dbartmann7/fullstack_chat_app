import styles from "./Button.module.css"
import { type LucideIcon } from "lucide-react"

type ButtonProps  = {
    onClick:(...args:any[]) => void,
    className?:string
    Logo?:LucideIcon
    logoClassName?:string
    label?:string
}

const Button = ({onClick, className, Logo, logoClassName, label}:ButtonProps) => {


    return (
        <button onClick={onClick} className={`${styles.container} ${className}`}>
            {Logo && <Logo className={`${logoClassName}`}/>}
            {label}
        </button>
    )

}


export default Button