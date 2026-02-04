import { useSocketHandler } from "./Socket/useSocketHandler"


export const SendMessageBtn = () => {
    const {sendMessage} = useSocketHandler()


    return(
        <button onClick={e => sendMessage("testtesttest")}>
            send message
        </button>
    )
}