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
            company_id: 2,
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
        this.setState({ company_id: localStorage.getItem('company_id') || 2 }, () => {
            this.retrieve()
        })
    }

    retrieve = () => {
        let q = {
            company_id: this.state.company_id
        }
        let json = JSON.stringify(q)
        axios.post('stockcount-api/retrieve_round.php', json).then(
            (res) => {
                if (res.data.success != 1) {
                    alert(res.data.message)
                }

                let temp = []
                res.data.result.forEach((v) => {
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
        let type = this.state.modalType

        let q = {
            company_id: this.state.company_id,
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
                if(type == 'sub_round') this.showDetail(q.id, 1)
                else this.retrieve()
            }
        )

        this.handleClose()
    }

    onKeyDown = (e) => { 
        if (e.which == 13) this.createRound()
    }

    showDetail = (id, load) => {
        let sub_round_show = this.state.sub_round_show.concat(id)
        if (this.state.sub_round[id] && !load) {
            this.setState({ sub_round_show: sub_round_show })
            return false
        }

        let q = {
            company_id: this.state.company_id,
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
                this.setState({ sub_round_show: sub_round_show })
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

    deleteRound = (type, id, round_id) => {
        if(!window.confirm('Are you sure?')) return false;

        let q = {
            company_id: this.state.company_id,
            id: id
        }

        let url = 'stockcount-api/delete_round.php'
        if (type == 'sub_round') {
            url = 'stockcount-api/delete_sub_round.php'
        }

        let json = JSON.stringify(q)
        axios.post(url, json).then(
            (res) => {
                if (res.data.success != 1) {
                    alert(res.data.message)
                }

                if (type == 'sub_round') {
                    round_id = round_id.replace('.1', '')
                    this.showDetail(round_id, 1)
                }
                else this.retrieve()
            }
        )
    }

    render() {
        return (
            <div>
                <h1>Stockcount</h1>
                <br />
                <Button variant="primary" style={{ marginBottom: 15, marginLeft: 15 }} onClick={() => this.handleShow('round')}>
                    Create Round
                </Button>
                <table className='table'>
                    <thead>
                        <tr>
                            <th style={{width:50}}>#</th>
                            <th>Name</th>
                            <th style={{width:200}}>วันที่สร้าง</th>
                            <th style={{width:200}}></th>
                            <th style={{width:50}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.round.map((v) => {
                                let show = this.state.sub_round_show.indexOf(v.round_id.replace('.1', '')) != -1 ? true : false
                                if(v.round_id.indexOf('.1') == -1) {
                                    return (
                                        <tr key={v.round_id}>
                                            <td>
                                                <button className='btn btn-sm btn-success' style={{ display: !show ? '' : 'none' }} onClick={() => { this.showDetail(v.round_id) }}><i className='fa fa-plus' /></button>
                                                <button className='btn btn-sm btn-danger' style={{display: show ? '' : 'none'}} onClick={() => { this.hideDetail(v.round_id) }}><i className='fa fa-minus' /></button>
                                            </td>
                                            <td>{v.name}</td>
                                            <td>{v.create_dt}</td>
                                            <td>
                                                <Button variant="secondary" size='sm' onClick={() => this.handleShow('sub_round', v.round_id)}>
                                                    Create Sub Round
                                                </Button>
                                            </td>
                                            <td>
                                                <Button variant="danger" size='sm' onClick={() => this.deleteRound('round', v.round_id)}>
                                                    <i className='fa fa-trash' />
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                } else {
                                    let detail = this.state.sub_round[v.round_id.replace('.1', '')]
                                    let html = (
                                        <tr>
                                            <td colSpan='5'><center>No data</center></td>
                                        </tr>
                                    )
                                    if(detail && detail.length > 0) {
                                        html = (
                                            detail.map((v2, k2) => {
                                                return(
                                                    <tr key={v2.sub_round_id}>
                                                        <td>{k2+1}</td>
                                                        <td>{v2.name}</td>
                                                        <td>{v2.create_dt}</td>
                                                        <td style={{textAlign: 'center'}}>
                                                            <Link to={`/manage/${v2.sub_round_id}`}>Manage</Link>
                                                        </td>
                                                        <td style={{textAlign: 'center'}}>
                                                            <Button variant="danger" size='sm' onClick={() => this.deleteRound('sub_round', v2.sub_round_id, v.round_id)}>
                                                                <i className='fa fa-trash' />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )
                                    }
                                    return (
                                        <tr key={v.round_id} style={{display: show ? '' : 'none'}}>
                                            <td colSpan='5' style={{ paddingLeft: 80, paddingRight: 80}}>
                                                <table className='table table-sm table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <td style={{width:50}}>#</td>
                                                            <td>Name</td>
                                                            <td style={{width:100}}>วันที่สร้าง</td>
                                                            <td style={{width:100}}></td>
                                                            <td style={{width:50}}></td>
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
