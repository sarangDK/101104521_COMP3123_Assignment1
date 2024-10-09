const express = require('express');
const router = express.Router();
const Employee = require('../model/Employee');
const {check, validationResult} = require('express-validator');


// Get all employees
router.get('/employees', async (req, res) => {

  // Try/ catch block to handle exceptions for getting all employees 

  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

// Create Employee
router.post('/employees', [

  // validation employee's first_name, last_name, email, position and salary
  check('first_name').not().isEmpty().withMessage('First Name is required'),
  check('last_name').not().isEmpty().withMessage('Last Name is required'),
  check('email').isEmail().withMessage("Please type valid email"),
  check('position').not().isEmpty().withMessage('Position is required'),
  check('salary').isNumeric().withMessage('Salary must be a number')
],async (req, res) => {

  // validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  } 

  // Try/ catch block to handle exceptions for creating employee
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json({ message: "Employee Created Successfully", employee_id: savedEmployee._id });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

// Get Emplpyee by id
router.get('/employees/:id', async (req, res) => {

  // Try/ catch block to handle exceptions for getting employee by id
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

// Update employee by id
router.put('/employees/:eid', [
  check('position').not().isEmpty().withMessage("Please type Position correctly"),
  check('salary').isNumeric().withMessage('Salary must be a number')
], async (req, res) => {

  // validation result
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  // Try/ catch block to handle exceptions for updating employee by id
  try {
    const UpdateEmployee = await Employee.findByIdAndUpdate(req.params.eid, req.body, { new: true });
    if (UpdateEmployee) {
      res.status(200).json({ message: "Employee details updated successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

// Delete employee by id
router.delete('/employees/:eid', async (req, res) => {
  // try/ catch block to handle exceptions for deleting employee by id
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.eid);
    if (deletedEmployee) {
      res.status(200).json({ message: "Employee Deleted Successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

module.exports = router;
