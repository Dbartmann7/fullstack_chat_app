import { Input } from "@/LoginPage/Components/Input"
import { useState, type SetStateAction } from "react"

type FindUserProps = {

}

const FindUserPage = ({}:FindUserProps) => {
    const [usernameToFind, setUsernameToFind] = useState<string>("")
    const submitFn = () => {
        console.log(usernameToFind)
    }
    return (
        <div>
            <Input 
                value={usernameToFind} 
                setValue={setUsernameToFind} 
                placeholder="Find User..."
                submitFn={submitFn}
            />
        </div>
    )

}

export default FindUserPage