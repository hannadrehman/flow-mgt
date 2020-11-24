import React from 'react'
import { Modal } from 'antd'

const map = {
    detailsPage: `Once you have read the case problem in detail, you will see two options. You can choose either of them.
    <br />
    <br />
    <b>Ask Clarifying Questions:</b> here you can view a list of questions you might want to clear before defining your approach to solve the case 
    <br />
    <br />
    <b>Create Structure:</b> on clicking this, you will be directly given a  blank template where you can fill in your planned structure 
    `,
    clearifyingQuestionsPage: `On this page, you can choose to select any of the displayed questions to gain further clarity.
    <br />
    <br />
    <b>Pro tip:</b> Be conscious to choose the right questions that will help in creating your approach/structure to solve the problem. Interviewers generally judge you on the questions you ask. 
    `,
    createStructurePage: `You can now go ahead and structure your thoughts in the tree below. Remember to think through various aspects you may want to consider. 
    <br />
    <br />
    <b>Pro Tip:</b> Ensure that you take between 1 and 2 mins maximum for this exercise. Any more and you might disengage the interviewer. 
    `,
    successPage: `Congrats on completing the case. Here you can review various aspects of your performance: 
    <br />
    <br />
    <b>A) Score:</b> Review your overall performance across various parameters and compare how you fare against your peers 
    <br />
    <br />
    <b>B)Structure:</b>  Compare your crafted structure to our recommended structure trees and other options 
    <br />
    <br />
    <b>C) Review:</b> Analyze questions where we think you could have chosen a strategically better answer 
    <br />
    <br />
    <b>D) Relevance:</b> Undertand the relevance of each question you asked and reasoning behind it 
    `,
}

function createMarkup(html) {
    return { __html: html }
}

export default function HelpModal({ type }) {
    const [show, setShow] = React.useState(
        !!sessionStorage.getItem(`modal_${type}`) ? false : true
    )
    function handleClose() {
        setShow(false)
        sessionStorage.setItem(`modal_${type}`, true)
    }
    return (
        <Modal
            title={null}
            visible={show}
            onOk={handleClose}
            onCancel={handleClose}
            okText="Got it!"
            cancelText="Skip"
        >
            <div dangerouslySetInnerHTML={createMarkup(map[type])}></div>
        </Modal>
    )
}
