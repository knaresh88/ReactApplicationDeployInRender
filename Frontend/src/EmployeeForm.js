// EmployeeForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const EmployeeForm = ({ onEmployeeAdded, setEmployees }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthdate: '',
    department: '',
    salary: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        const response = await axios.get('https://fullstackapplication-8.onrender.com/api/emp/feature_flag/My_Test_Flag');
        console.log('Feature flag status:', response.data.feature_enabled); // Add this line to log the flag status
        setIsFeatureEnabled(response.data.feature_enabled);
      } catch (error) {
        console.error('Error checking feature flag status:', error);
      }
    };

    checkFeatureFlag();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://fullstackapplication-8.onrender.com/api/emp/', formData);
      console.log('Response from server:', response.data);
      setSuccessMessage('Employee added successfully.');
      setErrorMessage('');

      onEmployeeAdded(response.data);

      setFormData({
        name: '',
        birthdate: '',
        department: '',
        salary: '',
      });

      if (setEmployees) {
        setEmployees(prevEmployees => [...prevEmployees, response.data]);
      }
    } catch (error) {
      console.error('Error adding employee:', error.response || error);
      setErrorMessage('Failed to add employee. Check if the feature flag is disabled.');
      setSuccessMessage('');
    }
  };

  if (!isFeatureEnabled) {
    return <p></p>;
  }

  return (
    <div>
      <h2>Add Employee</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} autoComplete="name"/>
        <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} autoComplete="bday"/>
        <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} autoComplete="organization"/>
        <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} autoComplete="salary"/>
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default EmployeeForm;
