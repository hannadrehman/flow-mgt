import React from 'react'
import styled from 'styled-components'
import * as utils from './utilities'
import { Typography, Progress, Card, Tooltip } from 'antd'
import {
    Radar,
    RadarChart,
    PolarGrid,
    Legend,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts'

const { Text, Title } = Typography

const Wrapper = styled.div``
const Mains = styled.div`
    display: flex;
`
const Average = styled.div`
    padding: 8px;
`
const Bars = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`
const Bar = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    min-height: 120px;
    justify-content: space-evenly;
    &:nth-child(2n + 2) {
        padding-left: 28px;
    }
    &:nth-child(n + 3) {
        margin-top: 40px;
    }
`
const Heading = styled.div`
    padding-bottom: 16px;
`

const AvgCard = styled(Card)`
    width: 200px;
    height: 100%;
    margin-right: 16px;
    .ant-card-body {
        display: flex;
        align-content: center;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 0;
        height: 200px;
    }
`
const LargeText = styled.div`
    font-size: 48px;
    font-weight: bold;
`
const ChartWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
`
const Charter = styled.div``

export default function Score({ usersScore, maxScore, caseDetails }) {
    const graph = React.useMemo(() => {
        let max = -100
        Object.entries(maxScore).forEach(([, v]) => {
            if (v > max) {
                max = v
            }
        })
        const data = [
            {
                subject: 'Judgment',
                average: maxScore.synthesis - 4,
                user: usersScore.judgment,
                fullMark: maxScore.judgment,
            },
            {
                subject: 'Rigor',
                average: maxScore.synthesis - 3,
                user: usersScore.rigor,
                fullMark: maxScore.rigor,
            },
            {
                subject: 'Structuring',
                average: maxScore.synthesis - 2,
                user: usersScore.structuring,
                fullMark: maxScore.structuring,
            },
            {
                subject: 'Synthesis',
                average: maxScore.synthesis - 5,
                user: usersScore.synthesis,
                fullMark: maxScore.synthesis,
            },
        ]
        return { data, max }
    }, [maxScore, usersScore])
    return (
        <Wrapper>
            <Heading>
                <Title level={3}>
                    {`You are done! Congratulations on completing the ${caseDetails.title}. Here is how we think you fared Score`}
                </Title>
            </Heading>
            <Mains>
                <Average>
                    <AvgCard title="Weighted average">
                        <LargeText>
                            {utils.getWeightedScore(usersScore, maxScore)}
                        </LargeText>
                    </AvgCard>
                </Average>
                <Bars>
                    {Object.keys(maxScore).map((item) => (
                        <Bar>
                            <Text>
                                <b>{`${item.toUpperCase()} : `}</b>{' '}
                                {utils.getTypeText(item)}
                            </Text>
                            <Tooltip
                                title={`${usersScore[item]} out of ${maxScore[item]}`}
                            >
                                <Progress
                                    percent={utils.getPercent(
                                        maxScore[item],
                                        usersScore[item]
                                    )}
                                    strokeColor={utils.getColor(
                                        utils.getPercent(
                                            maxScore[item],
                                            usersScore[item]
                                        )
                                    )}
                                    status="active"
                                />
                            </Tooltip>
                        </Bar>
                    ))}
                </Bars>
            </Mains>
            <ChartWrapper>
                <Charter>
                    <RadarChart
                        cx={300}
                        cy={250}
                        outerRadius={150}
                        width={500}
                        height={500}
                        data={graph.data}
                    >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis />
                        <Radar
                            name="You"
                            dataKey="user"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                        />
                        <Radar
                            name="Average"
                            dataKey="average"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.6}
                        />
                        <Legend />
                    </RadarChart>
                </Charter>
            </ChartWrapper>
        </Wrapper>
    )
}
