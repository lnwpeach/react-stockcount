import React, { Component } from 'react'
import { Modal, Button } from 'react-bootstrap'

export default class CreateModal extends Component {
    render() {
        return (
            <div>
                <Modal {...this.props} onShow={() => { this.nameInput.focus() }}>
                    <Modal.Header closeButton>
                        <Modal.Title>System Response</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Name:
                    <input type='text' name='name' ref={(input) => this.nameInput = input} className='form-control' onChange={this.props.change} onKeyDown={this.props.keyDown} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.props.onHide}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.props.save}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
