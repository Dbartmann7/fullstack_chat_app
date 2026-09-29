import Button from "@/util/Components/Button"
import { UserPlus } from "lucide-react"
type FindUserBtnProps = {

}

const FindUserBtn = ({}:FindUserBtnProps) => {

    

    return (
        <Button onClick={function (...args: any[]): void {
            throw new Error("Function not implemented.")
        }} Logo={UserPlus}/>
    )

}

export default FindUserBtn