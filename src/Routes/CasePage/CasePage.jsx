import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Typography, Button, PageHeader, Popconfirm } from 'antd'
import { staticData } from '../../Cases.fixtures'
import Choices from './Choices.component'
import Success from './Success.component'
import AddonTable from './AddonTable.component'
import Bullets from './Bullets.component'
import * as utils from './utilities'
import HelpModal from '../HelpModal/HelpModal.component';

const { Text, Title } = Typography

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

export const QuestionB = styled.div`
    padding: 16px;
    width: 50%;
    min-width: 50%;
    height: 100%;
    border-right: 1px solid #e1dddd;
    background: #f9f9f9;
    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
`
export const Options = styled.div`
    padding: 16px;
    width: 50%;
    min-width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
export const NextButton = styled(Button)`
    &&& {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
    }
`
export const Image = styled.img`
    width: 100%;
    padding-bottom: 16px;
`
const Body = styled.div`
    margin-top: 48px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 1px solid green;
    border-radius: 80px;
    padding: 48px;
`
const Intro = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 80vh;
`
const HeaderText = styled(Title)`
    &&& {
        color: green;
  `
const IntoText = styled(Text)`
  &&& {
      margin-top:30px;
      font-weight:500;
      font-size: 20px;
`

export default function HomePage() {
    const { push } = useHistory()
    const { id, qID = null } = useParams()
    const [currentQuestion, setCurrentQuestion] = React.useState(null)
    const [isNextDisabled, setIsNextDisabled] = React.useState(true)
    const allSelectedOptions = React.useRef([])
    const selectedOption = React.useRef({})
    const [currentSelectedIndex, setCurrentSelectedIndex] = React.useState(null)
    const allQuestionsRef = React.useRef({})
    const [addonTable, setAddonTable] = React.useState({})
    const inputRef = React.useRef()
    const [inputAnswer, setInputAnswer] = React.useState('')
    const globalFlags = React.useRef({
        revenue_path_flag: false,
        cost_path_flag: false,
        non_ticket_revenue_path_flag: false,
        ticket_revenue_path_flag: false,
    })
    const userInputCorrectAnswerRef = React.useRef(null)
    const [optionFeedback, setOptionFeedback] = React.useState(null)
    const [maxScores, setMaxScore] = React.useState({})

    React.useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(
                    `https://raw.githubusercontent.com/hannadrehman/flow-mgt/master/src/questions-${id}.json`,
                    {}
                )
                const resp = await res.json()
                const json = utils.transformRes(resp)
                setMaxScore(utils.getMaxScores(json, id))
                allQuestionsRef.current = json
                let initialQuestion = qID
                if (!initialQuestion) {
                    initialQuestion =
                        id === '1'
                            ? 'SlideDrugInterviewer'
                            : 'SlideAirlineInterviewer' //'SlideAirlineQ1_0'
                }
                const currentQ = json[initialQuestion]
                setCurrentQuestion(currentQ)

                if (json[currentQ.addOnTable]) {
                    setAddonTable(json[currentQ.addOnTable])
                }
                if (
                    !currentQ.choices ||
                    currentQ.choices.length === 0 ||
                    currentQ.expectInput === false
                ) {
                    setIsNextDisabled(false)
                }
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [id, qID])

    function handleBack(id) {
        push(`/list`)
    }
    function onOptionChange(e) {
        const option = currentQuestion.choices[e.target.value]
        option.questionId = currentQuestion.questionId
        option.optionIndex = e.target.value
        setCurrentSelectedIndex(e.target.value)
        selectedOption.current = option
        setIsNextDisabled(false)
        if (currentQuestion.show_feedback) {
            if (option.isCorrect) {
                setOptionFeedback(currentQuestion.feedback_success)
            } else {
                setOptionFeedback(currentQuestion.feedback_failure)
            }
        }
    }
    function goNext() {
        let nextQuestion = {}
        if (!currentQuestion.choices || currentQuestion.choices.length === 0) {
            nextQuestion =
                allQuestionsRef.current[
                    utils.getNextLink(currentQuestion, globalFlags)
                ]
        } else {
            nextQuestion =
                allQuestionsRef.current[
                    utils.getNextLink(selectedOption.current, globalFlags)
                ]
        }

        if (nextQuestion === undefined) {
            console.log('--------------------------------------------------')
            console.log(currentQuestion)
            console.log(
                allQuestionsRef.current[
                    utils.getNextLink(currentQuestion, globalFlags)
                ]
            )
            console.log(selectedOption.current)
            console.log('--------------------------------------------------')
            return
        }
        if (selectedOption.current) {
            allSelectedOptions.current.push(selectedOption.current)
        }

        if (nextQuestion.choices && nextQuestion.choices.length) {
            setIsNextDisabled(true)
        }
        if(currentQuestion.bulletData && currentQuestion.expectInput && userInputCorrectAnswerRef.current){
            allSelectedOptions.current.push(currentQuestion)
        }

        if(currentQuestion.addOnTable){
            if (userInputCorrectAnswerRef.current && addonTable.expectInput) {
                allSelectedOptions.current.push(addonTable)
            }
        }

        const tbl = allQuestionsRef.current[nextQuestion.addOnTable]
        setAddonTable(tbl)
        if (tbl && tbl.expectInput) {
            setIsNextDisabled(true)
        }
      
        if (nextQuestion.expectInput) {
            setIsNextDisabled(true)
        }
        setCurrentQuestion(nextQuestion)
        utils.setFlags(nextQuestion, globalFlags)
        setCurrentSelectedIndex(null)
        setInputAnswer(null)
        selectedOption.current = null
        // if (tbl) {
        //     selectedOption.current = tbl
        // }
        setOptionFeedback(null)
        userInputCorrectAnswerRef.current = null
    }
    const item = staticData.find((e) => e.id.toString() === id)

    function handleChange(ev) {
        const value = ev.target.value
        inputRef.current = value
    }
    function submitInput() {
        const value = Number(inputRef.current)
        const hasTable = Object.keys(addonTable || {}).length > 0
        if (hasTable) {
            if (value === addonTable.correctAnswer) {
                setInputAnswer(addonTable.messageDescription)
                userInputCorrectAnswerRef.current = true
            }
            if (value > addonTable.correctAnswer) {
                setInputAnswer(addonTable.messageDescriptionHigh)
            }
            if (value < addonTable.correctAnswer) {
                setInputAnswer(addonTable.messageDescriptionLow)
            }
            setIsNextDisabled(false)
            return
        }
        if (currentQuestion.bulletData) {
            if (value === currentQuestion.correctAnswer) {
                setInputAnswer(currentQuestion.messageDescription)
                userInputCorrectAnswerRef.current = true
            }
            if (value > currentQuestion.correctAnswer) {
                setInputAnswer(currentQuestion.messageDescriptionHigh)
            }
            if (value < currentQuestion.correctAnswer) {
                setInputAnswer(currentQuestion.messageDescriptionLow)
            }
            setIsNextDisabled(false)
            return
        }
    }

    const groupedScore = utils.getGroupedScore(allSelectedOptions.current)
    if (currentQuestion == null) {
        return null
    }

    return (
        <Wrapper>
            <Header>
                <PageHeader
                    backIcon={
                        <Popconfirm
                            title="Are you sure you want to exit this case ?"
                            onConfirm={handleBack}
                            okText="Yes"
                            cancelText="No"
                        >
                            <ArrowLeftOutlined />
                        </Popconfirm>
                    }
                    subTitle="Exit Case"
                    onBack={() => {}}
                />
            </Header>
            {currentQuestion.successMessage && (
                <Success
                    currentQuestion={currentQuestion}
                    usersScore={groupedScore}
                    maxScore={maxScores}
                    caseDetails={item}
                    selectedOptions={allSelectedOptions.current || {}}
                    allQuestions={allQuestionsRef.current}
                />
            )}
            {!currentQuestion.successMessage && currentQuestion.intro && (
                <Intro>
                    <Body>
                        <HeaderText level={1}>
                            {currentQuestion.question.headerText}
                        </HeaderText>
                        <br />
                        <IntoText>
                            {currentQuestion.question.titleText}
                        </IntoText>
                    </Body>
                    <NextButton
                        type="primary"
                        disabled={isNextDisabled}
                        block
                        onClick={goNext}
                        size="large"
                    >
                        Next
                    </NextButton>
                </Intro>
            )}

            {!currentQuestion.successMessage && !currentQuestion.intro && (
                <>
                    <TransitionGroup>
                        <CSSTransition
                            key={currentQuestion.question}
                            classNames="slide"
                            timeout={{ enter: 300, exit: 300 }}
                        >
                            <Main>
                                {!currentQuestion.image && (
                                    <Question>
                                        <QuestionText>
                                            {currentQuestion.question}
                                        </QuestionText>
                                    </Question>
                                )}
                                {currentQuestion.image && (
                                    <QuestionB>
                                        <QuestionText>
                                            {currentQuestion.question}
                                        </QuestionText>
                                        <div>
                                            <Image
                                                src={currentQuestion.image}
                                            />
                                        </div>
                                    </QuestionB>
                                )}
                                <Options>
                                    {currentQuestion.addOnTable && (
                                        <div>
                                            <AddonTable
                                                addonTable={addonTable}
                                                inputAnswer={inputAnswer}
                                                handleChange={handleChange}
                                                submitInput={submitInput}
                                            />
                                            <br />
                                        </div>
                                    )}
                                    {currentQuestion.bulletData && (
                                        <div>
                                            <Bullets
                                                question={currentQuestion}
                                                inputAnswer={inputAnswer}
                                                handleChange={handleChange}
                                                submitInput={submitInput}
                                            />
                                        </div>
                                    )}
                                    <Choices
                                        questionId={currentQuestion.question}
                                        onOptionChange={onOptionChange}
                                        currentSelectedIndex={
                                            currentSelectedIndex
                                        }
                                        choices={currentQuestion.choices}
                                        optionFeedback={optionFeedback}
                                    />
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
        <HelpModal type="casePage" />
        </Wrapper>
    )
}
