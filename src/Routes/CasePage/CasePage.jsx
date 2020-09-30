import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button } from 'antd'
import { staticData } from '../../Cases.fixtures'
import { questions } from '../../questions.fixtures'
import { Radio } from 'antd'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const { Title, Text } = Typography

const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px;
		padding-left: 0;
    margin-bottom: 16px;
`
const Container = styled.div`
    display: flex;
    align-items: center;
    min-height: 48px;
    align-content: center;
`
const Main = styled.div`
    display: flex;
    height: 500px;
`
export const Question = styled.div`
    padding: 16px;
    width: 50%;
    min-width: 50%;
    height: 100%;
    border-right: 1px solid gray;
`
export const Options = styled.div`
    padding: 16px;
    width: 50%;
    min-width: 50%;
    height: 100%;
`
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

export default function HomePage() {
    const { push } = useHistory()
    const { id } = useParams()
    const [currentQuestion, setCurrentQuestion] = React.useState(null)
    const [isNextDisabled, setIsNextDisabled] = React.useState(true)
    const allSelectedOptions = React.useRef([])
    const selectedOption = React.useRef({})
		const [currentSelectedIndex, setCurrentSelectedIndex] = React.useState(null)
		React.useEffect(()=>{
			async function getData(){
				try{
					const res = await fetch('https://raw.githubusercontent.com/hannadrehman/flow-mgt/master/src/questions.json');
					console.log(res);
					const json = await res.json();
					setCurrentSelectedIndex(json['SlideDrugQ1_0']);
				}
				catch(e){
					console.log(e)
				}
			}
			getData()
			console.log('effec called')
		},[])
    function handleClick(id) {
        push(`/list`)
    }
    function onOptionChange(e) {
        const option = currentQuestion.choices[e.target.value]
        setCurrentSelectedIndex(e.target.value)
        selectedOption.current = option
        setIsNextDisabled(false)
    }
    function goNext() {
        const nextQuestion = questions[selectedOption.current.links_to]
        setCurrentQuestion(nextQuestion)
        allSelectedOptions.current.push(selectedOption.current)
        setIsNextDisabled(true)
        setCurrentSelectedIndex(null)
        console.log(nextQuestion)
    }
		const item = staticData.find((e) => e.id.toString() === id)
		if(currentQuestion == null){
			return null
		}
    return (
        <Wrapper>
            <Header>
                <Button onClick={handleClick} type="primary">
                    Back to Case Library
                </Button>
                <Text>{item.title}</Text>
            </Header>
            {currentQuestion.successMessage && (
                <Title level={5}>{currentQuestion.successMessage}</Title>
            )}
            {!currentQuestion.successMessage && (
                <Main>
                    <Question>
                        <Title level={5}>{currentQuestion.question}</Title>
                    </Question>
                    <Options>
                        <RadioContainer
                            onChange={onOptionChange}
                            defaultValue="a"
                            value={currentSelectedIndex}
                        >
                            {currentQuestion.choices &&
                                currentQuestion.choices.length > 0 &&
                                currentQuestion.choices.map((item, index) => (
                                    <RadioBtn key={index} value={index}>
                                        {item.answer}
                                    </RadioBtn>
                                ))}
                        </RadioContainer>
                        <br />
                        <Button
                            type="primary"
                            disabled={isNextDisabled}
                            block
                            onClick={goNext}
                        >
                            Next
                        </Button>
                    </Options>
                </Main>
            )}
        </Wrapper>
    )
}
