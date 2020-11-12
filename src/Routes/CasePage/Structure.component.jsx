import React from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'
import * as utils from './utilities'

const { Title, Text } = Typography

const Wrapper = styled.div``
const Mains = styled.div`
    display: flex;
`
const Heading = styled.div`
    padding-bottom: 16px;
`

const Response = styled.div`
    border: 1px solid #e6e6e6;
    width: 100%;
`
const Header = styled.div`
    color: white;
    background-color: ${(props) => props.color || '#1890ff'};
    padding: 16px;
    display: flex;
    justify-content: space-between;
`
const HeaderText = styled(Text)`
    color: white;
    font-weight: 600;
`
const ResponseBody = styled.div`
    padding: 16px;
`
const StructureInfo = styled.div`
    display: flex;
    padding: 16px 0px;
    border-bottom: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;
`
const Space = styled.div`
    margin-top: 16px;
`
const StructureMain = styled.div`
    max-width: 50%;
    width: 50%;
`
const StructureChild = styled.div`
    min-height: 48px;
`
const RecommendedHeading = styled.div`
    min-height: 48px;
    display: flex;
    align-items: center;
`

export default function Structure({ caseDetails }) {
    const [recommended, setRecommended] = React.useState({
        answers: [],
        extraInfo: [],
    })
    React.useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(
                    `https://raw.githubusercontent.com/hannadrehman/flow-mgt/master/src/success-structure.json`,
                    {}
                )
                const resp = await res.json()
                setRecommended(resp)
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [])

    const structureData = JSON.parse(localStorage.getItem('structure'))
    const timeTaken = parseInt(localStorage.getItem('structureTime'), 10)

    return (
        <Wrapper>
            <Heading>
                <Title level={3}>
                    {`You are done! Congratulations on completing the ${caseDetails.title}. Here is how we think you fared`}
                </Title>
                <Title level={3} style={{ marginTop: -10 }}>
                    Structure
                </Title>
            </Heading>
            <Mains>
                <Response>
                    <Header>
                        <HeaderText>Your response</HeaderText>
                        <HeaderText>
                            {`Time Taken:  ${utils.millisToMinutesAndSeconds(
                                timeTaken
                            )}. Avg time : ${utils.millisToMinutesAndSeconds(
                                2000000
                            )}`}
                        </HeaderText>
                    </Header>
                    <ResponseBody>
                        <Text>
                            Problem statement: {caseDetails.description}
                        </Text>
                        <Space />
                        {structureData.map((item) => (
                            <StructureInfo key={item.id}>
                                <StructureMain>
                                    <Text>{item.value}</Text>
                                </StructureMain>
                                <StructureChild>
                                    <ul>
                                        {item.children.map((child) => (
                                            <li key={child.id}>
                                                {child.value}
                                            </li>
                                        ))}
                                    </ul>
                                </StructureChild>
                            </StructureInfo>
                        ))}
                    </ResponseBody>
                </Response>
            </Mains>
            <br />
            <Mains>
                <Response>
                    <Header color="#305D7B">
                        <HeaderText>RocketBlocks suggested answer</HeaderText>
                    </Header>
                    <ResponseBody>
                        <Text>
                            Problem statement: {caseDetails.description}
                        </Text>
                        <Space />
                        {recommended.answers.map((item) => (
                            <StructureInfo key={item.id}>
                                <StructureMain>
                                    <Text>{item.value}</Text>
                                </StructureMain>
                                <StructureChild>
                                    <ul>
                                        {item.children.map((child) => (
                                            <li key={child.id}>
                                                {child.value}
                                            </li>
                                        ))}
                                    </ul>
                                </StructureChild>
                            </StructureInfo>
                        ))}
                        {recommended.extraInfo.map((info) => (
                            <div key={info.id}>
                                <RecommendedHeading>
                                    <Text>
                                        <b>{info.title}</b>
                                    </Text>
                                </RecommendedHeading>
                                <div>
                                    <ul>
                                        {info.children.map((child) => (
                                            <li key={child.id}>
                                                {child.value}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </ResponseBody>
                </Response>
            </Mains>
        </Wrapper>
    )
}
