import React, { Component } from 'react'
import '../assets/font-awesome/css/font-awesome.css'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import CreateModal from './CreateModal'
import {Link} from 'react-router-dom'

export default class Stockcount extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            modalType: '',
            round_id: 0,
            name: '',
            round: [],
            sub_round: {},
            sub_round_show: []
        }

    }

    componentDidMount() {
        this.retrieve()
    }

    retrieve = () => {
        let q = {
            company_id: 2,
            name: this.state.name
        }
        let json = JSON.stringify(q)
        axios.post('stockcount-api/retrieve_round.php', json).then(
            (res) => {
                if (res.data.success != 1) {
                    alert(res.data.message)
                }

                let temp = []
                res.data.result.map((v) => {
                    temp.push(v)
                    temp.push({round_id: v.round_id+'.1'})
                })
                this.setState({round: temp});
            }
        )
    }

    handleShow = (type, id=0) => {
        this.setState({ showModal: true, modalType: type, round_id: id });
    }
    handleClose = () => this.setState({ showModal: false, modalType: '', round_id: 0 });

    nameChange = (e) => {
        this.setState({ name: e.target.value })
    }

    createRound = () => {
        // console.log(this.state.modalType)
        let type = this.state.modalType

        let q = {
            company_id: 2,
            name: this.state.name
        }

        let url = 'stockcount-api/create_round.php'
        if (type == 'sub_round') {
            q.id = this.state.round_id
            url = 'stockcount-api/create_sub_round.php'
        }

        let json = JSON.stringify(q)
        axios.post(url, json).then(
            (res) => {
                if(res.data.success != 1) {
                    alert(res.data.message)
                }
                this.retrieve()
            }
        )

        this.handleClose()
    }

    onKeyDown = (e) => { 
        if (e.which == 13) this.createRound()
    }

    showDetail = (id) => {
        let sub_round_show = this.state.sub_round_show.concat(id)
        this.setState({ sub_round_show: sub_round_show })
        if (this.state.sub_round[id]) {
            return false
        }

        let q = {
            company_id: 2,
            id: id
        }

        let url = 'stockcount-api/retrieve_sub_round.php'
        let json = JSON.stringify(q)
        axios.post(url, json).then(
            (res) => {
                if (res.data.success != 1) {
                    alert(res.data.message)
                }

                let sub_round = this.state.sub_round
                sub_round[id] = res.data.result
                this.setState({ sub_round: sub_round })
            }
        )
    }

    hideDetail = (id) => {
        let sub_round_show = this.state.sub_round_show
        let index = sub_round_show.indexOf(id)
        if(index > -1) {
            sub_round_show.splice(index, 1)
            this.setState({ sub_round_show: sub_round_show})
        }
    }

    render() {
        return (
            <div>
                <Button variant="primary" style={{ marginBottom: 15, marginLeft: 15 }} onClick={() => this.handleShow('round')}>
                    Create Round
                </Button>
                <table className='table'>
                    <thead>
                        <tr>
                            <th style={{width:50}}>#</th>
                            <th>Name</th>
                            <th style={{width:200}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.round.map((v) => {
                                let show = this.state.sub_round_show.indexOf(v.round_id.replace(/.1/, '')) != -1 ? true : false
                                if(v.round_id.indexOf('.1') == -1) {
                                    return (
                                        <tr key={v.round_id}>
                                            <td>
                                                <button className='btn btn-sm btn-success' style={{ display: !show ? '' : 'none' }} onClick={() => { this.showDetail(v.round_id) }}><i className='fa fa-plus' /></button>
                                                <button className='btn btn-sm btn-danger' style={{display: show ? '' : 'none'}} onClick={() => { this.hideDetail(v.round_id) }}><i className='fa fa-minus' /></button>
                                            </td>
                                            <td>{v.name}</td>
                                            <td>
                                                <Button variant="secondary" size='sm' onClick={() => this.handleShow('sub_round', v.round_id)}>
                                                    Create Sub Round
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                } else {
                                    let detail = this.state.sub_round[v.round_id.replace(/.1/, '')]
                                    let html = (
                                        <tr>
                                            <td colSpan='3'><center>No data</center></td>
                                        </tr>
                                    )
                                    if(detail && detail.length > 0) {
                                        html = (
                                            detail.map((v2, k2) => {
                                                return(
                                                    <tr key={v2.sub_round_id}>
                                                        <td>{k2+1}</td>
                                                        <td>{v2.name}</td>
                                                        <td style={{textAlign: 'center'}}>
                                                            <Link to='/manage'>Manage</Link>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                    return (
                                        <tr key={v.round_id} style={{display: show ? '' : 'none'}}>
                                            <td colSpan='3' style={{ paddingLeft: 80, paddingRight: 80}}>
                                                <table className='table table-sm table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <td style={{width:50}}>#</td>
                                                            <td>Name</td>
                                                            <td style={{width:100}}></td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {html}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )
                                }
                                
                            })
                        }
                    </tbody>
                </table>
                    
                <CreateModal show={this.state.showModal} onHide={this.handleClose} save={this.createRound} change={this.nameChange} keyDown={this.onKeyDown} />
            </div>
        )
    }
}
