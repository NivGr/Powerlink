import React, { useState } from 'react';
import './App.css';
import Teams from './components/Teams';
import TeamDetails from './components/TeamDetails';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';


const App = () => {    
  const [team, setTeam] = useState('');  
  
  
  const getTeamId = (clickedTeam) => {        
    setTeam(clickedTeam);
  }

  return (
    <Router>  
      <Switch>
      <Route exact path="/teams" component={Teams}>
          <Teams getTeam={(clickedTeam) => getTeamId(clickedTeam)}/>
        </Route>  
        <Route path={`/teams/:${team.id}`}>
          <TeamDetails myTeam={team}/>
        </Route>                         
        <Route path="/">
            <Redirect to="/teams" />
        </Route>
      </Switch>          
    </Router>
  );
}

export default App;
