import React, { Component } from 'react'

export default class Company extends Component {
    render() {
        return (
            <div>
                <select name='company_id' value={this.props.companyId} style={{backgroundColor: '#eee', minWidth: 150}} onChange={this.props.onChange}>
                    <option value='2'>Company 2</option>
                    <option value='3'>Company 3</option>
                    <option value='4'>Company 4</option>
                    <option value='5'>Company 5</option>
                </select>
            </div>
        )
    }
}
