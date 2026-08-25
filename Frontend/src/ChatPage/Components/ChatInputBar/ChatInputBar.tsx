import { useEffect, useRef, useState, type RefObject } from "react"
import styles from "./ChatInputBar.module.css"
import { Send } from "lucide-react"

type InputBarProps = {
    value:string,
    setValue:any,
    maxLength?:number
    isPassword?:boolean,
    onKeyDown?:any
    multiline?:boolean
}

export const InputBar = ({ value, setValue, maxLength = 200000}:InputBarProps) => {
    let [textContent, setTextContent] = useState<string>("");
    let inputDivRef:RefObject<HTMLDivElement | null> = useRef(null)

   
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
            <button className={`${styles.sendBtn}`}>
                <Send className={`${styles.sendIcon}`} />
            </button>
        </div>
    )
}