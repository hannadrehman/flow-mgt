import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader } from 'antd'
import { casesList } from './list'

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
    height: 150px;
    background-image: url(${(props) => props.bgSrc});
    background-size: 100%;
    background-repeat: no-repeat;
    object-fit: cover;
`
const Container = styled.div`
    display: flex;
    align-items: center;
    min-height: 48px;
    align-content: center;
`

export default function HomePage() {
    const { push } = useHistory()

    const listItems = casesList

    function handleClick(id) {
        push(`/details/${id}`)
    }
    function handleBack(){
        window.location.assign('https://alpha.casesninja.com/')
    }

    return (
        <Wrapper>
            <Header>
                <PageHeader subTitle="Back to Home" onBack={handleBack} />
            </Header>
<br />
<br />
<br />
            <Grid>
                {listItems.map((item) => (
                    <GridItem key={item.id}>
                        <GridImage bgSrc={item.url} />
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
