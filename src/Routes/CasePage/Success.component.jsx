import React from 'react'
import { Typography, List, Card } from 'antd'
const { Title } = Typography

export default function Success({ currentQuestion, groupedScore }) {
    return (
        <div>
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
        </div>
    )
}
