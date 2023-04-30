import React, {useState} from 'react'
import useEth from '../../contexts/EthContext/useEth'
import DoctorDetail from '../../components/doctorDetail';
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded'
import FileSaver from 'file-saver';
import { Typography, TextField, Button, Box, FormControl, Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,IconButton} from '@mui/material';
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PatientDetail from '../../components/patientDetail';
import { create } from 'ipfs-http-client';

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
  try{
    if (!/^(0x)?[0-9a-f]{40}$/i.test(searchPatientAddress)) {
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
    const authorized = await contract.methods.isAuthorized(accounts[0]).call({from:accounts[0]})
    console.log(authorized)
    if(authorized){
      console.log("if conditon")
      setAuthorized(true);
      console.log("authroized set true")
      console.log(file)
      const added = await ipfs.add(file);
    setFileHash(added.cid.toString());
    console.log(added.cid.toString());
    await contract.methods.addRecord(docName, reasonVisit, visitDate, accounts[0], added.cid.toString()).send({ from: accounts[0] });
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
    <Box>
      {doctorExist && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                          <DoctorDetail doctor={doctor} />
                    </Box>
                  )}
                  </Box>

                  <Typography variant='h4'>Get Patient Details</Typography>
                  <Box display='flex' alignItems='center' my={1}>
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

                  {!patientExist && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No details found</Typography>
                    </Box>
                  )}

                  {patientExist && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                    <PatientDetail patients={patient} />
                    </Box>
                  )}

                  <div>
      <Typography variant="h4" gutterBottom>
        Patient Records
      </Typography>
      <TableContainer component={Paper}>
  <Table aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell align="center">Doctor Name</TableCell>
        <TableCell align="center">Reason</TableCell>
        <TableCell align="center">Visited Date</TableCell>
        <TableCell align="center">Time Stamp</TableCell>
        <TableCell align="center">IPFS Hash</TableCell>
        <TableCell align="center">Download</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {records.map((record) => (
        <TableRow key={record.id}>
          <TableCell component="th" scope="row">
            {record.id}
          </TableCell>
          <TableCell align="center">{record.dname}</TableCell>
          <TableCell align="center">{record.reason}</TableCell>
          <TableCell align="center">{record.visDate}</TableCell>
          <TableCell align="center">{record.timeStamp}</TableCell>
          <TableCell align="center">{record.ipfs}</TableCell>
          <TableCell>
          {/* <a href={"https://ipfs.io/ipfs/"+record.ipfs} download target='_blank' rel='noopener noreferrer'> */}
              <IconButton>
                <CloudDownloadRoundedIcon fontSize='large' onClick={(e) => { e.preventDefault(); window.open("https://ipfs.io/ipfs/"+record.ipfs); }}/>
              </IconButton>
              {/* </a> */}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
    </div>
                 
    
                    <Box>
                    <TextField
        label="Doctor Name"
        value={docName}
        onChange={(e) => setDocName(e.target.value)}
      />
      <TextField
        label="Reason of Visit"
        value={reasonVisit}
        onChange={(e) => setReasonVisit(e.target.value)}
      />
      <TextField
        label="Visit Date"
        value={visitDate}
        onChange={(e) => setVisitDate(e.target.value)}
      />
      <TextField
        label="Patient Account Address"
        value={patientAddr}
        onChange={(e) => setPatientAddr(e.target.value)}
      />
      <input type="file" onChange={handleFileUpload} />
      <Button onClick={handleAddRecord}>Add Record</Button>
      </Box>
                
                  
                 
    </>
  )
}

export default Doctor