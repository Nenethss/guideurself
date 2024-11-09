import React, { useState } from 'react';
import '@/style.css'

const AddCampus = () => {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/campus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }), // Convert the name to JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Campus added:', data);
            setName(''); // Reset the input field if needed
        } catch (error) {
            console.error('Failed to add campus:', error.message);
        }
    };

    return (
        <form className='add-form' onSubmit={handleSubmit}>
            <input
                className='add-campus-input'
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Campus Name"
                required
            />
            <button className='submit-button' type="submit">Add Campus</button>
        </form>
    );
};

export default AddCampus;
