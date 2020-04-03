import React, { Component } from 'react'
import Stockcount from './component/Stockcount'
import Manage from './component/Manage'
import {BrowserRouter as Router, Route} from 'react-router-dom'

export default class App extends Component {


  render() {
    return (
      <Router>
        <div style={{margin: 50}}>
          <Route exact path='/' component={Stockcount} />
          <Route exact path='/manage/:id' component={Manage} />
        </div>
      </Router>
    )
  }
}
