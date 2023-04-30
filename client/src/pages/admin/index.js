import React, { useState} from 'react';
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useEth from '../../contexts/EthContext/useEth'
import { Typography, TextField, Button, Box, FormControl} from '@mui/material';
import DoctorDetail from '../../components/doctorDetail';

const Admin = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  console.log(contract);
// const doctorContract = contracts[1];
  const [docName, setDocName] = useState('');
  const [doctor, setDoctor] = useState([]);
  const [licenseNo, setLicenseNo] = useState('');
  const [searchDoctorAddress, setSearchDoctorAddress] = useState('');
  const [doctorExist, setDoctorExist] = useState(false)

  const getDoctorDetails = async () => {
    try {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(searchDoctorAddress)) {
        alert('Please enter a valid wallet address', 'error')
        return
      }
      const doctorExists = await contract.methods.getMappingIsDoctor(searchDoctorAddress).call({ from: accounts[0] })
      if (doctorExists) {
        setDoctorExist(true)
        const doctor = await contract.methods.getDoctor(searchDoctorAddress).call({ from: accounts[0] })
        setDoctor(doctor);
    }

    }
     catch (err) {
      console.error(err)
    }
  }

  const handleRegisterDoctor = async () => {
    const owner = accounts[0];
    const isOwner = await contract.methods.owner().call();
    if (owner !== isOwner) {
      alert('You are not the owner of the contract');
      return;
    }
    try {
      await contract.methods.registerDoctor(docName, licenseNo).send({ from: owner });
      alert(`Doctor ${docName} with license number ${licenseNo} has been registered successfully`);
      setDocName('');
      setLicenseNo('');
    } catch (error) {
      alert('Error registering doctor');
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Admin Page
      </Typography>
      <TextField
        label="Doctor Name"
        variant="outlined"
        margin="dense"
        value={docName}
        onChange={(e) => setDocName(e.target.value)}
      />
      <TextField
        label="License Number"
        variant="outlined"
        margin="dense"
        value={licenseNo}
        onChange={(e) => setLicenseNo(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleRegisterDoctor}>
        Register Doctor
      </Button>

      <Typography variant='h4'>Get Doctor Details</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Search doctor by wallet address'
                        value={searchDoctorAddress}
                        onChange={e => setSearchDoctorAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Search'} handleClick={() => getDoctorDetails()}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                  </Box>

                  {!doctorExist && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No details found</Typography>
                    </Box>
                  )}

                  {doctorExist && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                          <DoctorDetail doctor={doctor} />
                    </Box>
                  )}

                 
    </div>
  );
};

export default Admin;
