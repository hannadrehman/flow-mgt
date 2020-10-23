import React from 'react'
import styled from 'styled-components'
import { Typography, List, Card, Menu } from 'antd'
const { Title } = Typography

const Wrapper = styled.div`
    display: flex;
`
export const Mains = styled.div`
    padding-left: 16px;
    padding-top: 16px;
`

export default function Success({ currentQuestion, groupedScore }) {
    function handleClick(e) {
        console.log(e)
    }
    return (
        <Wrapper>
            <div>
                <Menu
                    onClick={handleClick}
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
                <Title level={5}>{currentQuestion.successMessage}</Title>
                <br />
                <Title level={5}>Result</Title>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={Object.entries(
                        groupedScore || {}
                    ).map(([x, y]) => ({ title: x, value: y }))}
                    renderItem={(item) => (
                        <List.Item>
                            <Card title={item.title}>{item.value}</Card>
                        </List.Item>
                    )}
                />
            </Mains>
        </Wrapper>
    )
}
