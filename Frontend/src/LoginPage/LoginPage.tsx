
import styles from "./LoginPage.module.css"

import { LoginSection } from "./Components/LoginSection"

export const LoginPage = () => {
    

    return(
        <div className={styles.page}>
            <main className={styles.main}>
                <LoginSection/>
            </main>
        </div>
    )

}