import React from 'react'
import styled from 'styled-components'
import Score from './Score.component'
import Structure from './Structure.component'
import Review from './Review.component'
import Relevance from './Relevance.component'
import HelpModal from '../HelpModal/HelpModal.component';

import {  Menu } from 'antd'

const Wrapper = styled.div`
    display: flex;
`
export const Mains = styled.div`
    padding-left: 16px;
    padding-top: 16px;
`

export default function Success({ usersScore, maxScore, caseDetails, selectedOptions, allQuestions }) {
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
                {selected === '3' && (
                    <Review caseDetails={caseDetails} selectedOptions={selectedOptions} allQuestions={allQuestions} />
                )}
                {selected === '4' && (
                    <Relevance caseDetails={caseDetails} />
                )}
            </Mains>
        <HelpModal type="successPage" />

        </Wrapper>
    )
}
