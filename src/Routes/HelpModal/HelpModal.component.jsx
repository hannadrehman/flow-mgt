import React from 'react'
import { Modal } from 'antd'

export default function HelpModal({ type }) {
		const [show,setShow] = React.useState(!!sessionStorage.getItem(`modal_${type}`) ? false : true)
		function handleClose(){
			setShow(false);
			sessionStorage.setItem(`modal_${type}`,true)
		}
		return (
        <Modal
            title="Introduction"
            visible={show}
            onOk={handleClose}
						onCancel={handleClose}
						okText="Got it!"
						cancelText="Skip"
        >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Modal>
    )
}
