import React, {useState} from 'react'
import useEth from '../../contexts/EthContext/useEth'
import DoctorDetail from '../../components/doctorDetail';
import { Typography, TextField, Button, Box, FormControl, Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,} from '@mui/material';
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PatientDetail from '../../components/patientDetail';
import { create } from 'ipfs-http-client';
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles({
  tableContainer: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: 50,
  },
});

// import ipfs from "../../ipfs"
function Doctor() {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  
// const doctorContract = contracts[1];
const classes = useStyles();
  const [records, setRecords] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [doctorExist, setDoctorExist] = useState(false);
  const [searchPatientAddress, setSearchPatientAddress] = useState([]);
  const [recordlen, setRecordLength] = useState(0);
  const [patientRecords, setPatientRecords] = useState([]);
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
        for (var i = 0; i < recordlen; i++) {
          const result = await contract.methods
            .getPatientRecords(searchPatientAddress, i)
            .call({ from: accounts[0] });
          console.log(result);
          record.push({
            id: result.recordid,
            dname: result.docName,
            reason: result.reasonVisit,
            visDate: result.visitDate,
            time: result.timestamp,
            ipfs: result.ipfs,
          });
        }
        console.log(record);
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
    const authorized = await contract.methods.isAuthorized(patientAddr, accounts[0]).call({from:accounts[0]})
    console.log(authorized)
    if(authorized){
      console.log("if conditon")
      setAuthorized(true);
      console.log("authroized set true")
      console.log(file)
      const added = await ipfs.add(file);
    setFileHash(added.path);
    await contract.methods.addRecord(docName, reasonVisit, visitDate, patientAddr, added.path).send({ from: accounts[0] });
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
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Reason for Visit</TableCell>
              <TableCell>Visit Date</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record['dname']}</TableCell>
                <TableCell>{record['reason']}</TableCell>
                <TableCell>{record['visDate']}</TableCell>
                <TableCell>{record['time']}</TableCell>
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