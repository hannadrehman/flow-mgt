import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader } from 'antd'

const { Title } = Typography

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

export default function MarketSizingList() {
    const { push, goBack } = useHistory()
    const [listItems, setlistItems] = React.useState([])
    
    React.useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(
                    `http://app.casesninja.com/json/final_market_sizing-1.json`,
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
                {Object.entries(listItems).map(([key,item]) => (
                    <GridItem key={key}>
                        <GridImage color="#cbffa0"/>
                        <Container>
                            <Title level={5}>{item.Title}</Title>
                        </Container>
                        <Container>
                            <Button
                                block
                                danger
                                onClick={() => handleClick(key)}
                            >
                                Try {item.Title}
                            </Button>
                        </Container>
                    </GridItem>
                ))}
            </Grid>
        </Wrapper>
    )
}
