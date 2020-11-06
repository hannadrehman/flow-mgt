import React from 'react'
import styled from 'styled-components'
import { Typography, Input } from 'antd'
const { Text } = Typography

const SubmitBtn = styled.div`
    &:hover {
        cursor: pointer;
    }
`

export default function Bullets({
    question,
    inputAnswer,
    handleChange,
    submitInput,
}) {
    const [text, setText] = React.useState('')
    function handleTextChanges(e) {
        const { value } = e.target
        const reg = /^-?\d*(\.\d*)?$/
        if (
            (!isNaN(value) && reg.test(value)) ||
            value === '' ||
            value === '-'
        ) {
            setText(value)
            handleChange({ target: { value } })
            return
        }
        setText('')
    }
    return (
        <div>
            {Object.keys(question).length && (
                <>
                    <Text>{question.bulletData.title}</Text>
                    <ul>
                        {question.bulletData.bullets.map((e, i) => (
                            <li key={i}>{e}</li>
                        ))}
                    </ul>
                    {question.expectInput && (
                        <div>
                            <br />
                            <Input
                                onChange={handleTextChanges}
                                placeholder="Enter value"
                                value={text}
                                addonAfter={
                                    <SubmitBtn onClick={submitInput}>
                                        Submit
                                    </SubmitBtn>
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
