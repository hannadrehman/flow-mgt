import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader } from 'antd'
import { staticData } from '../../Cases.fixtures'
import Choices from './Choices.component'
import Success from './Success.component'
import AddonTable from './AddonTable.component'
import Bullets from './Bullets.component'

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
export const Image = styled.img`
    width: 100%;
    padding-bottom: 16px;
`

const Body = styled.div`
    margin-top: 16px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 1px solid lightgray;
    padding: 16px;
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
    const currentQuestionId = React.useRef('')

    React.useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(
                    `https://raw.githubusercontent.com/hannadrehman/flow-mgt/master/src/questions-${id}.json`,
                    {}
                )
                const json = await res.json()
                allQuestionsRef.current = json
                let initialQuestion = qID;
                if(!initialQuestion){
                    initialQuestion = id === '1' ? 'SlideDrugProblemStatement': 'SlideAirlineProblemStatement' //'SlideAirlineQ1_0'
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
                currentQuestionId.current = initialQuestion
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
        setCurrentSelectedIndex(e.target.value)
        selectedOption.current = option
        setIsNextDisabled(false)
    }
    function setFlags(question) {
        if (
            question.revenue_path_flag ||
            question.revenue_path_flag === false
        ) {
            globalFlags.current.revenue_path_flag = question.revenue_path_flag
        }
        if (question.cost_path_flag || question.cost_path_flag === false) {
            globalFlags.current.cost_path_flag = question.cost_path_flag
        }
        if (
            question.non_ticket_revenue_path_flag ||
            question.non_ticket_revenue_path_flag === false
        ) {
            globalFlags.current.non_ticket_revenue_path_flag =
                question.non_ticket_revenue_path_flag
        }
        if (
            question.ticket_revenue_path_flag ||
            question.ticket_revenue_path_flag === false
        ) {
            globalFlags.current.ticket_revenue_path_flag =
                question.ticket_revenue_path_flag
        }
    }
    function getNextLink(item) {
        if (item.is_link_direct === false) {
            const qid = item.conditionId
            switch (qid) {
                case 1:
                    if (globalFlags.current.revenue_path_flag) {
                        return 'SlideAirlineQ3_121_6_0'
                    } else {
                        return 'SlideAirlineQ3_121_2_0'
                    }
                case 2:
                    if (globalFlags.current.cost_path_flag === false) {
                        return 'SlideAirlineQ4_59_3_0'
                    } else {
                        return 'SlideAirlineQ4_59_6_0'
                    }

                case 3:
                    if (globalFlags.current.non_ticket_revenue_path_flag) {
                        if (globalFlags.current.cost_path_flag === false) {
                            return 'SlideAirlineQ4_59_3_0'
                        } else {
                            return 'SlideAirlineQ4_59_6_0'
                        }
                    } else {
                        if (globalFlags.current.cost_path_flag === false) {
                            return 'SlideAirlineQ4_59_5_0b'
                        } else {
                            return 'SlideAirlineQ4_59_5_0c'
                        }
                    }
                default:
                    alert('mismatch')
                    return
            }
        }
        currentQuestionId.current = item.links_to
        return item.links_to
    }
    function goNext() {
        let nextQuestion = {}
        if (!currentQuestion.choices || currentQuestion.choices.length === 0) {
            nextQuestion = allQuestionsRef.current[getNextLink(currentQuestion)]
        } else {
            nextQuestion =
                allQuestionsRef.current[getNextLink(selectedOption.current)]
        }

        if (nextQuestion === undefined) {
            console.log('--------------------------------------------------')
            console.log(currentQuestion)
            console.log(allQuestionsRef.current[getNextLink(currentQuestion)])
            console.log(selectedOption.current)
            console.log('--------------------------------------------------')
            return
        }
        setCurrentQuestion(nextQuestion)
        allSelectedOptions.current.push(
            selectedOption.current || currentQuestion
        )
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
        if (nextQuestion.expectInput) {
            setIsNextDisabled(true)
        }
        setFlags(nextQuestion)
        setCurrentSelectedIndex(null)
        setInputAnswer(null)
        selectedOption.current = null
        if (tbl) {
            selectedOption.current = tbl
        }
    }
    const item = staticData.find((e) => e.id.toString() === id)

    function handleChange(ev) {
        const value = ev.target.value
        inputRef.current = value
    }
    function submitInput() {
        const value = Number(inputRef.current)
        const hasTable = Object.keys(addonTable || {}).length > 0
        console.log(currentQuestion, addonTable)
        if (hasTable) {
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
            return
        }
        if (currentQuestion.bulletData) {
            if (value === currentQuestion.correctAnswer) {
                setInputAnswer(currentQuestion.messageDescription)
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

    if (currentQuestion == null) {
        return null
    }
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
            {!currentQuestion.successMessage && currentQuestion.intro && (
                <div>
                    <Body>
                        <Title level={5}>
                            {currentQuestion.question.headerText}
                        </Title>
                        <Text>{currentQuestion.question.titleText}</Text>
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
                </div>
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
                                <Question>
                                    <QuestionText>
                                        {currentQuestion.question}
                                    </QuestionText>
                                </Question>

                                <Options>
                                    {currentQuestion.addOnTable && (
                                        <div>
                                            <AddonTable
                                                addonTable={addonTable}
                                                inputAnswer={inputAnswer}
                                                handleChange={handleChange}
                                                submitInput={submitInput}
                                            />
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
                                    {currentQuestion.image && (
                                        <div>
                                            <Image
                                                src={currentQuestion.image}
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
        </Wrapper>
    )
}
