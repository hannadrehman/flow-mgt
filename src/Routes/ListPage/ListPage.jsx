import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader } from 'antd'
import { casesList, marketSizingList } from './list'

const { Title, Text } = Typography

const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    border-bottom: 1px solid #eadddd;
    margin-bottom: 16px;
`
const Grid = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px;
    flex-wrap: wrap;
    margin: -32px auto;
    justify-content: center;
`
const GridItem = styled.div`
    max-width: 300px;
    margin-top: 32px;
    margin: 16px;
`

const GridImage = styled.div`
    width: 300px;
    height: 300px;
    background-color: ${(props) => props.color};
`
const Container = styled.div`
    display: flex;
    align-items: center;
    min-height: 48px;
    align-content: center;
`

export default function HomePage() {
    const { push, goBack } = useHistory()
    const { type } = useParams()

    const listItems = type === 'cases' ? casesList : marketSizingList

    function handleClick(id) {
        const base = type === 'cases' ? 'details' : 'market-sizing'
        push(`/${base}/${id}`)
    }

    return (
        <Wrapper>
            <Header>
                <PageHeader subTitle="Back to Home" onBack={goBack} />
            </Header>

            <Grid>
                {listItems.map((item) => (
                    <GridItem key={item.id}>
                        <GridImage color={item.color} />
                        <Container>
                            <Title level={5}>{item.title}</Title>
                        </Container>
                        <Container>
                            <Text>{item.description}</Text>
                        </Container>
                        <Container>
                            <Button
                                block
                                danger
                                onClick={() => handleClick(item.id)}
                            >
                                Try {item.title}
                            </Button>
                        </Container>
                    </GridItem>
                ))}
            </Grid>
        </Wrapper>
    )
}
