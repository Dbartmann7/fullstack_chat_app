import { use, useRef, useState, type RefObject } from "react"
import styles from "./ChatInputBar.module.css"
import { Send } from "lucide-react"
import { SocketContext } from "@/Contexts/SocketContext"


type InputBarProps = {
    maxLength?:number
    isPassword?:boolean,
    onKeyDown?:any
    multiline?:boolean
}

export const InputBar = ({maxLength = 200000}:InputBarProps) => {
    let [value, setValue] = useState<string>("");
    let inputDivRef:RefObject<HTMLDivElement | null> = useRef(null)
    let {sendMessage} = use(SocketContext)
    
    const moveCaretToEnd = (el:HTMLElement) => {
        el.focus();
        let range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)

        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
    }


    const handleInput = (text:string) => {
        if(text.length <= maxLength){
            setValue(text)
        }else{
            inputDivRef.current!.innerText = value;
            moveCaretToEnd(inputDivRef.current!)
        }

    }

    const handleSend = () => {
        sendMessage(value)
    }

    return (
        <div className={styles.container}>
           
            <div 
                id="input"
                className={`${styles.input} `}
                contentEditable="plaintext-only"
                onInput={(e) => {handleInput(e.currentTarget.innerText)}} 
                ref={inputDivRef}
            >
            </div>
            <button className={`${styles.sendBtn}`} onClick={handleSend}>
                <Send className={`${styles.sendIcon}`} />
            </button>
        </div>
    )
}