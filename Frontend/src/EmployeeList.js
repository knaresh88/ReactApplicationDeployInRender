// EmployeeList
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import EditEmployeeForm from './EditEmployeeForm';

const EmployeeList = () => {
  const [employeeList, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://fullstackapplication-8.onrender.com/api/emp/list/');
        setEmployees(response.data);
      } catch (error) {
        console.log(error);
        setErrorMessage('Failed to fetch employees. Please try again.');
      }
    };

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
    fetchEmployees();
    const intervalId = setInterval(fetchEmployees, 30000); // fetch data every 30 seconds

    return () => clearInterval(intervalId); // clean up on unmount
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDelete = (id) => {
    axios.delete(`https://fullstackapplication-8.onrender.com/api/emp/${id}/delete/`)
      .then(response => {
        setEmployees(employeeList.filter(employee => employee.id !== id));
        setSuccessMessage('Employee deleted successfully.');
        setErrorMessage('');
      })
      .catch(error => {
        console.log(error);
        setErrorMessage('Failed to delete employee. Check if the feature flag is disabled.');
        setSuccessMessage('');
      });
  };

  const handleFormSubmit = async (updatedEmployee) => {
    try {
      const response = await axios.put(`https://fullstackapplication-8.onrender.com/api/emp/${updatedEmployee.id}/`, updatedEmployee);
      console.log('Response from server:', response.data);
      setSuccessMessage('Employee updated successfully.');
      setErrorMessage('');
      setEmployees(prevEmployees =>
        prevEmployees.map(employee =>
          employee.id === updatedEmployee.id ? updatedEmployee : employee
        )
      );
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Error updating employee. Check if the feature flag is disabled:', error.response || error);
      setErrorMessage('Failed to update employee. Check if the feature flag is disabled.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Birthdate</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(employeeList) && employeeList.length > 0 ? (
            employeeList.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.birthdate}</td>
                <td>{employee.department}</td>
                <td>{employee.salary}</td>
                <td>
                  {isFeatureEnabled && (
                    <>
                      <button className="Edit" onClick={() => handleEdit(employee)}>Edit</button>
                      <button onClick={() => handleDelete(employee.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedEmployee && (
        <EditEmployeeForm
          employee={selectedEmployee}
          onSubmit={handleFormSubmit}
          onCancel={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
};

export default EmployeeList;
