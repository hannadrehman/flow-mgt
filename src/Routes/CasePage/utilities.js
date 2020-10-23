export function getGroupedScore(list) {
    return list
        .filter((x) => x.score)
        .map((x) => x.score)
        .reduce(
            (accum, item) => {
                accum.judgment = accum.judgment + item.judgment
                accum.rigor = accum.rigor + item.rigor
                accum.structuring = accum.structuring + item.structuring
                accum.synthesis = accum.synthesis + item.synthesis
                return accum
            },
            { judgment: 0, rigor: 0, structuring: 0, synthesis: 0 }
        )
}

export function getNextLink(item, globalFlags) {
    if (item.is_link_direct === false) {
        const qid = item.conditionId
        switch (qid) {
            case 1:
                if (globalFlags.current.revenue_path_flag) {
                    return 'SlideAirlineQ3_121_6_0'
                } else {
                    return 'SlideAirlineQ3_121_2_0'
                }
            case 2:
                if (globalFlags.current.cost_path_flag === false) {
                    return 'SlideAirlineQ4_59_3_0'
                } else {
                    return 'SlideAirlineQ4_59_6_0'
                }

            case 3:
                if (globalFlags.current.non_ticket_revenue_path_flag) {
                    if (globalFlags.current.cost_path_flag === false) {
                        return 'SlideAirlineQ4_59_3_0'
                    } else {
                        return 'SlideAirlineQ4_59_6_0'
                    }
                } else {
                    if (globalFlags.current.cost_path_flag === false) {
                        return 'SlideAirlineQ4_59_5_0b'
                    } else {
                        return 'SlideAirlineQ4_59_5_0c'
                    }
                }
            default:
                alert('mismatch')
                return
        }
    }
    return item.links_to
}

export function transformRes(resp) {
    const json = { ...resp }
    Object.entries(json).forEach(([key, value]) => {
        if (value.choices && value.choices.length) {
            // console.log(key, value.choices)
            const scoreMap = {}
            value.choices.forEach((choice, index) => {
                const sum = Object.entries(choice.score)
                    .map(([k, v]) => v)
                    .reduce((acc, item) => (acc += item), 0)
                scoreMap[index] = sum
            })
            let maxIndex = null
            let maxScore = -100
            Object.entries(scoreMap).forEach(([k, v]) => {
                if (v > maxScore) {
                    maxScore = v
                    maxIndex = k
                }
            })
            value.choices[maxIndex].correctAnswer = true
        }
    })
    return json
}

const defaultFlags = {
    current: {
        revenue_path_flag: false,
        cost_path_flag: false,
        non_ticket_revenue_path_flag: false,
        ticket_revenue_path_flag: false,
    },
}

let globalFlags = defaultFlags

function setFlags(question) {
    if (question.revenue_path_flag || question.revenue_path_flag === false) {
        globalFlags.current.revenue_path_flag = question.revenue_path_flag
    }
    if (question.cost_path_flag || question.cost_path_flag === false) {
        globalFlags.current.cost_path_flag = question.cost_path_flag
    }
    if (
        question.non_ticket_revenue_path_flag ||
        question.non_ticket_revenue_path_flag === false
    ) {
        globalFlags.current.non_ticket_revenue_path_flag =
            question.non_ticket_revenue_path_flag
    }
    if (
        question.ticket_revenue_path_flag ||
        question.ticket_revenue_path_flag === false
    ) {
        globalFlags.current.ticket_revenue_path_flag =
            question.ticket_revenue_path_flag
    }
}

function getCorrectType(options, type) {
    let maxIndex = 0
    let maxScore = -100
    options.forEach((option, index) => {
        const typeScore = option.score[type] || 0
        if (typeScore > maxScore) {
            maxScore = typeScore
            maxIndex = index
        }
    })
    return options[maxIndex]
}

function tracePath(question, allQuestions, scores, type) {
    let nextQuestion = null
    if (!question.choices) {
        nextQuestion = allQuestions[getNextLink(question, globalFlags)]
    } else {
        const selectedOption = getCorrectType(question.choices, type)
        nextQuestion = allQuestions[getNextLink(selectedOption, globalFlags)]
        scores[type] += selectedOption.score[type]
    }
    tracePath(nextQuestion, allQuestions, scores, type)
}

export function getMaxScores(questions, id) {
    let initialQuestion = null
    initialQuestion =
        id === '1'
            ? 'SlideDrugProblemStatement'
            : 'SlideAirlineProblemStatement' //'SlideAirlineQ1_0'

    globalFlags = defaultFlags
    const scopes = { rigor: 0 }
    tracePath(questions[initialQuestion], questions, scopes, 'rigor')
}
