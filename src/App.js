import React, { Component } from 'react'
import Stockcount from './component/Stockcount'
import Manage from './component/Manage'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Company from './component/Company'

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company_id: localStorage.getItem('company_id') || 2
        }
    }

    onChange = (e) => {
        this.setState({ company_id: e.target.value })
        localStorage.setItem('company_id', e.target.value);
        window.location = '/';
    }

    render() {
        return (
            <Router>
                <div style={{margin: 15}}>
                    <Company companyId={this.state.company_id} onChange={this.onChange} />
                </div>
                <div style={{margin: 50}}>
                    <Route exact path='/' component={Stockcount} />
                    <Route exact path='/manage/:id' component={Manage} />
                </div>
            </Router>
        )
    }
}
