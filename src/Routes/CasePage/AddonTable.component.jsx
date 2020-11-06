import React from 'react'
import styled from 'styled-components'
import { Typography, Input } from 'antd'
const { Title, Text } = Typography

export const Table = styled.table`
    width: 100%;
    margin-top: 16px;
    border: 1px solid #d7cdcd;
    td,
    th {
        padding: 4px;
        border-right: 1px solid #d7cdcd;
    }
    tr {
        border-bottom: 1px solid #d7cdcd;
    }
`
const SubmitBtn = styled.div`
    &:hover {
        cursor: pointer;
    }
`

export default function AddonTable({
    addonTable,
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
            {Object.keys(addonTable).length > 0 && (
                <div>
                    <Title level={5}>{addonTable.question}</Title>
                    {addonTable.tableData.tables.map((table, i) => (
                        <Table key={i}>
                            <thead>
                                {table.title && (
                                    <tr>
                                        <th>{table.title}</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {table.rows.map((row, id) => (
                                    <tr key={id}>
                                        {row.columns.map((col, id) => (
                                            <td key={id}>{col.label}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ))}
                    {addonTable.expectInput && (
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
                </div>
            )}
        </div>
    )
}
