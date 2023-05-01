import React, { useState } from 'react';
import useEth from '../../contexts/EthContext/useEth'
import { TextField, Button, Card, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import CustomButton from '../../components/CustomButton';

function PatientRegister() {
    const {
        state: { contract, accounts, role, loading },
      } = useEth()
    //   const patientContract = contracts[0];
    const [patientName, setPatientName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [bloodgroup, setBloodgroup] = useState('');

    const handleRegisterPatient = async () => {
        try {
            const isRegistered = await contract.methods.getMappingIsPatient(accounts[0]).call();
            if (isRegistered) {
                throw new Error("Patient already registered");
            }
            // Call the addPatient function on the contract
            await contract.methods.addPatient(
                patientName,
                phone,
                gender,
                dob,
                bloodgroup
            ).send({ from: accounts[0] });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Card sx={{  borderRadius:'10px',width: '45%'}}>
        <Box p={4}>
      <Typography variant="h5" mb={2} gutterBottom sx={{textAlign:'center',fontWeight:500}}>
        Register yourself as a Patient.
      </Typography>
            <Box sx={{ width: '100%' }}>
                <TextField
                    fullWidth
                    label="Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
                />
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
                <TextField
                    fullWidth
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
                />
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
                <TextField
                    fullWidth
                    label="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
                />
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
                <TextField
                    fullWidth
                    label="Date of Birth"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
                />
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
                <TextField
                    fullWidth
                    label="Blood Group"
                    value={bloodgroup}
                    onChange={(e) => setBloodgroup(e.target.value)}
                    InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
                />
            </Box>
            <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
            <CustomButton  text={'Register Patient'} handleClick={() => handleRegisterPatient()}/>
            </Box>
            
            </Box>
        </Card>
    );
}

export default PatientRegister;
