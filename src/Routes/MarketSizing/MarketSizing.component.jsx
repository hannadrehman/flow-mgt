import React from 'react'
import styled from 'styled-components'
import { Button, PageHeader, Popconfirm, Typography, Select, Input } from 'antd'
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons'
import { useHistory, useParams } from 'react-router-dom'
import { marketSizingList } from '../ListPage/list'

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

export default function MarketSizing() {
    const { push } = useHistory()
    const { id } = useParams()
    const [problems, setProblems] = React.useState(defInfo)
    const [info, setInfo] = React.useState([defInfo])
    const [size, setSize] = React.useState()
    const [showResults, setShowResults] = React.useState(false)

    React.useEffect(() => {
        async function getData() {
            try {
                const res = await fetch(
                    `http://app.casesninja.com/json/final_market_sizing-${id}.json`,
                    {}
                )
                const resp = await res.json()
                setProblems(resp)
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [id])

    const item = marketSizingList.find((e) => e.id.toString() === id)

    function handleBack(id) {
        push(`/list/market`)
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
    }

    return (
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
                <Title level={3}>{item.title}</Title>
                <div
                    dangerouslySetInnerHTML={createMarkup(
                        item.detailedDescription
                    )}
                />
            </div>
            <br />
            {!showResults && (
                <div>
                    <InfoHeader>
                        <InfoText>Your Response(s)</InfoText>
                    </InfoHeader>
                    <div>
                        <InfoBody>
                            <Headergrid>
                                <HeaderText>Type</HeaderText>
                                <HeaderText>Description</HeaderText>
                                <HeaderText>Value(s)</HeaderText>
                            </Headergrid>
                            {info.map((elem) => (
                                <InfoGrid key={elem.id}>
                                    <HeaderText>
                                        <Select
                                            style={{ width: 120 }}
                                            onChange={(ev) =>
                                                handleTypeChange(ev, elem.id)
                                            }
                                            placeholder="Select"
                                        >
                                            <Option value="jack">Jack</Option>
                                            <Option value="lucy">Lucy</Option>
                                            <Option value="Yiminghe">
                                                yiminghe
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
                        <Button type="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>
                </div>
            )}
        </Wrapper>
    )
}
