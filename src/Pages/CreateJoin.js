import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateJoin.css';

const Create = (props) => {
    const navigate = useNavigate();

    const [navingBack, setNavingBack] = useState(false);
    const [data, setData] = useState('');
    const [noList, setNoList] = useState(false);
    const [alreadyJoined, setAlreadyJoined] = useState(false);

    const dataRef = useRef(data);

    const navBack = () => {
        setNavingBack(true);
        setTimeout(() => {
            setNavingBack(false);
            navigate('/our-lists-app');
        }, 1000);
    }

    const createList = (name) => {
        // Make a post request to https://our-lists-4ff1ad33d970.herokuapp.com/createList with the name of the list
        // Then add the id returned from the request to localStorage
        // Then navigate to the list page
        fetch('https://our-lists-4ff1ad33d970.herokuapp.com/createList', {
            method: 'POST',
            body: JSON.stringify({name}),
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            // Check to see if there is a localStorage item called lists
            // If there is, add the new list id to the array
            // If there isn't, create a new array with the list id
            if(!localStorage.getItem('lists')) {
                localStorage.setItem('lists', JSON.stringify([data.code]));
                navigate(`/our-lists-app/list/${data.code}`);
            } else {
                localStorage.setItem('lists', JSON.stringify([...JSON.parse(localStorage.getItem('lists')), data.code]));
                navigate(`/our-lists-app/list/${data.code}`);
            }
        })
        .catch(err => console.log(err));
    }

    const joinList = (code) => {
        // Make a get request to https://our-lists-4ff1ad33d970.herokuapp.com/joinList/:id with the code of the list
        // Then add the id returned from the request to localStorage
        // Then navigate to the list page
        fetch(`https://our-lists-4ff1ad33d970.herokuapp.com/joinList/${code}`)
        .then(res => res.json())
        .then(data => {
            if(data.found === false) {
                setNoList(true);
            } else {
                // Check to see if there is a localStorage item called lists
                // If there is, add the new list id to the array
                // If there isn't, create a new array with the list id
                if(!localStorage.getItem('lists')) {
                    localStorage.setItem('lists', JSON.stringify([parseInt(code)]));
                    navigate(`/our-lists-app/list/${code}`);
                } else {
                    if(JSON.parse(localStorage.getItem('lists')).includes(parseInt(code))) {
                        navigate(`/our-lists-app/list/${code}`);
                    }
                    localStorage.setItem('lists', JSON.stringify([...JSON.parse(localStorage.getItem('lists')), parseInt(code)]));
                    navigate(`/our-lists-app/list/${code}`);
                }
            }
        });
    }
    
    return (
        <div id="content">
            <div id="header">
                <img id="back" src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/back.png?v=1703820361532" alt="back" onClick={navBack} style={navingBack ? {animation: 'button-press .75s'} : null} />
                <p>
                    {
                        props.pageType === 'number' ?
                            'Join List'
                        :   'Create List'
                    }
                </p>
            </div>
            <img id="story" src={props.storyImg} alt="Action Img" />
            <div className="input-section">
                {
                    props.pageType === 'number' ? 
                        <input className="user-input" type="number" placeholder="Join code" name="list" id="list" onChange={(event) => {
                            setData(event.target.value);
                            dataRef.current = event.target.value;
                        }} required />
                    :   <input className="user-input" type="text" placeholder="List name" name="list" id="list" onChange={(event) => {
                            setData(event.target.value);
                            dataRef.current = event.target.value;
                        }} required />
                }
                <button onClick={ props.pageType === 'number' ? () => { joinList(dataRef.current) } : () => { createList(dataRef.current)}} type="submit">
                    {
                        props.pageType === 'number' ?
                            'Join'
                        :   'Create'
                    }
                </button>
                {
                    noList ?
                    <p id='error-msg'>No list found with that code</p> :null
                }
            </div>
        </div>
    );
};

export default Create;
