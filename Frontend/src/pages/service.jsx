import React, { useState } from 'react';
import "../components/service.css";

export default function Service() {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [price, setPrice] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const addService = () => {
    if (!serviceName || !serviceDate || !serviceTime || !vehiclePlate || !ownerName || !price) {
      alert('Please fill in all fields');
      return;
    }
    const newService = { name: serviceName, plate: vehiclePlate, owner: ownerName, date: serviceDate, time: serviceTime, price: price };
    setServices([...services, newService]);
    setServiceName('');
    setVehiclePlate('');
    setOwnerName('');
    setServiceDate('');
    setServiceTime('');
    setPrice('');
  };

  const deleteService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setServiceName(services[index].name);
    setVehiclePlate(services[index].plate);
    setOwnerName(services[index].owner);
    setServiceDate(services[index].date);
    setServiceTime(services[index].time);
    setPrice(services[index].price);
  };

  const updateService = () => {
    if (editingIndex === null) return;
    if (!serviceName || !serviceDate || !serviceTime || !vehiclePlate || !ownerName || !price) {
      alert('Please fill in all fields');
      return;
    }
    const updatedService = { name: serviceName, plate: vehiclePlate, owner: ownerName, date: serviceDate, time: serviceTime, price: price };
    const updatedServices = services.map((service, i) => (i === editingIndex ? updatedService : service));
    setServices(updatedServices);
    setServiceName('');
    setVehiclePlate('');
    setOwnerName('');
    setServiceDate('');
    setServiceTime('');
    setPrice('');
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setServiceName('');
    setVehiclePlate('');
    setOwnerName('');
    setServiceDate('');
    setServiceTime('');
    setPrice('');
    setEditingIndex(null);
  };

  return (
    <div className="service-wrapper">
      <div className="service-hero">
        <div>
          <h1>Car Service Management</h1>
          <p>Manage your vehicle maintenance with ease</p>
        </div>
      </div>

      <div className="service-container">
        <h2 className="service-header">{editingIndex !== null ? 'Edit Service' : 'Add New Service'}</h2>
        
        <div className="service-input-section">
        <input 
          type="text" 
          value={serviceName} 
          onChange={(e) => setServiceName(e.target.value)} 
          placeholder="Service Name" 
        />
        <input 
          type="text" 
          value={vehiclePlate} 
          onChange={(e) => setVehiclePlate(e.target.value)} 
          placeholder="Vehicle Number Plate" 
        />
        <input 
          type="text" 
          value={ownerName} 
          onChange={(e) => setOwnerName(e.target.value)} 
          placeholder="Vehicle Owner Name" 
        />
        <input 
          type="date" 
          value={serviceDate} 
          onChange={(e) => setServiceDate(e.target.value)} 
        />
        <input 
          type="time" 
          value={serviceTime} 
          onChange={(e) => setServiceTime(e.target.value)} 
        />
        <input 
          type="number" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          placeholder="Price" 
        />
        {editingIndex !== null ? (
          <>
            <button className="service-btn" onClick={updateService}>Update Service</button>
            <button className="service-btn" style={{background: '#ef4444'}} onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <button className="service-btn" onClick={addService}>Add Service</button>
        )}
      </div>

      <div className="service-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Vehicle Number Plate</th>
              <th>Owner Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td>{service.name}</td>
                <td>{service.plate}</td>
                <td>{service.owner}</td>
                <td>{service.date}</td>
                <td>{service.time}</td>
                <td>{service.price}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn update-btn" onClick={() => startEdit(index)}>Update</button>
                    <button className="action-btn delete-btn" onClick={() => deleteService(index)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="service-footer">
        <p>&copy; 2026 Car Service Center. All rights reserved.</p>
      </footer>
      </div>
    </div>
  );
}