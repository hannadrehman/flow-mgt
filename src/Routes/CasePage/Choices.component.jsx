import React from 'react'
import styled from 'styled-components'
import { Radio,Typography } from 'antd'

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
const Wrapper = styled.div`
.slide-enter {
    transform: translateX(100%);
  }
  .slide-enter-active {
    transform: translateX(0%);
    transition: transform 300ms ease-in-out;
  }
  .slide-exit {
    transform: translateX(0%);
  }
  .slide-exit-active {
    transform: translateX(-100%);
    transition: transform 300ms ease-in-out;
  }
  
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
    optionFeedback
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
            {choices.map((item, index) => (
                <RadioBtn key={index} value={index}>
                    <OptionText>{item.answer}</OptionText>
                </RadioBtn>
            ))}
            <Text>{optionFeedback}</Text>
        </RadioContainer>
    )
}
