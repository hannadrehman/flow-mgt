import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button } from 'antd'
const { Title } = Typography

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    flex-direction: column;
`

export default function HomePage() {
    const { push } = useHistory()
    function handleClick() {
        push('list')
    }
    return (
        <Wrapper>
            <div>
                <Title level={5}>
                    Welcome to Caseadilla where we help you chew case interviews
                    and land opportunities of your choice
                </Title>
            </div>
            <div>
                <Button onClick={handleClick} type="primary">Start Chewing</Button>
            </div>
        </Wrapper>
    )
}
