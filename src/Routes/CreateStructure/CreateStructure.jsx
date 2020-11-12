import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Typography, Button, PageHeader, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { staticData } from '../../Cases.fixtures'
import { useInterval } from '../../hooks/timers'
import HelpModal from '../HelpModal/HelpModal.component';

const { Text } = Typography

const Wrapper = styled.div`
    margin: 0 auto;
`
const Header = styled.div`
    border-bottom: 1px solid #eadddd;
`
const Body = styled.div`
    margin-top: 16px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    border: 1px solid lightgray;
    padding: 16px;
`
const Structure = styled.div`
    margin-top: 16px;
    display: flex;
    padding: 16px 0px;
    overflow: auto;
    flex-wrap: wrap;
`
const AddStructure = styled.div`
    height: 32px;
    display: flex;
    align-items: center;
    margin-left: 8px;
`
const RootNodeContainer = styled.div``
const ChildNodeContainer = styled.div``
const RootNode = styled.div`
    width: 300px;
`
const ChildNode = styled.div`
    display: flex;
    align-items: center;
    margin-top: 8px;
    position: relative;
    width: 300px;
`
const Box = styled.div`
    height: 32px;
    width: 32px;
        &:before {
            position: absolute;
            height: 32px;
            margin-left: 11px;
            border-left: 1px solid #d9d9d9;
            content: " ";
        }
        &:after {
            position: absolute;
            width: 17px;
            height: 16px;
            margin-left: 11px;
            border-bottom: 1px solid #d9d9d9;
            content: " ";
    }
    }
`
const Tree = styled.div`
    margin-right: 24px;
    margin-bottom: 80px;
`
function createMarkup(html) {
    return { __html: html }
}

const defaultTree = [
    {
        id: 0,
        children: [{ id: 0 }, { id: 1 }, { id: 2 }],
    },
    {
        id: 1,
        children: [{ id: 0 }, { id: 1 }, { id: 2 }],
    },
    {
        id: 2,
        children: [{ id: 0 }, { id: 1 }, { id: 2 }],
    },
]
const defaultInput = [
    {
        id: 0,
        children: [
            { id: 0, value: '' },
            { id: 1, value: '' },
            { id: 2, value: '' },
        ],
    },
    {
        id: 1,
        children: [
            { id: 0, value: '' },
            { id: 1, value: '' },
            { id: 2, value: '' },
        ],
    },
    {
        id: 2,
        children: [
            { id: 0, value: '' },
            { id: 1, value: '' },
            { id: 2, value: '' },
        ],
    },
]

export default function CreateStructure() {
    const { goBack, push } = useHistory()
    const { id } = useParams()
    const [treeData, setTreeData] = React.useState(defaultTree)
    const inputRefs = React.useRef(defaultInput)
    const timeElapsed = React.useRef(0)
    useInterval(() => {
        timeElapsed.current += 500
    }, 500)

    function handleClick(id) {
        localStorage.setItem(
            'structure',
            JSON.stringify(inputRefs.current || {})
        )
        localStorage.setItem('structureTime', timeElapsed.current)
        push(`/case/${item.id}`)
    }
    function handleNodeEnterPress(ev) {
        console.log('called')
        const rootId = ev.target.id.split('_')[1]
        const child = {
            id: treeData[rootId].children.length,
        }
        const child2 = {
            id: treeData[rootId].children.length,
        }
        const newTreeData = [...treeData]
        newTreeData[rootId].children.push(child)
        setTreeData(newTreeData)
        inputRefs.current[rootId].children.push(child2)
        setTimeout(() => {
            const lastTextBox = document.getElementById(
                `root_${rootId}_child_${
                    inputRefs.current[rootId].children.length - 1
                }`
            )
            lastTextBox.focus()
        }, 100)
    }
    function handleAddNewBucket() {
        const child = {
            id: treeData.length,
            children: [{ id: 0 }, { id: 1 }, { id: 2 }],
        }
        const child2 = {
            id: treeData.length,
            children: [
                { id: 0, value: '' },
                { id: 1, value: '' },
                { id: 2, value: '' },
            ],
        }
        const tree = [...treeData]
        tree.push(child)
        setTreeData(tree)
        inputRefs.current.push(child2)
        setTimeout(() => {
            const lastTextBox = document.getElementById(
                `root_${tree.length - 1}`
            )
            lastTextBox.focus()
        }, 100)
    }
    const item = staticData.find((e) => e.id.toString() === id)

    function handleInputChange(ev) {
        const { id, value } = ev.target
        const [, rootId, , childId = null] = id.split('_')

        if (!childId) {
            inputRefs.current[rootId].value = value
        } else {
            inputRefs.current[rootId].children[childId].value = value
        }
    }
    return (
        <Wrapper>
            <Header>
                <PageHeader subTitle="Back to Case" onBack={goBack} />
            </Header>
            <Body>
                <div
                    dangerouslySetInnerHTML={createMarkup(
                        item.detailedDescription
                    )}
                />
            </Body>
            <Structure>
                {treeData.map((tree) => (
                    <Tree key={tree.id}>
                        <RootNodeContainer>
                            <RootNode>
                                <Input
                                    placeholder={`Bucket ${tree.id + 1}`}
                                    autoComplete="false"
                                    onPressEnter={handleNodeEnterPress}
                                    id={`root_${tree.id}`}
                                    onChange={handleInputChange}
                                />
                            </RootNode>
                        </RootNodeContainer>
                        <ChildNodeContainer>
                            {tree.children.map((child) => (
                                <ChildNode key={child.id}>
                                    <Box />
                                    <Input
                                        placeholder="Sub topic"
                                        autoComplete="false"
                                        onPressEnter={handleNodeEnterPress}
                                        id={`root_${tree.id}_child_${child.id}`}
                                        onChange={handleInputChange}
                                    />
                                </ChildNode>
                            ))}
                        </ChildNodeContainer>
                    </Tree>
                ))}
                <AddStructure onClick={handleAddNewBucket}>
                    <PlusCircleOutlined /> &nbsp;&nbsp;
                    <Text>Add a new bucket</Text>
                </AddStructure>
            </Structure>
            <br />
            <Button type="primary" block onClick={handleClick}>
                Submit
            </Button>
        <HelpModal type="CreateStructurePage" />

        </Wrapper>
    )
}
