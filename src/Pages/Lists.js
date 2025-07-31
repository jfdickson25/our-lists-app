import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Lists.css';
import Loading from '../Shared/Loading';

const editPencil = 'https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/edit-pencil.png?v=1703823015327';
const editPencilActive = 'https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/edit-pencil-beige.png?v=1703823015684';

const Lists = () => {
    const navigate = useNavigate();

    const [navingBack, setNavingBack] = useState(false);
    const [lists, setLists] = useState([]);
    const [loadingLists, setLoadingLists] = useState(true);
    const [editing, setEditing] = useState(false);


    useEffect(() => {
        // Grab lists from localstorage and make a request to https://our-lists-4ff1ad33d970.herokuapp.com/myLists/:id for each list
        // Then setLists to the response

        let listIDs = JSON.parse(localStorage.getItem('lists'));

        const fetchData = async () => {
            const updatedLists = [];
            if(!listIDs) {
                setLoadingLists(false);
                return;
            }

            for (const listID of listIDs) {
                const response = await fetch(`https://our-lists-4ff1ad33d970.herokuapp.com/myLists/${listID}`);
                const data = await response.json();

                console.log(data);

                if(data.found === false) {
                    listIDs = listIDs.filter(id => id !== listID);
                    localStorage.setItem('lists', JSON.stringify(listIDs));
                    continue;
                } else {
                    updatedLists.push(data);
                }
            }
            setLists(updatedLists);
            setLoadingLists(false);
        };

        fetchData();
    }, []);

    const navBack = () => {
        setNavingBack(true);
        setTimeout(() => {
            setNavingBack(false);
            navigate('/');
        }, 1000);
    }

    const navList = (listID) => {
        navigate(`/list/${listID}`);
    }

    return (
        <div id="content">
            <div id="header">
                <img id="back" src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/back.png?v=1703820361532" alt="back" onClick={navBack} style={navingBack ? {animation: 'button-press .75s'} : null} />
                <p>My Lists</p> 
                <img id="edit" src={ editing ? editPencilActive : editPencil} alt="edit" onClick={() => { 
                    setEditing(!editing);
                }} />
            </div>
            {
                loadingLists ?
                <Loading className='content-loading' type='bounce' size={100} speed={.75} />
                :
                    <div id="lists">
                        {
                            lists.length !== 0 ?
                            lists.map((list) => {
                                return (

                                    <div class="list" onClick={() => { 
                                            if(editing) {
                                                return;
                                            }

                                            navList(list.code) 
                                        }}>
                                        <p className='list-name'>{list.name}</p>
                                        {
                                            editing ?
                                            <img className='delete-list' src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/remove-list.png?v=1703823499433" alt="delete" onClick={() => { 
                                                const newList = lists.filter(l => l.code !== list.code);
                                                setLists(newList);
                                                localStorage.setItem('lists', JSON.stringify(newList.map(l => l.code)));

                                                fetch(`https://our-lists-4ff1ad33d970.herokuapp.com/list`, 
                                                {
                                                    method: 'DELETE',
                                                    body: JSON.stringify({code: list.code}),
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    }
                                                });
                                            }} />
                                            : null
                                        }
                                    </div>
                                );
                            })
                            : <p id='no-lists'>You have no lists ✏️</p>
                        }
                    </div>
            }
        </div>
    );
};

export default Lists;
