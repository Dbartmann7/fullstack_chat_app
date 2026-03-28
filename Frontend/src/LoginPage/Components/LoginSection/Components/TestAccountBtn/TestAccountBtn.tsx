import { UserContext } from "@/Contexts/userContext"
import type { TestAccount } from "@/util/types"
import { use } from "react"

import styles from "./TestAccountBtn.module.css"


type TestAccountBtnProps = {
    testAccount:TestAccount
}

export const TestAccountBtn = ({testAccount}:TestAccountBtnProps) => {
    const {username, password, imgSrc} = testAccount
    const {login} = use(UserContext)

    return(
        <div className={`${styles.testBtnContainer} white-outline-glow`}>   
            <img
                className={styles.accImg}
                src={imgSrc}
            />     
            <button className={styles.testBtn} onClick={() => {login(username, password)}}/>
                  
        </div>
    )
}