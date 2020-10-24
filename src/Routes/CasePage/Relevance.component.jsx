import React from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'
const { Title } = Typography
const Wrapper = styled.div``
const Mains = styled.div`
    display: flex;
`
const Heading = styled.div`
    padding-bottom: 16px;
`

export default function Relevance({ usersScore, maxScore, caseDetails }) {
    return (
        <Wrapper>
            <Heading>
                <Title level={3}>
                    {`You are done! Congratulations on completing the ${caseDetails.title}. Here is how we think you fared Relevance`}
                </Title>
            </Heading>
            <Mains>
                <h1>Relevance</h1>
            </Mains>
        </Wrapper>
    )
}
