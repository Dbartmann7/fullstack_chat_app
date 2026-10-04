import { Input } from "@/LoginPage/Components/Input"
import api from "@/util/api"
import { type UserData } from "@shared/types"
import { use, useState, type SetStateAction } from "react"
import styles from "./FindUser.module.css"
import { UserContext } from "@/Contexts/userContext"
import { ChatContext } from "@/Contexts/ChatContext"


const UserItem = ({data, onClick}:{data:UserData, onClick:(data:UserData) => void}) => {
    const handleClick = () => {
        onClick(data)
    }
    
    return (
        <div className={styles.userItem} onClick={handleClick}>
            <p>{data.username}</p>
        </div>
    )
}

type FindUserProps = {

}
const FindUserPage = ({}:FindUserProps) => {
    const [usernameToFind, setUsernameToFind] = useState<string>("")
    const [foundUsers, setFoundUsers] = useState<UserData[]>([])

    const {userData} = use(UserContext) 
    const {createChat} = use(ChatContext)

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

    const onUserClick = async (data:UserData) => {
        createChat(data, userData)
        
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
                        return <UserItem data={user} onClick={onUserClick}/>
                    })
                }
            </div>
        </div>
    )

}

export default FindUserPage