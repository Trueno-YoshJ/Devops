import React, { useEffect, useState } from "react";
import "../components/service.css";
import { SERVICES_URL } from "../api/config";

export default function NewService() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceName: "",
    vehiclePlate: "",
    ownerName: "",
    serviceDate: "",
    serviceTime: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);

  const loadServices = async () => {
    const res = await fetch(SERVICES_URL);
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addService = async () => {
    await fetch(SERVICES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    loadServices();
    resetForm();
  };

  const updateService = async () => {
    await fetch(`${SERVICES_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    loadServices();
    resetForm();
  };

  const deleteService = async (id) => {
    await fetch(`${SERVICES_URL}/${id}`, { method: "DELETE" });
    loadServices();
  };

  const startEdit = (service) => {
    setEditingId(service.id);
    setForm(service);
  };

  const resetForm = () => {
    setForm({
      serviceName: "",
      vehiclePlate: "",
      ownerName: "",
      serviceDate: "",
      serviceTime: "",
      price: "",
    });
    setEditingId(null);
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
        <h2 className="service-header">{editingId ? 'Edit Service' : 'Add New Service'}</h2>

        <div className="service-input-section">
          <input 
            name="serviceName" 
            value={form.serviceName} 
            onChange={handleChange} 
            placeholder="Service Name"
          />
          <input 
            name="vehiclePlate" 
            value={form.vehiclePlate} 
            onChange={handleChange} 
            placeholder="Vehicle Number Plate"
          />
          <input 
            name="ownerName" 
            value={form.ownerName} 
            onChange={handleChange} 
            placeholder="Vehicle Owner Name"
          />
          <input 
            type="date" 
            name="serviceDate" 
            value={form.serviceDate} 
            onChange={handleChange}
          />
          <input 
            type="time" 
            name="serviceTime" 
            value={form.serviceTime} 
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="price" 
            value={form.price} 
            onChange={handleChange} 
            placeholder="Price"
          />

          {editingId ? (
            <>
              <button className="service-btn" onClick={updateService}>Update Service</button>
              <button className="service-btn" style={{background: '#ef4444'}} onClick={resetForm}>Cancel</button>
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
              {services.map(s => (
                <tr key={s.id}>
                  <td>{s.serviceName}</td>
                  <td>{s.vehiclePlate}</td>
                  <td>{s.ownerName}</td>
                  <td>{s.serviceDate}</td>
                  <td>{s.serviceTime}</td>
                  <td>{s.price}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn update-btn" onClick={() => startEdit(s)}>Update</button>
                      <button className="action-btn delete-btn" onClick={() => deleteService(s.id)}>Delete</button>
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
