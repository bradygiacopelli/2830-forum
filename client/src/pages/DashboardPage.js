import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation to track navigation
import '../styles/DashboardPage.css';

const DashboardPage = () => {
    const [forums, setForums] = useState([]);
    const [search, setSearch] = useState('');
    const location = useLocation(); // Access the current location (route) to trigger refresh on navigation

    useEffect(() => {
        // Fetch subscribed forums whenever the component is mounted or the location changes
        const fetchForums = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/forums/subscribed');
                const data = await response.json();
                setForums(data); // Set the fetched forums to state
            } catch (error) {
                console.error('Error fetching forums:', error);
            }
        };
        fetchForums();
    }, [location]); // Dependency on location to refresh the data on route change

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

