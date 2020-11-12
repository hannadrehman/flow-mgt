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
        value.questionId = key;
        if (value.choices && value.choices.length) {
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
            // console.log('q: ',key,'correct index : ',maxIndex, 'correct score: ', value.choices[maxIndex].score)
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

export function setFlags(question, flags) {
    if (question.revenue_path_flag || question.revenue_path_flag === false) {
        flags.current.revenue_path_flag = question.revenue_path_flag
    }
    if (question.cost_path_flag || question.cost_path_flag === false) {
        flags.current.cost_path_flag = question.cost_path_flag
    }
    if (
        question.non_ticket_revenue_path_flag ||
        question.non_ticket_revenue_path_flag === false
    ) {
        flags.current.non_ticket_revenue_path_flag =
            question.non_ticket_revenue_path_flag
    }
    if (
        question.ticket_revenue_path_flag ||
        question.ticket_revenue_path_flag === false
    ) {
        flags.current.ticket_revenue_path_flag =
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
        const table = allQuestions[question.addOnTable]
        if(table && table.expectInput){
            scores[type] += table.score[type]
        }
        if(question.bulletData && question.expectInput){
            scores[type] += question.score[type]
        }
        nextQuestion = allQuestions[getNextLink(question, globalFlags)]
    } else {
        const selectedOption = getCorrectType(question.choices, type)
        nextQuestion = allQuestions[getNextLink(selectedOption, globalFlags)]
        scores[type] += selectedOption.score[type]
    }
    setFlags(nextQuestion, globalFlags)
    if (!nextQuestion.successMessage) {
        tracePath(nextQuestion, allQuestions, scores, type)
    }
}

export function getMaxScores(questions, id) {
    let initialQuestion = null
    initialQuestion =
        id === '1'
            ? 'SlideDrugProblemStatement'
            : 'SlideAirlineProblemStatement'

    globalFlags = defaultFlags
    const scores = { rigor: 0, judgment: 0, structuring: 0, synthesis: 0 }
    tracePath(questions[initialQuestion], questions, scores, 'rigor')
    globalFlags = defaultFlags
    tracePath(questions[initialQuestion], questions, scores, 'judgment')
    globalFlags = defaultFlags
    tracePath(questions[initialQuestion], questions, scores, 'structuring')
    globalFlags = defaultFlags
    tracePath(questions[initialQuestion], questions, scores, 'synthesis')
    return scores
}

export function getPercent(total, achieved) {
    return Math.ceil((achieved / total) * 100)
}

export function getColor(percentage) {
    if (percentage > 70) {
        return '#4caf50'
    }
    if (percentage > 30) {
        return '#ffc107'
    }
    return '#f44336'
}

const typesText = {
    judgment: 'indicating your intuition in making choices',
    rigor: 'indicating your quantitative decision making',
    structuring: 'indicating your organization of thoughts/idea',
    synthesis: 'ability to convey more in less',
}
export function getTypeText(type) {
    return typesText[type]
}

export function getWeightedScore(userScore, totalScore) {
    // ((100*user_rigor_score)/max_rigor_calculated_value) *assigned_weight
    const judgment = ((100 * userScore.judgment) / totalScore.judgment) * 0.25
    const rigor = ((100 * userScore.rigor) / totalScore.rigor) * 0.25
    const structuring =
        ((100 * userScore.structuring) / totalScore.structuring) * 0.25
    const synthesis =
        ((100 * userScore.synthesis) / totalScore.synthesis) * 0.25
    return Math.ceil(judgment + rigor + structuring + synthesis);    
}


export function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    const ms = minutes>1 ?'minutes': 'minute';
    const ss = seconds > 1 ? 'seconds': 'second'
    return `${minutes} ${ms}, ${seconds} ${ss}`;
  }
