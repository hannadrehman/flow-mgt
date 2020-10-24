import React from 'react'
import styled from 'styled-components'
import Score from './Score.component'
import Structure from './Structure.component'
import {  Menu } from 'antd'

const Wrapper = styled.div`
    display: flex;
`
export const Mains = styled.div`
    padding-left: 16px;
    padding-top: 16px;
`

export default function Success({ currentQuestion, usersScore, maxScore, caseDetails }) {
    const [selected, setSelected] = React.useState('1')
   
    return (
        <Wrapper>
            <div>
                <Menu
                    onClick={(ev)=>setSelected(ev.key)}
                    style={{ width: 256 }}
                    defaultSelectedKeys={['1']}
                    mode="inline"
                >
                    <Menu.Item key="1">Score</Menu.Item>
                    <Menu.Item key="2">Structure</Menu.Item>
                    <Menu.Item key="3">Review</Menu.Item>
                    <Menu.Item key="4">Relevance</Menu.Item>
                </Menu>
            </div>
            <Mains>
                {selected === '1' && (
                    <Score usersScore={usersScore} maxScore={maxScore} caseDetails={caseDetails} />
                )}
                {selected === '2' && (
                    <Structure caseDetails={caseDetails} />
                )}
            </Mains>
        </Wrapper>
    )
}
