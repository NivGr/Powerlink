import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

// this is a copy from TeamDetails component, could have done it a reusable file instead of copy paste
const LoadingDiv = styled.div`
    justify-content: center;
    text-align:center;  
    font-size: 25px;
    color: red;
`;

const Teams = props => {
    const history = useHistory();        
    const [teams, setTeams] = useState([]);

    useEffect(() => {                
        const proxyurl = "https://thingproxy.freeboard.io/fetch/" //secondary proxy: "https://cors-anywhere.herokuapp.com/";                        
        const urlByCountry = `https://api.soccersapi.com/v2.2/teams/?user=niv.gr89&token=938792b7ea599a76378fe1450a6bb0f0&t=list&country_id=4`;        
        let myTeams = [];        
        fetch(proxyurl + urlByCountry) // fetching all countries by country code 4 - only this api lets me fetch more than one team at a time
            .then(response => response.json())
            .then(({data}) => {
                for(let i = 0; i < 20; i++) { // took top 20 teams - to not overload calls to proxy and api 
                    let urlById = data && data[i] && `https://api.soccersapi.com/v2.2/teams/?user=niv.gr89&token=938792b7ea599a76378fe1450a6bb0f0&t=info&id=${data[i].id}`;                    
                    fetch(proxyurl + urlById) // looping through teams to call api by team Id for each one
                        .then(response => response.json())
                        .then(({data}) => {      
                            myTeams.push(data);
                            setTeams([...myTeams])                                                      
                        })
                        .catch(err => console.log(err))
                }
            })
            .catch(err => {
                console.log(err);
            });            
    }, [])

    const getTeamDetails = teamId => {
        const myTeam = teams.find( team => team && team.id === teamId);        
        myTeam && history.push(`/teams/${myTeam.id}`)
        return props.getTeam(myTeam);
    }

    if( teams.length === 0 ) {
        return (
            <LoadingDiv>
                Loading Teams...
            </LoadingDiv>
        )
    }
    return (
        <>        
            <Table>                
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Founded</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>                    
                     {teams.map( (team, index) => team &&
                        <tr style= {{ cursor: "pointer" }} key={team.id} onClick={getTeamDetails.bind(this, team.id)}>
                            <td>{team.name}</td>
                            <td>{team.founded}</td>
                            <td>{team.country.name}</td>                            
                        </tr>                        
                        )}                    
                </tbody>
            </Table>            
        </>
        
    )    
}

export default Teams;


