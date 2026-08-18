import { UserContext } from "@/Contexts/userContext"
import { use, useState } from "react"
import styles from "./LoginSection.module.css"
import { Input } from "../Input"
import { TestAccountBtn } from "./Components/TestAccountBtn"
import type { TestAccount } from "@/util/types"
import tonyPic from "@/assets/TestProfPics/Tony.jpg"
import christopherPic from "@/assets/TestProfPics/Christopher.jpg"
type LoginSectionProps = {

}

const testAccounts:TestAccount[] = [
    {
        username: "Tony S",
        password: "Test1",
        imgSrc:tonyPic
    },
    {
        username:"Christopher",
        password:"Test1",
        imgSrc:christopherPic
    },
    {
        username: "Tony S",
        password: "Test1",
        imgSrc:tonyPic
    },
    {
        username:"Christopher",
        password:"Test1",
        imgSrc:christopherPic
    },
    {
        username: "Tony S",
        password: "Test1",
        imgSrc:tonyPic
    },
    {
        username:"Christopher",
        password:"Test1",
        imgSrc:christopherPic
    }
]

export const LoginSection = ({}:LoginSectionProps) => {
    
    const {isValidUsername, isValidPassword, login, signUp} = use(UserContext)
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    const handleLogin = async () => {
        let res = await login(username, password)
        if(res.status === 401){
            setUsername("")
            setPassword("")
            setError("problem with login")
        }
    }

    const handleSignUp = async () => {
        if(!isValidUsername(username) || !isValidPassword(password)){
            setError("invalid username or password")
            return
        }

        try{
            await signUp(username, password);
            await login(username, password)
                
        }catch(err){
            setError(`Sign up error: ${err}`)
        }
        
    }

    return(
        <section className={styles.loginSection}>
            <div className={styles.topHalf}>
                <h1 className={styles.title}>Login</h1>
                {error}
            
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
            </div>
            
            
            <div className={styles.testAccounts}>
                {
                    testAccounts.map(acc => {
                        return <TestAccountBtn testAccount={acc}/>
                    })
                }
            </div>
        </section>
    )
}