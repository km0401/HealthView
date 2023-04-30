import React , {useState}from 'react'
import useEth from '../../contexts/EthContext/useEth'
import { Typography, TextField, Button, Box, FormControl, Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,IconButton} from '@mui/material';
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded'
import PatientDetail from '../../components/patientDetail';
import { create } from 'ipfs-http-client';

function Patient() {
  const {
    state: { contract, accounts },
  } = useEth()
// const doctorContract = contracts[1];
  const [patient, setPatient] = useState([]);
  const [patientExist, setPatientExist] = useState(false);
  const [addr, setAddr] = useState("");
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [reasonVisit, setReasonVisit] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [records, setRecords] = useState([]);
  const [recordlen, setRecordLength] = useState(0);

  const ipfs = create({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
  })

  const handleGetRecords = async () => {
    try {
      const authorized = await contract.methods.getMappingIsPatient(accounts[0]).call({from:accounts[0]})
    setAuthorized(authorized)
    const rlen = await contract.methods.getrecordlist(accounts[0]).call();
      setRecordLength(rlen);
      if (authorized) {
        let record = [];
        for (var i = 0; i < rlen; i++) {
          const result = await contract.methods
            .getPatientRecords(accounts[0], i)
            .call({ from: accounts[0] });
          record.push({
            id: result._rid,
            dname: result.dname,
            reason: result.reason,
            visDate: result.visitedDate,
            timeStamp: result.timeStamp,
            ipfs: result.ipfshash,
          });
        }
        setRecords(record);
      } else {
        alert("Sorry! You are not authorized to get the whole record.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddRecord = async () => {
    console.log("handlerecord")
    try {
      const authorized = await contract.methods.getMappingIsPatient(accounts[0]).call({from:accounts[0]})
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
        alert('You cannot upload for someone elses records')
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
handleGetRecords();
  return (
    <>
        {patientExist && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                          <PatientDetail patients={patient} />
                    </Box>
                  )}

                  <Box>
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
                  </Box>
                  <Box mb={2}></Box>
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
      <input type="file" onChange={handleFileUpload} />
      <Button onClick={handleAddRecord}>Add Record</Button>
      </Box>
    </>
  )
}

export default Patient