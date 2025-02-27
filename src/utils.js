import {wordsObj} from "./word-clue.js"

export function randomWord() {
    const randomIndex = Math.floor(Math.random()*wordsObj.length)
    return wordsObj[randomIndex]
}
