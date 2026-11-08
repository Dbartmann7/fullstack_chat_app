import { use, useRef, useState, type KeyboardEvent, type RefObject } from "react"
import styles from "./ChatInputBar.module.css"
import { Send } from "lucide-react"
import { ChatContext } from "@/Contexts/ChatContext"


type InputBarProps = {
    maxLength?: number
}

export const InputBar = ({ maxLength = 200000 }: InputBarProps) => {
    const [value, setValue] = useState<string>("")
    const inputDivRef: RefObject<HTMLDivElement | null> = useRef(null)
    const { sendMessage } = use(ChatContext)

    const moveCaretToEnd = (el: HTMLElement) => {
        el.focus()
        const range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)

        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
    }

    const handleInput = (text: string) => {
        if (text.length <= maxLength) {
            setValue(text)
        } else {
            inputDivRef.current!.innerText = value
            moveCaretToEnd(inputDivRef.current!)
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            sendMessage(value)
        }
    }

    const handleSend = () => {
        sendMessage(value)
    }

    return (
        <div className={styles.container}>
            <div
                id="input"
                className={styles.input}
                contentEditable="plaintext-only"
                onInput={(e) => {
                    e.preventDefault()
                    handleInput(e.currentTarget.innerText)
                }}
                ref={inputDivRef}
                onKeyDown={handleKeyDown}
            />
            <button className={styles.sendBtn} onClick={handleSend}>
                <Send className={styles.sendIcon} />
            </button>
        </div>
    )
}
