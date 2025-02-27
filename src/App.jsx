import { useState } from 'react'
import { languages } from './languages'
import { randomWord } from './utils'
import Confetti from "react-confetti"
import clsx from 'clsx'

function App() {

      const [currentWord, setCurrentWord] = useState(() => randomWord())
      const [guessedLetters, setGuessedLetters] = useState([])
      const numGuessesLeft = languages.length - 1;
      const wrongGuessedCount = guessedLetters.filter(letter => !currentWord.word.includes(letter)).length
      const isGameWon = currentWord.word.split("").every(letter => guessedLetters.includes(letter))
      const isGameLost = wrongGuessedCount >= numGuessesLeft
      const isGameOver = isGameWon || isGameLost
      const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
      const lastGuessedIncorrect = lastGuessedLetter && !currentWord.word.includes(lastGuessedLetter)

      const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
      

    function addGuesedLetter(letter) {
      setGuessedLetters(prevLetters => {
        const letterSet = new Set(guessedLetters)
        letterSet.add(letter)
        return [...letterSet]
      }
      )}


      const keyboardElement = alphabet.split('').map((letter, index) => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.word.includes(letter)
        const isWrong = isGuessed && !currentWord.word.includes(letter)
    
        return (
          <button onClick={() => addGuesedLetter(letter)} key={index} 
          className={clsx('key', { enabled: isCorrect, disabled: isWrong })}>
            {letter.toLocaleUpperCase()}
          </button>
        )
      }
      )

      
      const wordElement = currentWord.word.split('').map((letter, index) => {
        const revealedLetters = isGameLost || guessedLetters.includes(letter)
        const revealStyle = clsx(isGameLost && !guessedLetters.includes(letter) && "missing-letters")
        return (
          <span key={index} className={revealStyle}>
            {(revealedLetters ? letter.toLocaleUpperCase() : "🔑")}
          </span>
        )
      }
      )

  const languageElement = languages.map((language, index) => {
      const isLost = index < wrongGuessedCount
    const styles = {
      backgroundColor: language.backgroundColor,
      color: language.color,
    }
    return (
      <span key={language.name} className={clsx("lang",{lost: isLost})} style={styles}>
        {language.name.toLocaleUpperCase()}
      </span>
    )
  })

  function renderGameStatus() {
    if (!isGameOver && lastGuessedIncorrect) {
      return (
        <>
        <marquee behavior="" direction="left">
        <p className='farwell-message'>{languages[wrongGuessedCount - 1].farewell}</p>
        </marquee>
        </>
      )
  } 
  if (isGameWon) {
    return (
      <> 
          <h2>Вы выиграли!</h2>
          <p>Отличная работа! 🏆</p>
        </>
    )
  } else if (isGameLost) {
    return (
      <>
      <h2>Игра окончена!</h2>
      <p>Цвета угасли! Попробуйте разгадать тайны заново.😭</p>
    </>
    )
  } else {
    return null
  }
}
const opacityStyle = clsx({opacity: isGameWon})

function resetGame() {
  setGuessedLetters([])
  setCurrentWord(randomWord())
}
  return (
    <>
      <header className={opacityStyle}>
        <h1>Палитра: Искры разума</h1>
        <p>Найдите слово за 8 попыток, чтобы сохранить краски мира!</p>
      </header>
        <section className='clue-container'>
          <small>Подсказка для слова:</small>
        <p>{currentWord.clue}</p>
        </section>
      <section className={clsx("status-section",{
        won: isGameWon,
        lose: isGameLost,
        farewell: !isGameOver && lastGuessedIncorrect
      })}>
        {renderGameStatus()}
      </section> 
      <section className='lang-section'>
        {isGameWon && <Confetti
          recycle={true}
          numberOfPieces={100}
          gravity={0.04}
        />}
        {languageElement}
      </section>
      <section className='word-section'>
        {wordElement}
      </section>

{/* Визуально скрытая область для aria-level */}
      <section  
               className="sr-only" 
               aria-live="polite" 
               role="status"
           >
               <p>
                   {currentWord.word.includes(lastGuessedLetter) ? 
                       `Правильно! Буква ${lastGuessedLetter} есть в слове.` : 
                       `Извините, буквы ${lastGuessedLetter} нет в слове.`
                   }
                   У вас осталось {numGuessesLeft} попыток.
               </p>
               <p>Текущее слово: {currentWord.word.split("").map(letter => 
               guessedLetters.includes(letter) ? letter + "." : "пусто.")
               .join(" ")}</p>
            </section>

      <section className={clsx('keyboard-section', {keysDisable: isGameOver})}>
        {keyboardElement}
      </section>
      {isGameOver && <button onClick={() => resetGame()} className='new-game'>Новая игра</button>}
    </>
  )
}

export default App
