import React , {useState}from 'react'
import useEth from '../../contexts/EthContext/useEth'
import { Typography, TextField, Button, Box, FormControl} from '@mui/material';
import PatientDetail from '../../components/patientDetail';

function Patient() {
  const {
    state: { contract, accounts },
  } = useEth()
// const doctorContract = contracts[1];
  const [patient, setPatient] = useState([]);
  const [patientExist, setPatientExist] = useState(false);
  const [addr, setAddr] = useState("");

const getPatientDetails = async () => {
    try {
  const patientExists = await contract.methods.getMappingIsPatient(accounts[0]).call();
      if (patientExists) {
        setPatientExist(true)
        const patient = await contract.methods.getPatientDetails(accounts[0]).call()
        setPatient(patient);
    }
  }
  catch (err) {
    console.error(err)
  }
}

const handleGrantAccess = async () => {
  try {
    const authorized = await contract.methods.isAuthorized(accounts[0],addr).call({from:accounts[0]})
    if(authorized){
      alert('User already authorized')
    }
    else{
      await contract.methods.grantAccess(addr).send({from:accounts[0]});
      console.log("Access granted successfully");
    setAddr("");
    const authorized = await contract.methods.isAuthorized(accounts[0],addr).call({from:accounts[0]})
    console.log(authorized)
    }
  } catch (err) {
    console.error(err);
  }
};

const handleRevokeAccess = async () => {
  try {
   await contract.methods.revoke_access(addr);
    console.log("Access revoked successfully");
    setAddr("");
  } catch (err) {
    console.error(err);
  }
};

getPatientDetails();
  return (
    <>
        {patientExist && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                          <PatientDetail patients={patient} />
                    </Box>
                  )}

        <Box>
          <Typography>Grant/Revoke Access</Typography>
          <TextField
        label="Address"
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
      />
      <Button variant="contained" onClick={handleGrantAccess}>
        Grant Access
      </Button>
      <Button variant="contained" onClick={handleRevokeAccess}>
        Revoke Access
      </Button>
        </Box>
    </>
  )
}

export default Patient