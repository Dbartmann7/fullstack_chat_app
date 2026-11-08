import Cookies from 'js-cookie'

import { UserContext } from "@/Contexts/userContext"
import { use, useState } from "react"
import styles from "./LoginSection.module.css"
import { Input } from "../Input"
import { TestAccountBtn } from "./Components/TestAccountBtn"
import type { TestAccount } from "@/util/types"
import tonyPic from "@/assets/TestProfPics/Tony.jpg"
import christopherPic from "@/assets/TestProfPics/Christopher.jpg"
import spongebobPic from "@/assets/TestProfPics/spongebob.webp"
import patrickPic from "@/assets/TestProfPics/Patrick.jpg"
import walterPic from "@/assets/TestProfPics/walter.jpeg"
import jessePic from "@/assets/TestProfPics/jesse.webp"
import Markdown from "react-markdown"
import privacyNotice from "./privacy_notice.md?raw"
type LoginSectionProps = {

}

const testAccounts:TestAccount[] = [
    {
        username: "TonySoprano",
        password: "Test123456789",
        imgSrc:tonyPic
    },
    {
        username:"Christopher",
        password:"Test123456789",
        imgSrc:christopherPic
    },
    {
        username: "Spongebob",
        password: "Test123456789",
        imgSrc:spongebobPic
    },
    {
        username:"Patrick",
        password:"Test123456789",
        imgSrc:patrickPic
    },
    {
        username: "WalterWhite",
        password: "Test123456789",
        imgSrc:walterPic
    },
    {
        username:"JessePinkman",
        password:"Test123456789",
        imgSrc:jessePic
    }
]

export const LoginSection = ({}:LoginSectionProps) => {
    
    const {login, signUp} = use(UserContext)
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [showPrivacyPopUp, setShowPrivacyPopUp] = useState<boolean>(() => {
        return Cookies.get('isPrivacyAccepted') !== 'true'
    })


    const handleLogin = async () => {
     
        const res = await login(username, password)
        if(!res.ok){
            setError(res.error)
            setUsername("")
            setPassword("")
        } 
    }

    const handleSignUp = async () => {
        let signUpRes = await signUp(username, password);
        console.log(signUpRes)
        if(!signUpRes.ok){
            setError(signUpRes.error)
            return
        }
        let loginRes = await login(username, password)
        if(!loginRes.ok){
            setError(loginRes.message)
            return
        }        
    }

    const acknowledgePrivacyPopUp = () => {
        Cookies.set("isPrivacyAccepted", 'true', {
            path:'/',
            sameSite:"Lax",
        })
        setShowPrivacyPopUp(false)

    }

    return(
        <section className={styles.loginSection}>
            <div className={styles.topHalf}>
                <h1 className={styles.title}>Login</h1>
                {error}
                <p className={styles.disclaimer}>
                    This is a demo - Do not use real usernames or passwords 
                </p>
                <div className={styles.inputsContainer}>
                    <Input 
                        value={username}
                        setValue={setUsername}
                        maxLength={20}
                        placeholder="Username..."
                        submitFn={handleLogin}
                    />
                    <Input
                        type="password"
                        value={password}
                        setValue={setPassword}
                        maxLength={32}
                        placeholder="Password..."
                        submitFn={handleLogin}
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
                <button className={styles.popUpBtn} onClick={() => setShowPrivacyPopUp(true)}>How data is stored</button>
            </div>
            <div className={styles.testAccounts}>
                {
                    testAccounts.map(acc => {
                        return <TestAccountBtn testAccount={acc}/>
                    })
                }
            </div>
            { showPrivacyPopUp && 
                <div className={styles.privacyPopUp}>
                    <Markdown>
                        {privacyNotice}
                    </Markdown>
                    <button className={styles.btn} onClick={acknowledgePrivacyPopUp}>Okay</button>
                </div>
            }
        </section>
    )
}