import React, {useState} from 'react';
import useEth from '../../contexts/EthContext/useEth'
import { TextField, Button, CircularProgress } from "@mui/material";

function DoctorRegister() {
  const {
    state: { contract, accounts, role},
  } = useEth()
  const [doctorName, setDoctorName] = useState("");
  const [docContact, setDocContact] = useState("");
  const [hName, setHName] = useState("");
  const [dept, setDept] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDoctorRegister = async () => {
    try {
      // Check if all required fields have been filled
      if (!doctorName || !docContact || !hName || !dept || !licenseNo) {
        throw new Error("Please fill in all required fields");
      }
  
      // Check the length of the input values
      if (doctorName.length === 0 || docContact.length === 0 || hName.length === 0 || dept.length === 0) {
        throw new Error("All input fields are required");
      }
  
      // Check the license number input value
      if (isNaN(Number(licenseNo)) || licenseNo < 1) {
        throw new Error("Please enter a valid license number");
      }
  
      // Check if the doctor has already been registered
      const isRegistered = await contract.methods.getMappingIsDoctor(accounts[0]).call();
      if (isRegistered) {
        throw new Error("Doctor already registered");
      }
  
      // Call the Solidity function with the user's input values
      await contract.methods.addDoctor(doctorName, docContact, hName, dept, licenseNo).send({ from: accounts[0] });
  
      // Reset the form fields
      setDoctorName("");
      setDocContact("");
      setHName("");
      setDept("");
      console.log("Department value:", dept);
      setLicenseNo("");
  
      // Display success message
      alert("Doctor registered successfully!");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div>
      <h2>Doctor Registration Form</h2>
      <TextField
        label="Name"
        value={doctorName}
        onChange={(e) => setDoctorName(e.target.value)}
        margin="normal"
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Contact"
        value={docContact}
        onChange={(e) => setDocContact(e.target.value)}
        margin="normal"
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Hospital Name"
        value={hName}
        onChange={(e) => setHName(e.target.value)}
        margin="normal"
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Department"
        value={dept}
        onChange={(e) => setDept(e.target.value)}
        margin="normal"
        variant="outlined"
        fullWidth
      />
      <TextField
        label="License No."
        value={licenseNo}
        onChange={(e) => setLicenseNo(e.target.value)}
        margin="normal"
        variant="outlined"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleDoctorRegister} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Register"}
      </Button>
    </div>
  )
}

export default DoctorRegister