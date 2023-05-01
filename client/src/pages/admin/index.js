import React, { useState} from 'react';
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useEth from '../../contexts/EthContext/useEth'
import { Typography, TextField, Button, Box, FormControl, Card} from '@mui/material';
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
  const [buttonClicked, setButtonClicked] = useState(false)

  const getDoctorDetails = async () => {
    setButtonClicked(true)
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
    console.log("register")
    const owner = accounts[0];
    const isOwner = await contract.methods.owner().call();
    if (owner !== isOwner) {
      alert('You are not the owner of the contract');
      return;
    }
    console.log("hell")
    try {
      console.log("try")
      await contract.methods.registerDoctor(docName, licenseNo).send({ from: owner });
      alert(`Doctor ${docName} with license number ${licenseNo} has been registered successfully`);
      setDocName('');
      setLicenseNo('');
    } catch (error) {
      alert('Error registering doctor');
    }
  };

  return (
    <Card  style={{borderRadius:'10px'}}>
    <Box p={4}>
      <Typography variant="h5" gutterBottom style={{textAlign:'center',fontWeight:500}}>
        Register Doctor with Name and License No.
      </Typography>

      <Box mb={1}>
        <TextField
          label="Doctor Name"
          variant="outlined"
          fullWidth
          margin="dense"
          value={docName}
          InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
          onChange={(e) => setDocName(e.target.value)}
        />
      </Box>

      <Box mb={1}>
        <TextField
          label="License Number"
          variant="outlined"
          fullWidth
          margin="dense"
          value={licenseNo}
          InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
          onChange={(e) => setLicenseNo(e.target.value)}
        />
      </Box>
    
      
      <CustomButton  text={'Register Doctor'} handleClick={() => handleRegisterDoctor()}/>

      <Box mt={3}>
        <Typography variant='h5' style={{textAlign:'center', fontWeight:500}}>Get Doctor Details</Typography>
        <Box display='flex' alignItems='center' my={2} width={600}>
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

        {!doctorExist && searchDoctorAddress && buttonClicked && (
      <Box display='flex' alignItems='center' justifyContent='center' my={5}>
        <Typography variant='h5'>No details found</Typography>
      </Box>
    )}

        {doctorExist && (
          <Box display='flex' flexDirection='column' mt={3} mb={-2}>
            <DoctorDetail doctor={doctor} />
          </Box>
        )}
      </Box>
    </Box>
    </Card>
  );
};

export default Admin;
