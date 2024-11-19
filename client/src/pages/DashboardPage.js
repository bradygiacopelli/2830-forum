import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [forums, setForums] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Fetch subscribed forums
        const fetchForums = async () => {
            const response = await fetch('http://localhost:5001/api/forums/subscribed', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const data = await response.json();
            setForums(data);
        };
        fetchForums();
    }, []);

    const filteredForums = forums.filter((forum) =>
        forum.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <h1>Dashboard</h1>
            <input
                type="text"
                placeholder="Search forums..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <Link to="/create-forum">
                <button>Create Forum</button>
            </Link>
            <ul>
                {filteredForums.map((forum) => (
                    <li key={forum._id}>
                        <Link to={`/forums/${forum._id}`}>{forum.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;
