import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader } from 'antd'
import { staticData } from '../../Cases.fixtures'

const { Title, Text } = Typography

const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    border-bottom: 1px solid #eadddd;
`
const Container = styled.div`
    display: flex;
    align-items: center;
    min-height: 48px;
    align-content: center;
`

export const Body = styled.div`
    height: 300px;
    margin-top: 48px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 1px solid lightgray;
    padding: 16px;
`
function createMarkup(html) {
    return { __html: html }
}

export default function HomePage() {
    const { push, goBack } = useHistory()
    const { id } = useParams()

    function handleClick(id) {
        push(`/case/${item.id}`)
    }
    const item = staticData.find((e) => e.id.toString() === id)
    return (
        <Wrapper>
            <Header>
                <PageHeader subTitle="Back to Case Library" onBack={goBack} />
            </Header>
            <Body>
                <Title level={5}>{item.title}</Title>
                <div
                    dangerouslySetInnerHTML={createMarkup(
                        item.detailedDescription
                    )}
                />
            </Body>
            <br />
            <Container>
                <Button type="primary" block onClick={handleClick}>
                    Ask clarifying questions
                </Button>
                &nbsp;&nbsp;
                <Button type="primary" block onClick={handleClick}>
                    Create Strcuture
                </Button>
            </Container>
        </Wrapper>
    )
}
