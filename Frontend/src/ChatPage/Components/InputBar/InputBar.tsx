import { useEffect, useRef, useState, type RefObject } from "react"
import styles from "./InputBar.module.css"

type InputBarProps = {
    value:string,
    setValue:any,
    maxLength?:number
    isPassword?:boolean,
    onKeyDown?:any
    multiline?:boolean
}

export const InputBar = ({ value, setValue, maxLength = 1000, isPassword = false, onKeyDown, multiline=false}:InputBarProps) => {
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


    const handleInput = (value:string) => {
        if(value.length <= maxLength){
            setTextContent(value)
        }else{
            inputDivRef.current!.innerText = textContent;
            moveCaretToEnd(inputDivRef.current!)
        }

    }

    return (
        <div className={styles.container}>
            { isPassword ? 
                <input
                    id="input"
                    type="password"
                    className={`${styles.passwordInput}`}
                    value={textContent}
                    onChange={(e) => {handleInput(e.target.value)}}
                    onKeyDown={(e) => {onKeyDown(e.key)}}
                />
                :
                <div 
                    id="input"
                    className={`${styles.input} `}
                    contentEditable="plaintext-only"
                    onInput={(e) => {handleInput(e.currentTarget.innerText)}}
                    onKeyDown={(e) => {onKeyDown(e.key)}}
                    
                    ref={inputDivRef}
                >
                </div>
            }
        </div>
    )
}