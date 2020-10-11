import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader, Input } from 'antd'
import { staticData } from '../../Cases.fixtures'

const { Title, Text } = Typography
const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    border-bottom: 1px solid #eadddd;
`
const Body = styled.div`
    margin-top: 16px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 1px solid lightgray;
    padding: 16px;
`
const Structure = styled.div`
    margin-top: 16px;
    display: flex;
    padding: 16px 0px;
    overflow: auto;
    flex-wrap: wrap;
`

export default function ClarifyingQuestions(){
    const { goBack, push } = useHistory()
    const { id } = useParams()
    const item = staticData.find((e) => e.id.toString() === id)
    
    return (
        <Header>
            <PageHeader subTitle="Back to Case" onBack={goBack} />
        </Header>
    )
}
