import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader } from 'antd'

const { Title,Text } = Typography

const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    border-bottom: 1px solid #eadddd;
    margin-bottom: 16px;
`
const Grid = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
`
const GridItem = styled.div`
    width: 603px;
    border-radius: 8px;
    border: 1px solid #eceaea;
    margin-bottom: 16px;
    display:flex;
    height: 100px;
    justify-content: space-between;
    padding: 0 24px;
`

const Container = styled.div`
    display: flex;
    align-items: center;
    min-height: 48px;
    align-content: center;
    flex-direction: ${props=>props.dir || 'row'};
    justify-content: center;
    align-items: flex-start;
`

export default function MarketSizingList() {
    const { push, goBack } = useHistory()
    const [listItems, setlistItems] = React.useState([])

    React.useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(
                    `http://app.casesninja.com/json/final_market_sizing-1.json?q=f`,
                    {}
                )
                const resp = await res.json()
                setlistItems(resp)
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [])

    function handleClick(id) {
        push(`/market-sizing/${id}`)
    }
    return (
        <Wrapper>
            <Header>
                <PageHeader subTitle="Back to Home" onBack={goBack} />
            </Header>

            <Grid>
                {Object.entries(listItems).map(([key, item]) => (
                    <GridItem key={key}>
                        <Container dir="column">
                            <Title level={5}>{item.Title}</Title>
                            <Text >{item.Subtitle}</Text>

                        </Container>
                        <Container dir="column">
                            <Button
                                block
                                danger
                                onClick={() => handleClick(key)}
                            >
                                Try
                            </Button>
                        </Container>
                    </GridItem>
                ))}
            </Grid>
        </Wrapper>
    )
}
