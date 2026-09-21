import { use } from "react"
import styles from "./LogOutBtn.module.css"
import { UserContext } from "@/Contexts/userContext"
import Button from "@/util/Components/Button"
import { LogOut as LogOutIcon } from "lucide-react"

const LogOutBtn = () => {
    const {logout} = use(UserContext)

    return (
        <Button 
            onClick={logout}
            Logo={LogOutIcon}
            className={`${styles.logOutIcon} red-outline-glow`}
        />
    )
}

export default LogOutBtn