import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button } from 'antd'
import { staticData } from '../../Cases.fixtures'

const { Title, Text } = Typography

const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px;
    padding-left:0;
`
const Container = styled.div`
    display: flex;
    align-items: center;
    min-height: 48px;
    align-content: center;
`

export const Body = styled.div`
    height: 300px;
    margin-top:48px;
    display:flex;
    justify-content:center;
    flex-direction:column;
    border:1px solid lightgray;
    padding:16px;
    
` 

export default function HomePage() {
    const { push, goBack } = useHistory()
    const {id} = useParams()

    function handleClick(id) {
        push(`/case/${item.id}`)
    }
    const item = staticData.find((e) => e.id.toString() === id)
    return (
        <Wrapper>
            <Header>
                <Button onClick={goBack} type="primary">
                    Back to Case Library
                </Button>
            </Header>
            <Body>
                <Title level={5}>{item.title}</Title>
                <Title level={5}>{item.description}</Title>
            </Body>
            <br />
            <Container>
                <Button type="primary" block onClick={handleClick}> Start the Case</Button>
            </Container>
        </Wrapper>
    )
}
