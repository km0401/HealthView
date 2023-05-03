import React, {useState, useEffect} from 'react'
import useEth from '../../contexts/EthContext/useEth'
import DoctorDetail from '../../components/doctorDetail';
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded'
import { Typography, TextField, Button, Box, FormControl, Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,IconButton, Card} from '@mui/material';
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PatientDetail from '../../components/patientDetail';
import { create } from 'ipfs-http-client';
import HeaderAppBar from '../../components/Header';
import { useNavigate } from 'react-router-dom'

// import ipfs from "../../ipfs"
function Doctor() {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  
// const doctorContract = contracts[1];
  const [records, setRecords] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [doctorExist, setDoctorExist] = useState(false);
  const [searchPatientAddress, setSearchPatientAddress] = useState([]);
  const [recordlen, setRecordLength] = useState(0);
  const [patientAddr, setPatientAddr] = useState([]);
  const [patient, setPatient] = useState([]);
  const [patientExist, setPatientExist] = useState(false);
  const [docName, setDocName] = useState("");
  const [reasonVisit, setReasonVisit] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [file, setFile] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    console.log(role)
    if(role!== 'doctor'){
      navigate('/');
    }
      
  }, [role]);

  
  const handleGetRecords = async () => {
    try {
      const authorized = await contract.methods.isAuthorized(searchPatientAddress, accounts[0]).call({from:accounts[0]})
    console.log(authorized)
    setAuthorized(authorized)
    const rlen = await contract.methods.getrecordlist(searchPatientAddress).call();
    console.log(rlen);
      setRecordLength(rlen);
      if (authorized) {
        let record = [];
        for (var i = 0; i < rlen; i++) {
          const result = await contract.methods
            .getPatientRecords(searchPatientAddress, i)
            .call({ from: accounts[0] });
          console.log(result);
          console.log("This is result")
          record.push({
            id: result._rid,
            dname: result.dname,
            reason: result.reason,
            visDate: result.visitedDate,
            timeStamp: result.timeStamp,
            ipfs: result.ipfshash,
          });
        }
        console.log(record);
        console.log("This is record")
        setRecords(record);
      } else {
        alert("Sorry! You are not authorized to get the whole record.");
      }
    } catch (error) {
      console.log(error);
    }
  };

const getDoctorDetails = async () => {
    try {
  const doctorExists = await contract.methods.getMappingIsDoctor(accounts[0]).call();
      if (doctorExists) {
        setDoctorExist(true)
        const doctor = await contract.methods.getDoctor(accounts[0]).call()
        setDoctor(doctor);
    }
  }
  catch (err) {
    console.error(err)
  }
}

const getPatientDetails = async()=>{
  setButtonClicked(true)
  try{
    if (!/^(0x)?[0-9a-f]{40}$/i.test(searchPatientAddress)) {
      console.log(searchPatientAddress)
      alert('Please enter a valid wallet address', 'error')
      return
    }
    const patientExists = await contract.methods.getMappingIsPatient(searchPatientAddress).call({from: accounts[0]});
    // const authorized = await contract.isAuthorized(patientAddress, accounts[0]).call({from: accounts[0]});
    if (patientExists) {
      setPatientExist(true)
      const patient = await contract.methods.getPatientDetails(searchPatientAddress).call({ from: accounts[0] })
      setPatient(patient);
  }
  }
  catch (err){
    console.error(err);
  }
}

// const ipfsClient = require('ipfs-http-client');
// const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });

const ipfs = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
})

const handleAddRecord = async () => {
  console.log("handlerecord")
  try {
    const authorized = await contract.methods.isAuthorized(patientAddr, accounts[0]).call({from:accounts[0]})
    console.log(authorized)
    if(authorized){
      console.log("if conditon")
      setAuthorized(true);
      console.log("authroized set true")
      console.log(file)
      const added = await ipfs.add(file);
    setFileHash(added.cid.toString());
    console.log(added.cid.toString());
    await contract.methods.addRecord(docName, reasonVisit, visitDate, patientAddr, added.cid.toString()).send({ from: accounts[0] });
      alert('File added successfully');
    }
    console.log("recordadded")
    if(!authorized){
      alert('You are not authorized to upload records')
    }
    // show success message or do other stuff
  } catch (error) {
    console.error(error);
    // show error message or do other stuff
  }
};

const handleFileUpload = (event) => {
  console.log("handleupload")
  const file = event.target.files[0];
  console.log("myfile")
  // do some validation on the file, e.g. size or type
  setFile(file);
  console.log("fileset")
};


getDoctorDetails();
  return (
    <>
    <HeaderAppBar/>
    <Box ml={20} mr={20} mt={4} mb={4}>
    <Typography variant='h4' fontWeight={600} style={{textAlign:'left'}}>
    Your Doctor Details
    </Typography>
    <Box >
      {doctorExist && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                          <DoctorDetail doctor={doctor} />
                    </Box>
                  )}
                  </Box>
                  </Box>
<Box ml={20} mr={20}  mt={8} mb={8}>
                  <Typography variant='h4' fontWeight={600} style={{textAlign:'left'}}>Get Patient Details</Typography>
                  <Box display='flex' alignItems='center' mt={2} mb={5}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Search patient by wallet address'
                        value={searchPatientAddress}
                        onChange={e => setSearchPatientAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Search'} handleClick={() =>{ getPatientDetails();handleGetRecords()}}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                  </Box>
<Box>
                  {!patientExist && searchPatientAddress.length!=0 && buttonClicked &&  (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No details found</Typography>
                    </Box>
                  )}

                  {patientExist && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                    <PatientDetail patients={patient} />
                    </Box>
                  )}
                  </Box>

                  <Box mt={6} mb={6}>
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{textAlign:'left'}}>
        Patient Records
      </Typography>
      <TableContainer component={Paper}>
  <Table aria-label="simple table">
    <TableHead>
      <TableRow style={{ backgroundColor: '#00BFA5' }}>
        <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}}>Record ID</TableCell>
        <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}} align="center">Doctor Name</TableCell>
        <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}} align="center">Reason</TableCell>
        <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}} align="center">Visited Date</TableCell>
        <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}} align="center">Time Stamp</TableCell>
        {/* <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}} align="center">IPFS Hash</TableCell> */}
        <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}} align="center">Download</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {records.map((record) => (
        <TableRow key={record.id}>
          <TableCell component="th" scope="row" style={{ color: '#000000', fontSize:'15px' }}>
            {record.id}
          </TableCell>
          <TableCell align="center" style={{ color: '#000000', fontSize:'15px' }}>{record.dname}</TableCell>
          <TableCell align="center" style={{ color: '#000000', fontSize:'15px' }}>{record.reason}</TableCell>
          <TableCell align="center" style={{ color: '#000000', fontSize:'15px' }}>{record.visDate}</TableCell>
          <TableCell align="center" style={{ color: '#000000', fontSize:'15px' }}>{record.timeStamp}</TableCell>
          {/* <TableCell align="center" style={{ color: '#000000', fontSize:'15px' }}>{record.ipfs}</TableCell> */}
          <TableCell align="center" style={{ color: '#000000', fontSize:'15px' }}>
          {/* <a href={"https://ipfs.io/ipfs/"+record.ipfs} download target='_blank' rel='noopener noreferrer'> */}
              <IconButton onClick={(e) => { e.preventDefault(); window.open("https://ipfs.io/ipfs/"+record.ipfs); }}>
                <CloudDownloadRoundedIcon fontSize='large' />
              </IconButton>
              {/* </a> */}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
    </Box>
    </Box>   
    
    <Box ml={20} mr={20} mt={6} mb={6}>
    <Typography variant="h4" gutterBottom fontWeight={600} mb={2}>
        Upload Patient Records
      </Typography>
    
                    <Card variant="outlined" style={{ borderRadius: "10px" }} >
      <Box display="flex" flexDirection="column" justifyContent="center" p={5}>
        <Box mb={2}>
          <TextField
          fullWidth
            label="Doctor Name"
            value={docName}
            InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
            onChange={(e) => setDocName(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
          fullWidth
            label="Reason of Visit"
            value={reasonVisit}
            InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
            onChange={(e) => setReasonVisit(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
          fullWidth
            label="Visit Date"
            value={visitDate}
            InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
            onChange={(e) => setVisitDate(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField 
          fullWidth
            label="Patient Account Address"
            value={patientAddr}
            InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
            onChange={(e) => setPatientAddr(e.target.value)}
          />
        </Box>
        <Box display="flex" justifyContent="center">
          <input type="file" onChange={handleFileUpload}/>
        </Box>
        <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
            <CustomButton  text={'Add Record'} handleClick={() => handleAddRecord()}/>
            </Box>
      </Box>
    </Card>
    </Box>
                
                  
                 
    </>
  )
}

export default Doctor