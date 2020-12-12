import React from 'react'
import styled from 'styled-components'
import {
    Button,
    PageHeader,
    Popconfirm,
    Typography,
    Select,
    Input,
    Radio,
} from 'antd'
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons'
import * as utils from '../CasePage/utilities'
import { useHistory, useParams } from 'react-router-dom'
import { useInterval } from '../../hooks/timers'

const { Title, Text } = Typography
const { Option } = Select
const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    border-bottom: 1px solid #eadddd;
`
const InfoHeader = styled.div`
    padding: 16px;
    background-color: #1890ff;
    display: flex;
    justify-content: space-between;
`
const InfoBody = styled.div`
    padding: 16px;
    border: 1px solid;
    border-color: #1890ff;
`

const InfoText = styled(Text)`
    color: white;
    font-weight: 600;
    font-size: 18px;
`
const AnswerText = styled(Text)`
    font-size: 18px;
    padding: 2px 0px;
    border-bottom: 1px solid #ebe3e3;
`
const SourceText = styled(Text)`
    font-size: 16px;
    padding: 12px 0px;
`
const HeaderText = styled(Text)`
    font-weight: 600;
    font-size: 16px;
`
const Headergrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
`
const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: 2fr 6fr 1fr 1fr;
    grid-column-gap: 2px;
    margin-top: 8px;
`

function createMarkup(html) {
    return { __html: html }
}

const defInfo = {
    type: '',
    description: '',
    value: '',
    id: 0,
}

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
}
export default function MarketSizing() {
    const { push } = useHistory()
    const { id } = useParams()
    const [problem, setProblem] = React.useState()
    const [info, setInfo] = React.useState([defInfo])
    const [size, setSize] = React.useState()
    const [showResults, setShowResults] = React.useState(false)
    const timeElapsed = React.useRef(0)
    const [timeDelay, setTimeDelay] = React.useState(500)
    const [isFollowUpCorrect, setIsFollowUpCorrect] = React.useState(false)
    const [isFollowUpSubmit, setIsFollowUpSubmit] = React.useState(false)

    useInterval(() => {
        timeElapsed.current += 500
    }, timeDelay)

    React.useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(
                    `http://app.casesninja.com/json/final_market_sizing-1.json?q=12`,
                    {}
                )
                const resp = await res.json()
                setProblem(resp[id])
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [id])

    function handleBack(id) {
        push(`/market-sizing/list`)
    }

    function handleDelete(id) {
        setInfo((prevInfo) => prevInfo.filter((x) => x.id !== id))
    }
    function handleTypeChange(ev, id) {
        setInfo((prevInfo) => {
            return prevInfo.map((el) => {
                const elm = { ...el }
                if (elm.id === id) {
                    elm.type = ev
                }
                return elm
            })
        })
    }
    function handleDescChange(ev, id) {
        const {
            target: { value },
        } = ev
        setInfo((prevInfo) => {
            return prevInfo.map((el) => {
                const elm = { ...el }
                if (elm.id === id) {
                    elm.description = value
                }
                return elm
            })
        })
    }
    function handleValueChange(ev, id) {
        const {
            target: { value },
        } = ev
        setInfo((prevInfo) => {
            return prevInfo.map((el) => {
                const elm = { ...el }
                if (elm.id === id) {
                    elm.value = value
                }
                return elm
            })
        })
    }
    function handleAdd() {
        const listInfo = [...info]
        listInfo.push({ ...defInfo, id: listInfo.length })
        setInfo(listInfo)
    }

    function handleSubmit() {
        setShowResults(true)
        setTimeDelay(null)
    }

    const disableBtn = !(
        info[0].type.length &&
        info[0].description.length &&
        info[0].value.length
    )

    console.log(problem)

    function handleRadioChange(e) {
        const correct = problem['Follow up question'].correct_answer
        const selected = e.target.value

        if (correct === selected) {
            setIsFollowUpCorrect(true)
        }
        if (correct !== selected) {
            setIsFollowUpCorrect(false)
        }
        setIsFollowUpSubmit(true)
    }
    return !problem ? (
        ''
    ) : (
        <Wrapper>
            <Header>
                <PageHeader
                    backIcon={
                        <Popconfirm
                            title="Are you sure you want to exit this case ?"
                            onConfirm={handleBack}
                            okText="Yes"
                            cancelText="No"
                        >
                            <ArrowLeftOutlined />
                        </Popconfirm>
                    }
                    subTitle="Exit Case"
                    onBack={() => {}}
                    extra={[
                        <Button
                            key="1"
                            href="https://forms.gle/wdf3yMk2BAcEbxFZA"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            feedback
                        </Button>,
                    ]}
                />
            </Header>
            <br />
            <div>
                <Title level={3}>{problem.Title}</Title>
                <div dangerouslySetInnerHTML={createMarkup(problem.Question)} />
            </div>
            <br />
            {!showResults && (
                <div>
                    <InfoHeader>
                        <InfoText>Your Response(s)</InfoText>
                        {showResults && (
                            <InfoText>
                                {`Time Taken:  ${utils.millisToMinutesAndSeconds(
                                    timeElapsed.current
                                )}. Avg time : ${
                                    problem['Time taken'].avg_time
                                }`}
                            </InfoText>
                        )}
                    </InfoHeader>
                    <div>
                        <InfoBody>
                            <Headergrid>
                                {problem.header.map((item, index) => (
                                    <HeaderText key={index}>{item}</HeaderText>
                                ))}
                            </Headergrid>
                            {info.map((elem) => (
                                <InfoGrid key={elem.id}>
                                    <HeaderText>
                                        <Select
                                            style={{ width: '100%' }}
                                            onChange={(ev) =>
                                                handleTypeChange(ev, elem.id)
                                            }
                                            placeholder="Select"
                                        >
                                            <Option value="Assumption">
                                                Assumption
                                            </Option>
                                            <Option value="Calculation">
                                                Calculation
                                            </Option>
                                            <Option value="Segmentation">
                                                Segmentation
                                            </Option>
                                        </Select>
                                    </HeaderText>
                                    <HeaderText>
                                        <Input
                                            placeholder="Short decription (e.g, 180M House / 3 people ...)"
                                            onChange={(ev) =>
                                                handleDescChange(ev, elem.id)
                                            }
                                        />
                                    </HeaderText>
                                    <HeaderText>
                                        <Input
                                            placeholder="Value or na"
                                            onChange={(ev) =>
                                                handleValueChange(ev, elem.id)
                                            }
                                        />
                                    </HeaderText>
                                    <HeaderText>
                                        <DeleteOutlined
                                            onClick={() =>
                                                handleDelete(elem.id)
                                            }
                                        />
                                    </HeaderText>
                                </InfoGrid>
                            ))}
                            <Button
                                type="link"
                                icon={<PlusCircleOutlined />}
                                onClick={handleAdd}
                            >
                                Add
                            </Button>
                            <br />
                            <Text>Final Sizing</Text>
                            <br />
                            <Input
                                style={{ width: '120px' }}
                                placeholder="Final Sizing"
                                onChange={(ev) => setSize(ev.target.value)}
                            />
                        </InfoBody>
                        <br />
                        {!showResults && info.length > 0 && (
                            <Button
                                disabled={disableBtn}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </div>
            )}
            <br />
            <br />
            {showResults && (
                <React.Fragment>
                    <div>
                        <InfoHeader>
                            <InfoText>Your Response(s)</InfoText>
                        </InfoHeader>
                        <div>
                            <InfoBody>
                                <Headergrid>
                                    {problem.header.map((item, index) => (
                                        <HeaderText key={index}>
                                            {item}
                                        </HeaderText>
                                    ))}
                                </Headergrid>
                                {info.map((elem, index) => (
                                    <InfoGrid key={index}>
                                        <AnswerText>{elem.type}</AnswerText>
                                        <AnswerText>
                                            {elem.description}
                                        </AnswerText>
                                        <AnswerText>{elem.value}</AnswerText>
                                    </InfoGrid>
                                ))}
                                <br />
                                <div>
                                    <SourceText>{`Final estimate: ${size}`}</SourceText>
                                </div>
                            </InfoBody>
                        </div>
                        <br />
                    </div>
                    <br />
                    <br />
                    <br />
                    <div>
                        <InfoHeader>
                            <InfoText>Our Suggested Answer(s)</InfoText>
                        </InfoHeader>
                        <div>
                            <InfoBody>
                                <Headergrid>
                                    {problem.header.map((item, index) => (
                                        <HeaderText key={index}>
                                            {item}
                                        </HeaderText>
                                    ))}
                                </Headergrid>
                                {problem.list.map((elem, index) => (
                                    <InfoGrid key={index}>
                                        <AnswerText>{elem.type}</AnswerText>
                                        <AnswerText>
                                            {typeof elem.description ===
                                            'string'
                                                ? elem.description
                                                : elem.description.map(
                                                      (x, i) => (
                                                          <div key={i}>{x}</div>
                                                      )
                                                  )}
                                        </AnswerText>
                                        <AnswerText>
                                            {typeof elem.value === 'string'
                                                ? elem.value
                                                : elem.value.map((x, i) => (
                                                      <div key={i}>{x}</div>
                                                  ))}
                                        </AnswerText>
                                    </InfoGrid>
                                ))}
                            </InfoBody>
                        </div>
                        <br />
                        <div>
                            <SourceText>{`Final estimate: ${problem['Final estimate']}`}</SourceText>
                            <br />
                            <SourceText>{`Source estimate sanity check: ${problem['Source estimate sanity check'].value}`}</SourceText>
                            (
                            <SourceText>
                                Source:{' '}
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={
                                        problem['Source estimate sanity check']
                                            .source_link
                                    }
                                >
                                    {
                                        problem['Source estimate sanity check']
                                            .source_text
                                    }
                                </a>
                            </SourceText>
                            )
                        </div>
                    </div>
                </React.Fragment>
            )}
            <br />
            <br />
            {showResults && problem['Follow up question'] && (
                <div>
                    <InfoHeader>
                        <InfoText>Follow up question</InfoText>
                    </InfoHeader>
                    <div>
                        <InfoBody>
                            <HeaderText>
                                {problem['Follow up question'].question}
                            </HeaderText>
                            <div>
                                <Radio.Group onChange={handleRadioChange} disabled={isFollowUpSubmit}>
                                    {problem['Follow up question'].options.map(
                                        (item, index) => (
                                            <Radio
                                                key={item}
                                                value={index}
                                                style={radioStyle}
                                            >
                                                {item}
                                            </Radio>
                                        )
                                    )}
                                </Radio.Group>
                                <br />
                                <div>
                                <br />
                                    {isFollowUpCorrect && isFollowUpSubmit && (
                                        <Title level={4}>
                                            Correct Answer !!
                                        </Title>
                                    )}
                                    {!isFollowUpCorrect && isFollowUpSubmit && (
                                        <Title level={4}>Wrong Answer !!</Title>
                                    )}
                                </div>

                                <br />
                                <div>
                                    {isFollowUpSubmit && (
                                        <Title
                                            level={5}
                                        >{`Explination : ${problem['Follow up question'].explanation}`}</Title>
                                    )}
                                </div>
                            </div>
                        </InfoBody>
                    </div>
                    <br />
                </div>
            )}
        </Wrapper>
    )
}
