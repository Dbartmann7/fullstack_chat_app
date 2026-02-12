import { UserContext } from "@/Contexts/userContext"
import { use, useState } from "react"
import styles from "./LoginSection.module.css"
import { Input } from "../Input"

type LoginSectionProps = {

}

export const LoginSection = ({}:LoginSectionProps) => {
    
    const {login} = use(UserContext)
    const [isError, setIsError] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    const handleLogin = async () => {
        let res = await login(username, password)
        if(res.status === 401){
            setUsername("")
            setPassword("")
            setIsError(true)
        }
    }

    return(
        <section className={styles.loginSection}>
            <h1 className={styles.title}>Login</h1>
            {isError ? "Error": null}
            <div className={styles.inputsContainer}>
                <Input 
                    value={username}
                    setValue={setUsername}
                    maxLength={20}
                    placeholder="Username..."
                />
                <Input 
                    value={password}
                    setValue={setPassword}
                    maxLength={32}
                    placeholder="Password..."
                />
            </div>
            <div className={styles.btns}>
                <button className={styles.btn} onClick={handleLogin}>
                    Login
                </button>
                <button className={styles.btn} onClick={handleLogin}>
                    Sign Up
                </button>
            </div>
        </section>
    )
}