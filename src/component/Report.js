import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            company_id: 2,
            round_id: 0,
            product_id: '',
            products: [],
            qty: 1,
            id: this.props.match.params.id || 0
        }
    }

    componentDidMount() {
        this.setState({company_id: localStorage.getItem('company_id') || 2 })

        if (this.props.match.params) {
            this.setState({ round_id: this.props.match.params.id }, () => {
                this.retrieve()
            })
        }
    }

    retrieve = () => {
        let q = {
            company_id: this.state.company_id,
            round_id: this.state.round_id
        }
        let json = JSON.stringify(q)
        axios.post('../stockcount-api/retrieve_report.php', json).then(
            (res) => {
                if (res.data.success != 1) {
                    alert(res.data.message)
                }

                this.setState({ products: res.data.result })
            }
        )
    }

    render() {
        return (
            <div>
                <h1>Report</h1>
                <Link to='/' style={{float: 'right'}}>Back</Link>
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <td style={{width:220}}>Product ID </td>
                            <td >Product Name</td>
                            <td style={{width:120, textAlign: 'center'}}>Actual</td>
                            <td style={{width:120}}>System</td>
                            <td style={{width:120}}>Diff</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.products.map((v) => {
                                return (
                                    <tr key={v.report_id}>
                                        <td>{v.product_id}</td>
                                        <td>{v.product_name}</td>
                                        <td style={{ textAlign: 'center' }}>{v.sum_actual}</td>
                                        <td style={{textAlign: 'center'}}>{v.sum_system}</td>
                                        <td style={{ textAlign: 'center' }}>{v.sum_diff}</td>
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
