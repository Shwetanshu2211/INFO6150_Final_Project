import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        navigate('/login');
        return;
      }

      if (response.status === 403) {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching users');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5001/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        setUsers(users.filter(user => user._id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsers(filteredUsers);
    if (searchTerm === '') {
      fetchUsers(); // Reset to all users if search is cleared
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <div className="navbar-nav">
            <a className="nav-link" href="/homepage">Home</a>
            <a className="nav-link" href="/gallery">Gallery</a>
            <a className="nav-link" href="/orders">Orders</a>
            <a className="nav-link" href="/contact">Contact</a>
          </div>
          <div className="navbar-nav ms-auto">
            <Button variant="outline-light" className="me-2" onClick={() => navigate('/add-artist')}>Add Artist</Button>
            <Button variant="outline-light" className="me-2" onClick={() => navigate('/upload-product')}>Upload Product</Button>
            <Button variant="outline-light" onClick={() => navigate('/manage-orders')}>Manage Orders</Button>
          </div>
        </div>
      </nav>

      <Container className="mt-4">
        <h1 className="text-center mb-4">User Management</h1>
        
        <Form onSubmit={handleSearch} className="mb-4">
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
            />
            <Button variant="dark" type="submit">Search</Button>
          </div>
        </Form>

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Address</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.address ? (
                    <>
                      {user.address.street && <div>{user.address.street}</div>}
                      {user.address.city && <div>{user.address.city}</div>}
                      {user.address.state && <div>{user.address.state}</div>}
                      {user.address.zipCode && <div>{user.address.zipCode}</div>}
                      {user.address.country && <div>{user.address.country}</div>}
                    </>
                  ) : (
                    'No address provided'
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default UserManagement; 