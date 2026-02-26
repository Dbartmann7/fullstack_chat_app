import { UserContext } from "@/Contexts/userContext"
import { use, useState } from "react"
import styles from "./LoginSection.module.css"
import { Input } from "../Input"

type LoginSectionProps = {

}

export const LoginSection = ({}:LoginSectionProps) => {
    
    const {isValidUsername, isValidPassword, login, signUp} = use(UserContext)
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

    const handleSignUp = async () => {
        if(!isValidUsername(username) || !isValidPassword(password)){
            console.log("invalid username or password")
        }else{
            try{
                
                await signUp(username, password);
                await login(username, password)
                
            }catch(err){
                console.log(`Sign up error: ${err}`)
            }
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
                    type="password"
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
                <button className={styles.btn} onClick={handleSignUp}>
                    Sign Up
                </button>
            </div>
        </section>
    )
}