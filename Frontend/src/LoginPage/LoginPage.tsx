import { useEffect} from "react"
import styles from "./LoginPage.module.css"
import { socket } from "@/util/Socket/socket"
import type { UserData } from "@custom-types/types"
import { LoginSection } from "./Components/LoginSection"
import { SendMessageBtn } from "@/util/sendMessageBtn"

export const LoginPage = () => {
    

    useEffect(() => {
        socket.on("test", (res:UserData) => {
            console.log(res)
        })
    }, [])



    return(
        <div className={styles.page}>
            <main className={styles.main}>
                <LoginSection/>
                <SendMessageBtn/>
                {/* <br/>
                <div id="test" className={`${styles.testTest} chat-bar white-outline-glow`}>
                </div> */}
            </main>
        </div>
    )

}