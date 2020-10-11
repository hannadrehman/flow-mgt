import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader, Input } from 'antd'
import { staticData } from '../../Cases.fixtures'

const { Title, Text } = Typography
const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    border-bottom: 1px solid #eadddd;
`
const Body = styled.div`
    margin-top: 16px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 1px solid #f3f0f0;
    padding: 16px;
    min-height: 300px;
`
const Questions = styled.div`
    margin-top: 16px;
    display: flex;
    padding: 16px 0px;
    overflow: auto;
    flex-wrap: wrap;
    justify-content: space-between;
`
const Question = styled.div`
    display: flex;
    padding: 16px;
    align-items: center;
    border: 1px solid #f3f0f0;
    max-width: 47%;
    width: 47%;
    margin-bottom: 8px;
    cursor: pointer;
    &:hover {
        background: #f3f0f0;
        cursor: pointer;
    }
    background-color: ${(props) => (props.selected ? '#f3f0f0' : '')};
`
function createMarkup(html) {
    return { __html: html }
}
export default function ClarifyingQuestions() {
    const { goBack, push } = useHistory()
    const { id } = useParams()
    const item = staticData.find((e) => e.id.toString() === id)
    const [questions, setQuestions] = React.useState([])
    const [selectedQuestion, setSelectedQuestion] = React.useState(null)
    const list = React.useRef([])

    React.useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(
                    `https://raw.githubusercontent.com/hannadrehman/flow-mgt/master/src/case-${id}.json`,
                    {}
                )
                const json = await res.json()
                setQuestions(json)
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [id])
    
    function handleClick(question) {
        setSelectedQuestion(question)
        list.current.push(question)
        setQuestions((prevQuestions) =>
            prevQuestions.map((item) => {
                const ques = { ...item }
                if (ques.id === question.id) {
                    ques.selected = true
                }
                return ques
            })
        )
    }
    function handleCreate(){
      localStorage.setItem(
          'questions',
          JSON.stringify(list.current || {})
      )
      push(`/create-structure/${item.id}`)
    }
    return (
        <div>
            <Header>
                <PageHeader subTitle="Back to Case" onBack={goBack} />
            </Header>
            <Body>
                {!selectedQuestion && (
                    <div
                        dangerouslySetInnerHTML={createMarkup(
                            item.detailedDescription
                        )}
                    />
                )}
                {selectedQuestion && (
                    <div>
                        {selectedQuestion.type === 'text' && (
                            <Text>{selectedQuestion.text}</Text>
                        )}
                        {selectedQuestion.type === 'image' && (
                            <img src={selectedQuestion.imageUrl} alt="img" />
                        )}
                    </div>
                )}
            </Body>
            <Questions>
                {questions.map((question) => (
                    <Question
                        key={question.id}
                        onClick={() => handleClick(question)}
                        selected={question.selected}
                    >
                        <Text>{question.question}</Text>
                    </Question>
                ))}
            </Questions>
            <Button type="primary" block onClick={handleCreate}>
                Create Structure
            </Button>
        </div>
    )
}
