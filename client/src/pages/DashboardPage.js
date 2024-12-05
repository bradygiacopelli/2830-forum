import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
    const [forums, setForums] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Fetch subscribed forums
        const fetchForums = async () => {
            const response = await fetch('http://localhost:5001/api/forums/subscribed');
            const data = await response.json();
            setForums(data);
        };
        fetchForums();
    }, []);

    const filteredForums = forums.filter((forum) =>
        forum.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-controls">
                <input
                    type="text"
                    placeholder="Search forums..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="dashboard-search"
                />
                <Link to="/create-forum" className="dashboard-create-button">
                    Create Forum
                </Link>
            </div>
            <div className="dashboard-forums">
                {filteredForums.map((forum) => (
                    <Link to={`/forums/${forum._id}`} key={forum._id} className="forum-card">
                        <img
                            src={`http://localhost:5001${forum.image}`}
                            alt={`${forum.name} cover`}
                            className="forum-card-image"
                        />
                        <div className="forum-card-name">{forum.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
