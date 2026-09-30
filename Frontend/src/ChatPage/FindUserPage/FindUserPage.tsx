import { Input } from "@/LoginPage/Components/Input"
import api from "@/util/api"
import { type UserData } from "@shared/types"
import { useState, type SetStateAction } from "react"
import styles from "./FindUser.module.css"


const UserItem = ({data}:{data:UserData}) => {
    return (
        <div className={styles.userItem}>
            <p>{data.username}</p>
        </div>
    )
}

type FindUserProps = {

}
const FindUserPage = ({}:FindUserProps) => {
    const [usernameToFind, setUsernameToFind] = useState<string>("")
    const [foundUsers, setFoundUsers] = useState<UserData[]>([])
    const submitFn = async () => {
        const users = await api.get("/api/user/", 
            {
                params:{
                    username:usernameToFind
                },
                withCredentials:true
            }, 
        )
        setFoundUsers(users.data.body)
    }
    return (
        <div>
            <Input 
                value={usernameToFind} 
                setValue={setUsernameToFind} 
                placeholder="Find User..."
                submitFn={submitFn}
            />
            <div>
                {
                    foundUsers.map((user) => {
                        return <UserItem data={user}/>
                    })
                }
            </div>
        </div>
    )

}

export default FindUserPage