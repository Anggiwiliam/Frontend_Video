import React from 'react'
import  { 
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import Home from './screen/home/home'
import Share from './screen/share/share'

class App extends React.Component{
  render(){
    return(
      <Router>
        <Route exact path ={'/'} component={Home}/>
        <Route exact path ={'/share'} component={Share}/>
      </Router>
    )
  }
}

export default App