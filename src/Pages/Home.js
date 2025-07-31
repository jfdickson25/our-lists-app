import React from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

const Home = () => {
    return (
        <div>
            <img src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/shopping-bag.png?v=1703820604274" alt="milk" id="main-icon" />
            <div class="link-list">
                <Link to="/our-lists-app/createList" class="link-list-item">
                    <img src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/add.png?v=1704555066182" alt="Create Icon" /> 
                    <p>Create List</p>
                </Link>
                <Link to="/our-lists-app/joinList" class="link-list-item">
                    <img src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/join.png?v=1703566107209" alt="Join Icon" /> 
                    <p>Join List</p>
                </Link>
                <Link to="/our-lists-app/myLists" class="link-list-item">
                    <img src="https://cdn.glitch.global/a505ce02-f570-40df-ad76-697af5e6acd7/lists.png?v=1704555064336" alt="Lists Icon" /> 
                    <p>My Lists</p>
                </Link>
            </div>
        </div>
    );
};

export default Home;
