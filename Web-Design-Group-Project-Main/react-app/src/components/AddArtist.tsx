import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './AddArtist.css';

const AddArtist: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
    securityQuestion: "What was your first pet's name?",
    securityAnswer: '',
    role: 'artist' // Default role for all artists
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Prepare user data structure
      const userData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
        role: formData.role,
        // Add bio as an additional field to be handled in the backend
        artistInfo: {
          bio: formData.bio
        }
      };
      
      // Debug log for request payload
      console.log('Sending registration data:', JSON.stringify(userData, null, 2));
      
      // Use the users endpoint - first try the base users endpoint to verify the server is running
      try {
        // Use the users endpoint for registration
        const response = await fetch('http://localhost:5001/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(userData)
        });

        // Debug log the response
        const responseText = await response.text();
        console.log('Server response status:', response.status);
        console.log('Server response:', responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse response as JSON:', e);
        }

        if (response.ok) {
          console.log('Registration successful, created user:', responseData?.user);
          alert('Artist added successfully!');
          navigate('/admin/user-management');
        } else {
          // Try to parse the error response
          let errorMessage = 'Failed to add artist';
          if (responseData?.message) {
            errorMessage = responseData.message;
          }
          console.error('Registration error:', errorMessage, responseData);
          alert(`Error: ${errorMessage}`);
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        alert('Error: Backend server is not running or not accessible. Please make sure the server is running on port 5001.');
      }
    } catch (error) {
      console.error('Error adding artist:', error);
      alert(`An error occurred while adding the artist: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <nav 
        className="navbar navbar-dark bg-dark fixed-top"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5) !important' }}
      >
        <div className="container-fluid">
          <div className="navbar-nav ms-auto d-flex flex-row">
            <Button variant="outline-light" className="me-2" onClick={() => navigate('/admin/user-management')}>Back to User Management</Button>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1>Add New Artist</h1>
        
        <div className="form-container">
          <form id="artistForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                value={formData.fullName}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="securityAnswer">Security Answer (for "What was your first pet's name?")</label>
              <input 
                type="text" 
                id="securityAnswer" 
                name="securityAnswer" 
                value={formData.securityAnswer}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Artist Bio</label>
              <textarea 
                id="bio" 
                name="bio" 
                rows={4} 
                value={formData.bio}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">Add Artist</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddArtist; 