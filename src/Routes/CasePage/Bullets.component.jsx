import React from 'react'
import styled from 'styled-components'
import { Typography, Input } from 'antd'
const { Text } = Typography

export default function Bullets({
    question,
    inputAnswer,
    handleChange,
    submitInput,
}) {
    return (
        <div>
            {Object.keys(question).length && (
                <>
                    <Text>{question.bulletData.title}</Text>
                    <ul>
                        {question.bulletData.bullets.map((e, i) => (
                            <li>{e}</li>
                        ))}
                    </ul>
                    {question.expectInput && (
                        <div>
                            <br />
                            <Input
                                onChange={handleChange}
                                placeholder="Enter value"
                                addonAfter={
                                    <span onClick={submitInput}>Submit</span>
                                }
                            />
                            <div>
                                <br />
                                {inputAnswer && <Text>{inputAnswer}</Text>}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
