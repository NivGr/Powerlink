import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const TeamDiv = styled.div`    
    justify-content: center;
    text-align:center;
    padding: 10px;
    border: 2px solid #ccc;
    border-radius: 40px;
`;

const TeamImg = styled.img`
    width: 70px;
    height: 70px; 
`;

const SquadDiv = styled.div`
    margin-top: 10px;
    justify-content: center;
    text-align:center;            
`;

const LoadingDiv = styled.div`
    justify-content: center;
    text-align:center;  
    font-size: 25px;
    color: red;
`;


const TeamDetails = props => {  
    const [team, setTeam] = useState({});
    const [squad, setSquad] = useState([]);
    const [isNoSquad, setIsNoSquad] = useState(true);
    let location = useLocation()

    useEffect(() => {     
        let fallBackTeamId = location.pathname.substr(location.pathname.lastIndexOf('/'));
        
        // proxy url due to CORS issues fetching from api from react
        const proxyurl = "https://thingproxy.freeboard.io/fetch/"  // secondary proxy: "https://cors-anywhere.herokuapp.com/";                              
        let teamUrlById = `https://api.soccersapi.com/v2.2/teams/?user=niv.gr89&token=938792b7ea599a76378fe1450a6bb0f0&t=info&id=${props.myTeam.id || fallBackTeamId}`;              
       
        fetch(proxyurl + teamUrlById)
            .then(response => response.json())
            .then(({data}) => {                                         
                let squadUrllById = `https://api.soccersapi.com/v2.2/teams/?user=niv.gr89&token=938792b7ea599a76378fe1450a6bb0f0&t=squad&id=${data.id}&season_id=${data.leagues && data.leagues[0].current_season_id}`;                
                fetch(proxyurl + squadUrllById)                
                    .then(response => response.json())
                    .then(({data}) => {
                        if(data && data.squad && data.squad.length > 0) {                                    
                            setSquad(data && data.squad);
                        } 
                    }).catch(err => console.log(err))
                setTeam(data)
            })
            .catch(err => {
                console.log(err);
            });            
            // this api doesnt hold team's website, so in line 73 - I directed to "let me google that for you" instead. 
            stopLookingForSquad();                       
      
    }, [])

    const stopLookingForSquad = () => {
        // api returns squad as empty array which is the same as initiated value in state
        // waiting for two seconds in which displaying "looking for squad"
        // IF: fetching the squad - relevant table is displayed,
        // ELSE IF: after two seconds we couldn't fetch squad - will display "no squad found" 
        setTimeout(() => {
            setIsNoSquad(false);
        }, 2000)
    }

    return (
        <>  
            <TeamDiv className="team">
            {console.log(team)}
                <h1>{team.name}</h1>
                <TeamImg alt="" src={team.img}/>
                <div className="details">
                    <p>Founded: {team.founded}</p>                    
                    <p>Team Website: <a href={`https://lmgtfy.com/?q=${team.name}`}>Click Here to find team in google</a></p> 
                    <p>Address: {team.country && team.country.name}</p>
                </div>
            </TeamDiv>
            { squad.length > 0 ?
             (
             <SquadDiv className="squad">
                <h2>Squad</h2>
                <Table>
                        <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Shirt Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {squad && squad.map((player, index) => 
                                <tr key={index}>
                                    <td>{player.player.firstname} {player.player.lastname}</td>
                                    <td>{player.number}</td>
                                </tr>
                            )}
                        </tbody>
                </Table>   
            </SquadDiv>
            )
            :            
            (                                      
                isNoSquad 
                ? <LoadingDiv>Looking For Squad....</LoadingDiv>
                : <LoadingDiv>No Squad Found.</LoadingDiv>
            )            
        }
        </>
        
    )    
}

export default TeamDetails;