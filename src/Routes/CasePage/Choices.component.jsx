import React from 'react'
import styled from 'styled-components'
import { Radio, Typography } from 'antd'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const { Text } = Typography

export const RadioContainer = styled(RadioGroup)`
    &&& {
        width: 100%;
    }
`
export const RadioBtn = styled(RadioButton)`
    display: block;
    margin-bottom: 8px;
    width: 100%;
    height: auto;
    line-height: 1.5;
    padding: 8px;
`
const OptionText = styled(Text)`
    font-size: 16px;
`

export default function Choices({
    onOptionChange,
    currentSelectedIndex,
    choices,
    optionFeedback,
}) {
    if (!choices || choices.length === 0) {
        return null
    }
    return (
        <>
            <RadioContainer
                onChange={onOptionChange}
                defaultValue="a"
                value={currentSelectedIndex}
            >
                {choices.map((item, index) => (
                    <RadioBtn key={index} value={index}>
                        <OptionText>{item.answer}</OptionText>
                    </RadioBtn>
                ))}
            </RadioContainer>
            <Text>{optionFeedback}</Text>
        </>
    )
}
