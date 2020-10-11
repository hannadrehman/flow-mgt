import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader } from 'antd'
import { staticData } from '../../Cases.fixtures'
import Choices from './Choices.component'
import Success from './Success.component'
import AddonTable from './AddonTable.component'

const { Text } = Typography

const Wrapper = styled.div`
    margin: 0 auto;
`
const QuestionText = styled(Text)`
    font-size: 24px;
`
const Header = styled.div`
    border-bottom: 1px solid #eadddd;
`

const Main = styled.div`
    display: flex;
    height: calc(100vh - 100px);
`
export const Question = styled.div`
    padding: 16px;
    width: 50%;
    min-width: 50%;
    height: 100%;
    border-right: 1px solid #e1dddd;
    background: #f9f9f9;
    display: flex;
    align-content: center;
    align-items: center;
`
export const Options = styled.div`
    padding: 16px;
    width: 50%;
    min-width: 50%;
    height: 100%;
`
export const NextButton = styled(Button)`
    &&& {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
    }
`
export default function HomePage() {
    const { push } = useHistory()
    const { id } = useParams()
    const [currentQuestion, setCurrentQuestion] = React.useState(null)
    const [isNextDisabled, setIsNextDisabled] = React.useState(true)
    const allSelectedOptions = React.useRef([])
    const selectedOption = React.useRef({})
    const [currentSelectedIndex, setCurrentSelectedIndex] = React.useState(null)
    const allQuestionsRef = React.useRef({})
    const [addonTable, setAddonTable] = React.useState({})
    const inputRef = React.useRef()
    const [inputAnswer, setInputAnswer] = React.useState('')

    React.useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(
                    'https://raw.githubusercontent.com/hannadrehman/flow-mgt/master/src/questions.json',
                    {}
                )
                const json = await res.json()
                allQuestionsRef.current = json
                const currentQ = json['SlideDrugQ1_0']
                // const currentQ = json['SlideDrugQ1_100a']
                setCurrentQuestion(currentQ)
                if (json[currentQ.addOnTable]) {
                    setAddonTable(json[currentQ.addOnTable])
                }
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [])
    
    function handleBack(id) {
        push(`/list`)
    }
    function onOptionChange(e) {
        const option = currentQuestion.choices[e.target.value]
        setCurrentSelectedIndex(e.target.value)
        selectedOption.current = option
        setIsNextDisabled(false)
    }
    function goNext() {
        let nextQuestion = {}
        if (!currentQuestion.choices || currentQuestion.choices.length === 0) {
            nextQuestion = allQuestionsRef.current[currentQuestion.links_to]
        } else {
            nextQuestion =
                allQuestionsRef.current[selectedOption.current.links_to]
        }
        if (nextQuestion === undefined) {
            console.log('--------------------------------------------------')
            console.log(currentQuestion)
            console.log(allQuestionsRef.current[currentQuestion.links_to])
            console.log(selectedOption.current)
            console.log('--------------------------------------------------')
            return
        }
        setCurrentQuestion(nextQuestion)
        allSelectedOptions.current.push(selectedOption.current)
        if (nextQuestion.choices && nextQuestion.choices.length) {
            setIsNextDisabled(true)
        }
        const tbl = allQuestionsRef.current[nextQuestion.addOnTable]
        if (tbl) {
            setAddonTable(tbl)
            if (tbl.expectInput) {
                setIsNextDisabled(true)
            }
        }
        setCurrentSelectedIndex(null)
        setInputAnswer(null)
        selectedOption.current = null
        if (tbl) {
            selectedOption.current = tbl
        }
    }
    const item = staticData.find((e) => e.id.toString() === id)
    if (currentQuestion == null) {
        return null
    }

    function handleChange(ev) {
        const value = ev.target.value
        inputRef.current = value
    }
    function submitInput() {
        const value = parseInt(inputRef.current, 10)
        if (value === addonTable.correctAnswer) {
            setInputAnswer(addonTable.messageDescription)
        }
        if (value > addonTable.correctAnswer) {
            setInputAnswer(addonTable.messageDescriptionHigh)
        }
        if (value < addonTable.correctAnswer) {
            setInputAnswer(addonTable.messageDescriptionLow)
        }
        setIsNextDisabled(false)
    }

    const filteredScoresList = allSelectedOptions.current
        .filter((x) => x.score)
        .map((x) => x.score)

    const groupedScore = filteredScoresList.reduce(
        (accum, item) => {
            accum.judgment = accum.judgment + item.judgment
            accum.rigor = accum.rigor + item.rigor
            accum.structuring = accum.structuring + item.structuring
            accum.synthesis = accum.synthesis + item.synthesis
            return accum
        },
        { judgment: 0, rigor: 0, structuring: 0, synthesis: 0 }
    )

    return (
        <Wrapper>
            <Header>
                <PageHeader subTitle={item.title} onBack={handleBack} />
            </Header>
            {currentQuestion.successMessage && (
                <Success
                    currentQuestion={currentQuestion}
                    groupedScore={groupedScore}
                />
            )}
            {!currentQuestion.successMessage && (
                <>
                    <TransitionGroup>
                        <CSSTransition
                            key={currentQuestion.question}
                            classNames="slide"
                            timeout={{ enter: 300, exit: 300 }}
                        >
                            <Main>
                                <Question>
                                    <QuestionText>
                                        {currentQuestion.question}
                                    </QuestionText>
                                </Question>

                                <Options>
                                    <Choices
                                        questionId={currentQuestion.question}
                                        onOptionChange={onOptionChange}
                                        currentSelectedIndex={
                                            currentSelectedIndex
                                        }
                                        choices={currentQuestion.choices}
                                    />
                                    {currentQuestion.addOnTable && (
                                        <AddonTable
                                            addonTable={addonTable}
                                            inputAnswer={inputAnswer}
                                            handleChange={handleChange}
                                            submitInput={submitInput}
                                        />
                                    )}
                                </Options>
                            </Main>
                        </CSSTransition>
                    </TransitionGroup>
                    <NextButton
                        type="primary"
                        disabled={isNextDisabled}
                        block
                        onClick={goNext}
                        size="large"
                    >
                        Next
                    </NextButton>
                </>
            )}
        </Wrapper>
    )
}
