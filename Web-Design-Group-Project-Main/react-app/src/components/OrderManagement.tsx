import React, { useState } from 'react';
import { Container, Table, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './OrderManagement.css';

interface Order {
  id: number;
  customerName: string;
  orderId: string;
  date: string;
  deliveryDate: string;
}

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  
  // Initial orders data
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customerName: 'John Doe', orderId: '#ORD1023', date: '2025-04-15', deliveryDate: '2025-04-20' },
    { id: 2, customerName: 'Jane Smith', orderId: '#ORD1024', date: '2025-04-16', deliveryDate: '2025-04-22' }
  ]);

  const [editableCell, setEditableCell] = useState<{rowId: number, field: string} | null>(null);
  const [cellValue, setCellValue] = useState('');

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Force redirect to the main Auth page (login/signup)
    navigate('/', { replace: true });
  };

  const handleCellClick = (order: Order, field: string) => {
    setEditableCell({ rowId: order.id, field });
    setCellValue(order[field as keyof Order] as string);
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCellValue(e.target.value);
  };

  const handleCellBlur = () => {
    if (editableCell) {
      const { rowId, field } = editableCell;
      
      // Update the orders array with the new value
      setOrders(orders.map(order => {
        if (order.id === rowId) {
          return { ...order, [field]: cellValue };
        }
        return order;
      }));
      
      setEditableCell(null);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="px-3">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/homepage">Home</Nav.Link>
          <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
          <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
          <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
        </Nav>
        <Button variant="outline-light" size="sm" onClick={handleLogout}>Sign Out</Button>
      </Navbar>

      <Container className="mt-5 pt-5">
        <h2 className="text-center mb-4">Order Management</h2>
        
        <Table bordered hover className="order-table">
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Customer Name</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Estimated Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td onClick={() => handleCellClick(order, 'customerName')}>
                  {editableCell && editableCell.rowId === order.id && editableCell.field === 'customerName' ? (
                    <input 
                      type="text" 
                      value={cellValue} 
                      onChange={handleCellChange} 
                      onBlur={handleCellBlur}
                      autoFocus
                    />
                  ) : (
                    order.customerName
                  )}
                </td>
                <td onClick={() => handleCellClick(order, 'orderId')}>
                  {editableCell && editableCell.rowId === order.id && editableCell.field === 'orderId' ? (
                    <input 
                      type="text" 
                      value={cellValue} 
                      onChange={handleCellChange} 
                      onBlur={handleCellBlur}
                      autoFocus
                    />
                  ) : (
                    order.orderId
                  )}
                </td>
                <td onClick={() => handleCellClick(order, 'date')}>
                  {editableCell && editableCell.rowId === order.id && editableCell.field === 'date' ? (
                    <input 
                      type="text" 
                      value={cellValue} 
                      onChange={handleCellChange} 
                      onBlur={handleCellBlur}
                      autoFocus
                    />
                  ) : (
                    order.date
                  )}
                </td>
                <td onClick={() => handleCellClick(order, 'deliveryDate')}>
                  {editableCell && editableCell.rowId === order.id && editableCell.field === 'deliveryDate' ? (
                    <input 
                      type="text" 
                      value={cellValue} 
                      onChange={handleCellChange} 
                      onBlur={handleCellBlur}
                      autoFocus
                    />
                  ) : (
                    order.deliveryDate
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default OrderManagement; 