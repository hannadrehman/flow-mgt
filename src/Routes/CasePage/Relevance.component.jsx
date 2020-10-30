import React from 'react'
import styled from 'styled-components'
import { Typography, Card, Collapse } from 'antd'
const { Title, Text } = Typography
const { Panel } = Collapse
const Wrapper = styled.div``
const Mains = styled.div``
const Heading = styled.div`
    padding-bottom: 16px;
`
const Cards = styled.div`
    display: flex;
`
const CardInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Label = styled(Text)`
    font-size: 12px;
    color: gray;
`
const LabelSuff = styled(Text)`
    font-size: 10px;
    color: gray;
`
const MainLabel = styled(Text)`
    font-size: 20px;
    font-weight: 600;
    color: ${(props) => props.color};
`

const Solutions = styled.div`
    margin-top: 48px;
`
const Question = styled(Panel)`
&&&{
  padding: 12px 0px;
  background: white;
  margin-bottom: 16px;
}
`
const Accordion = styled(Collapse)`
&&&{
  background: white;
}
`

export default function Relevance({ usersScore, maxScore, caseDetails }) {
    const questions = React.useMemo(() => {
        const items = JSON.parse(localStorage.getItem('questions'))
        const map = {
            relevent: [],
            irrelevent: [],
        }
        items.forEach((item) => {
            if (item.relevant === true) {
                map.relevent.push(item)
                return
            }
            if (item.relevant === false) {
                map.irrelevent.push(item)
                return
            }
        })
        return map
    }, [])

    return (
        <Wrapper>
            <Heading>
                <Title level={3}>
                    {`You are done! Congratulations on completing the ${caseDetails.title}. Here is how we think you fared Relevance`}
                </Title>
            </Heading>
            <Mains>
                <Cards>
                    <Card>
                        <CardInner>
                            <Label>YOU ASKED</Label>
                            <MainLabel color="green">
                                {questions.relevent.length}
                            </MainLabel>
                            <LabelSuff>RELEVENT QUESTIONS</LabelSuff>
                        </CardInner>
                    </Card>
                    &nbsp;&nbsp;&nbsp;
                    <Card>
                        <CardInner>
                            <Label>YOU ASKED</Label>
                            <MainLabel color="red">
                                {questions.irrelevent.length}
                            </MainLabel>
                            <LabelSuff>IRRELEVENT QUESTIONS</LabelSuff>
                        </CardInner>
                    </Card>
                </Cards>
                <Solutions>
                    <Text strong>
                        These are some questions which we think you could have
                        avoided
                    </Text>
                    <br />
                    <br />
                    <Accordion
                        expandIconPosition="right"
                        expandIcon={({ isActive }) => {
                            return <Text strong>{isActive ? 'Hide Solution': 'View Solution'}</Text>
                        }}
                    >
                        {questions.irrelevent.map((question) => (
                            <Question header={question.question} key={question.id}>
                                <Text>{question.explanation}</Text>
                            </Question>
                        ))}
                    </Accordion>
                </Solutions>
            </Mains>
        </Wrapper>
    )
}
