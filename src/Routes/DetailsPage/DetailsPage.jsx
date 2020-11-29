import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader } from 'antd'
import { casesList } from '../ListPage/list'
import HelpModal from '../HelpModal/HelpModal.component';

const { Title } = Typography

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
    margin-top: 48px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 1px solid green;
    border-radius: 80px;
    padding: 48px;
`
const HeaderText = styled(Title)`
    &&& {
        color: green;
    }
`
function createMarkup(html) {
    return { __html: html }
}

export default function HomePage() {
    const { push, goBack } = useHistory()
    const { id } = useParams()
    
    React.useEffect(() => {
        localStorage.setItem('questions', '')
        localStorage.setItem('structure', '')
    }, [])

    function handleStructureClick(id) {
        push(`/create-structure/${item.id}`)
    }
    function handleClearifyingQuestionsClick(id) {
        push(`/clearifying-questions/${item.id}`)
    }
    const item = casesList.find((e) => e.id.toString() === id)
    return (
        <Wrapper>
            <Header>
                <PageHeader subTitle="Back to Case Library" onBack={goBack} />
            </Header>
            <Body>
                <HeaderText level={1} color="green">
                    {item.title}
                </HeaderText>
                <div
                    style={{ fontSize: '20px', fontWeight: 500 }}
                    dangerouslySetInnerHTML={createMarkup(
                        item.detailedDescription
                    )}
                />
            </Body>
            <br />
            <Container>
                <Button
                    type="primary"
                    block
                    onClick={handleClearifyingQuestionsClick}
                >
                    Ask Clarifying questions
                </Button>
                &nbsp;&nbsp;
                <Button type="primary" block onClick={handleStructureClick}>
                    Create Structure
                </Button>
            </Container>
        <HelpModal type="detailsPage" />
        </Wrapper>
    )
}
