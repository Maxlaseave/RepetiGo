import { useState, useEffect } from "react"
import ProgressBar from "../ProgressBar"
import { isEncountered, shuffle } from "../../utils"
import DEFINITIONS from '../../utils/French.json'

export default function Challenge(props) {
    const { day, daysWords, handleChangePage, handleIncrementAttempts, handleCompleteDay, PLAN } = props

    const [wordIndex, setWordIndex] = useState(0)
    const [inputVal, setInputVal] = useState('')
    const [showDefinition, setShowDefinition] = useState(false)
    const [mode, setMode] = useState('toDefinition')

    const introLength = daysWords.length

    const [listToLearn, setListToLearn] = useState([
        ...daysWords,
        ...shuffle(daysWords),
        ...shuffle(daysWords),
        ...shuffle(daysWords),
    ])

    const word = listToLearn[wordIndex]
    const definition = DEFINITIONS[word]

    const isIntroPhase = wordIndex < introLength
    const isNewWord = showDefinition || (!isEncountered(day, word) && isIntroPhase)

    // Set challenge mode only during practice phase
    useEffect(() => {
        if (!isIntroPhase) {
            const newMode = Math.random() < 0.5 ? 'toDefinition' : 'toWord'
            setMode(newMode)
        }
    }, [wordIndex])

    // Determine what to show and what to expect as an answer
    const prompt = isIntroPhase || mode === 'toDefinition' ? word : definition
    const expectedAnswer = isIntroPhase || mode === 'toDefinition' ? definition : word

    function handleInputChange(e) {
        const val = e.target.value

        // only check correctness once user reaches expected length
        if (val.length === expectedAnswer.length && val.length > inputVal.length) {
            handleIncrementAttempts()

            if (val.toLowerCase() === expectedAnswer.toLowerCase()) {
                if (wordIndex >= listToLearn.length - 1) {
                    handleCompleteDay()
                    return
                }

                setWordIndex(prev => prev + 1)
                setShowDefinition(false)
                setInputVal('')
                return
            }
        }

        setInputVal(val)
    }

    function giveUp() {
        setListToLearn(prev => [...prev, word])
        setShowDefinition(true)
    }

    return (
        <section id="challenge">
            <h2>{isIntroPhase ? "Learn This Word" : "Challenge Yourself"}</h2>

            <h1>{prompt}</h1>

          
            {isIntroPhase && <p className="definition">{definition}</p>}

          
           {showDefinition && !isIntroPhase && (
                <p className="definition">{expectedAnswer}</p>
            )}
            <div className="helper">
                <div>
                    {[...Array(expectedAnswer.length).keys()].map((char, i) => {
                        const styleToApply =
                            inputVal.length <= i
                                ? ''
                                : inputVal[i]?.toLowerCase() === expectedAnswer[i]?.toLowerCase()
                                    ? 'correct'
                                    : 'incorrect'

                        return <div className={styleToApply} key={i}></div>
                    })}
                </div>

                <input
                    value={inputVal}
                    onChange={handleInputChange}
                    type="text"
                    placeholder={
                        isIntroPhase
                            ? "Type the definition (it's shown above)..."
                            : mode === 'toDefinition'
                                ? "Enter the definition..."
                                : "Enter the French word..."
                    }
                />
            </div>

            <div className="challenge-btns">
                <button onClick={() => handleChangePage(1)} className="card-button-secondary">
                    <h6>Quit</h6>
                </button>
                {!isIntroPhase && (
                    <button onClick={giveUp} className="card-button-primary">
                        <h6>I forgot</h6>
                    </button>
                )}
            </div>

            <ProgressBar
                remainder={(wordIndex * 100) / listToLearn.length}
                text={`${wordIndex} / ${listToLearn.length}`}
            />
        </section>
    )
}
