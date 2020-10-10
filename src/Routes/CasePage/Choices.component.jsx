import React from 'react'
import styled from 'styled-components'
import { Radio } from 'antd'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

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
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }
}

export default function Choices({
    onOptionChange,
    currentSelectedIndex,
    choices,
}) {
    const shuffledChoices = React.useMemo(() => {
        const copyList = [...(choices || [])]
        shuffle(copyList)
        return copyList
    }, [choices])

    if (!choices || choices.length === 0) {
        return null
    }
    return (
        <RadioContainer
            onChange={onOptionChange}
            defaultValue="a"
            value={currentSelectedIndex}
        >
            {shuffledChoices.map((item, index) => (
                <RadioBtn key={index} value={index}>
                    {item.answer}
                </RadioBtn>
            ))}
        </RadioContainer>
    )
}
