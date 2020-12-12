import React from 'react'
import styled from 'styled-components'
import { Typography, Collapse } from 'antd'
const { Title, Text } = Typography
const { Panel } = Collapse

const Wrapper = styled.div``
const Mains = styled.div``
const Heading = styled.div`
    padding-bottom: 16px;
`
const Solutions = styled.div``
const Question = styled(Panel)`
    &&& {
        padding: 12px 0px;
        background: white;
        margin-bottom: 16px;
    }
`
const Accordion = styled(Collapse)`
    &&& {
        background: white;
    }
`
const HeadContent = styled.div`
    max-width: 90%;
`

const Option = styled.div`
    padding: 8px;
    border: 1px solid #d0cccc;
    border-radius: 8px;
    margin-bottom: 16px;
    min-height: 61px;
    display: flex;
    align-items: center;
    ${(props) =>
        props.isCorrect
            ? 'background-color:#17b978;color:white;border:none;'
            : ''}
    ${(props) =>
        props.isWrong
            ? 'background-color:#f85959;color:white;border:none;'
            : ''}
`

export default function Review({ selectedOptions, allQuestions, caseDetails }) {
    const focusQuestions = React.useMemo(() => {
        const selectedMap = selectedOptions.reduce((accum, item) => {
            accum[item.questionId] = item
            return accum
        }, {})
        return Object.entries(allQuestions)
            .map(([k, v]) => (v.isfocus ? v : null))
            .filter((item) => {
                if (!item) {
                    return false
                }
                const selected = selectedMap[item.questionId]
                if (selected && selected.correctAnswer) {
                    return false
                }
                return true
            })
            .map((item) => {
                const selected = selectedMap[item.questionId]
                if (selected && !selected.correctAnswer) {
                    item.choices[selected.optionIndex].wrongAnswer = true
                }
                return item
            })
    }, [allQuestions, selectedOptions])

    return (
        <Wrapper>
            <Heading>
                <Title level={3}>
                    {`You are done! Congratulations on completing the ${caseDetails.title}. Here is how we think you fared`}
                </Title>
                <Title level={3} style={{ marginTop: -10 }}>
                    Review
                </Title>
            </Heading>
            <Mains>
                <Solutions>
                    <Text strong>
                        These are some questions where you could have chosen
                        different answers
                    </Text>
                    <br />
                    <br />
                    <Accordion
                        expandIconPosition="right"
                        expandIcon={({ isActive }) => {
                            return (
                                <Text strong>
                                    {isActive
                                        ? 'Hide Solution'
                                        : 'View Solution'}
                                </Text>
                            )
                        }}
                    >
                        {focusQuestions.map((question) => (
                            <Question
                                header={
                                    <HeadContent>
                                        {question.alternate_question_text || question.question}
                                    </HeadContent>
                                }
                                key={question.questionId}
                            >
                                <div>
                                    {question.choices.map((item, index) => (
                                        <Option
                                            key={index}
                                            isCorrect={
                                                item.correctAnswer === true
                                            }
                                            isWrong={item.wrongAnswer === true}
                                        >
                                            {item.answer}
                                        </Option>
                                    ))}
                                </div>
                                <Text>{question.explanation}</Text>
                            </Question>
                        ))}
                    </Accordion>
                </Solutions>
            </Mains>
        </Wrapper>
    )
}
