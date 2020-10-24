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

export default function Review({ usersScore, maxScore, caseDetails }) {
    return (
        <Wrapper>
            <Heading>
                <Title level={3}>
                    {`You are done! Congratulations on completing the ${caseDetails.title}. Here is how we think you fared Review`}
                </Title>
            </Heading>
            <Mains>
                <h1>Review</h1>
            </Mains>
        </Wrapper>
    )
}
