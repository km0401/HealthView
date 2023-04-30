import React, { useState } from 'react';
import useEth from '../../contexts/EthContext/useEth'
import { TextField, Button } from '@mui/material';

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
        <div>
            <TextField
                label="Patient Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
            />
            <TextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
            />
            <TextField
                label="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
            />
            <TextField
                label="Blood Group"
                value={bloodgroup}
                onChange={(e) => setBloodgroup(e.target.value)}
            />
            <Button variant="contained" onClick={handleRegisterPatient}>
                Register Patient
            </Button>
        </div>
    );
}

export default PatientRegister;
