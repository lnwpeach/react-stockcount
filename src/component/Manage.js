import React, { Component } from 'react'
import axios from 'axios'
import {Button} from 'react-bootstrap'

export default class Manage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sub_round_id: 0,
            product_id: '',
            products: [],
            qty: 1
        }

    }

    componentDidMount() {
        if (this.props.match.params) {
            this.setState({ sub_round_id: this.props.match.params.id }, () => {
                this.retrieve()
            })
        }
        
    }

    retrieve = () => {
        let q = {
            company_id: 2,
            sub_round_id: this.state.sub_round_id
        }
        let json = JSON.stringify(q)
        axios.post('../stockcount-api/retrieve_product.php', json).then(
            (res) => {
                if (res.data.success != 1) {
                    alert(res.data.message)
                }

                this.setState({ products: res.data.result })
            }
        )
    }

    search_product = () => {
        let q = {
            company_id: 2,
            sub_round_id: this.state.sub_round_id,
            product_id: this.state.product_id,
            qty: this.state.qty
        }
        let json = JSON.stringify(q)
        axios.post('../stockcount-api/search_product.php', json).then(
            (res) => {
                if (res.data.success != 1) {
                    alert(res.data.message)
                }

                this.setState({ product_id: '', qty: 1 })
                this.retrieve()
            }
        )
    }

    delete_product = (id) => {
        if (!window.confirm('Are you sure?')) return false;
        
        let q = {
            company_id: 2,
            id: id
        }
        let json = JSON.stringify(q)
        axios.post('../stockcount-api/delete_product.php', json).then(
            (res) => {
                if (res.data.success != 1) {
                    alert(res.data.message)
                }

                this.retrieve()
            }
        )
    }

    onKeyDown = (e) => {
        if(e.which === 13) {
            this.search_product()
            this.product_id.value = ''
            this.product_id.focus()
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        return (
            <div>
                <h1>Manage</h1>
                <br />
                <div style={{textAlign: 'center', marginBottom: 15}}>
                    <label>Product ID: </label>
                    <input name='product_id' type='text' ref={(input) => {this.product_id = input}} style={{width:250, marginLeft:15}} placeholder='Type Barcode and Press Enter' onChange={this.onChange} onKeyDown={this.onKeyDown} />
                    <label style={{marginLeft:15}}>QTY: </label>
                    <input name='qty' type='text' value={this.state.qty} style={{width:60, marginLeft:15, textAlign: 'center'}} onChange={this.onChange} onKeyDown={this.onKeyDown} />
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <td style={{width:120}}>Product ID</td>
                            <td>Product Name</td>
                            <td style={{width:100, textAlign: 'center'}}>QTY</td>
                            <td style={{width:50}}></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((v) => {
                                return (
                                    <tr key={v.item_id}>
                                        <td>{v.product_id}</td>
                                        <td>{v.product_name}</td>
                                        <td style={{textAlign: 'center'}}>{v.qty}</td>
                                        <td>
                                            <Button variant='danger' size='sm' onClick={() => {this.delete_product(v.item_id)}}>
                                                <i className='fa fa-trash' />
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}
