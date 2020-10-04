import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, Input, List, Card } from 'antd'
import { staticData } from '../../Cases.fixtures'
import { Radio } from 'antd'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const { Title, Text } = Typography

const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px;
    padding-left: 0;
    margin-bottom: 16px;
`

const Main = styled.div`
    display: flex;
    height: 500px;
`
export const Question = styled.div`
    padding: 16px;
    width: 50%;
    min-width: 50%;
    height: 100%;
    border-right: 1px solid gray;
`
export const Options = styled.div`
    padding: 16px;
    width: 50%;
    min-width: 50%;
    height: 100%;
`
export const RadioContainer = styled(RadioGroup)`
    &&& {
        width: 100%;
    }
`
export const RadioBtn = styled(RadioButton)`
    display: block;
    margin-bottom: 8px;
    width: 100%;
    height: auto;
    line-height: 1.5;
    padding: 8px;
`
export const Table = styled.table`
    width: 100%;
    margin-top: 16px;
    border: 1px solid #d7cdcd;
    td,
    th {
        padding: 4px;
        border-right: 1px solid #d7cdcd;
    }
    tr {
        border-bottom: 1px solid #d7cdcd;
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
    function handleClick(id) {
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
        console.log('submit', inputRef.current)
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
    console.log(groupedScore)
    return (
        <Wrapper>
            <Header>
                <Button onClick={handleClick} type="primary">
                    Back to Case Library
                </Button>
                <Text>{item.title}</Text>
            </Header>
            {currentQuestion.successMessage && (
                <div>
                    <Title level={5}>{currentQuestion.successMessage}</Title>
                    <br />
                    <Title level={5}>Result</Title>
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={Object.entries(
                            groupedScore || {}
                        ).map(([x, y]) => ({ title: x, value: y }))}
                        renderItem={(item) => (
                            <List.Item>
                                <Card title={item.title}>{item.value}</Card>
                            </List.Item>
                        )}
                    />
                </div>
            )}
            {!currentQuestion.successMessage && (
                <Main>
                    <Question>
                        <Title level={5}>{currentQuestion.question}</Title>
                    </Question>
                    <Options>
                        {currentQuestion.choices &&
                            currentQuestion.choices.length > 0 && (
                                <RadioContainer
                                    onChange={onOptionChange}
                                    defaultValue="a"
                                    value={currentSelectedIndex}
                                >
                                    {currentQuestion.choices.map(
                                        (item, index) => (
                                            <RadioBtn key={index} value={index}>
                                                {item.answer}
                                            </RadioBtn>
                                        )
                                    )}
                                </RadioContainer>
                            )}
                        {currentQuestion.addOnTable &&
                            Object.keys(addonTable).length > 0 && (
                                <div>
                                    <Title level={5}>
                                        {addonTable.question}
                                    </Title>
                                    {addonTable.tableData.tables.map(
                                        (table, i) => (
                                            <Table key={i}>
                                                {table.title && (
                                                    <tr>
                                                        <th>{table.title}</th>
                                                    </tr>
                                                )}
                                                {table.rows.map((row, id) => (
                                                    <tr key={id}>
                                                        {row.columns.map(
                                                            (col) => (
                                                                <td>
                                                                    {col.label}
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                ))}
                                            </Table>
                                        )
                                    )}
                                    {addonTable.expectInput && (
                                        <div>
                                            <br />
                                            <Input
                                                onChange={handleChange}
                                                placeholder="Enter value"
                                                addonAfter={
                                                    <span onClick={submitInput}>
                                                        Submit
                                                    </span>
                                                }
                                            />
                                            <div>
                                                <br />
                                                {inputAnswer && (
                                                    <Text>{inputAnswer}</Text>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        <br />
                        <Button
                            type="primary"
                            disabled={isNextDisabled}
                            block
                            onClick={goNext}
                        >
                            Next
                        </Button>
                    </Options>
                </Main>
            )}
        </Wrapper>
    )
}
