import React , {useState, useEffect}from 'react'
import useEth from '../../contexts/EthContext/useEth'
import { Typography, TextField, Button, Box, Card, Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,IconButton} from '@mui/material';
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded'
import PatientDetail from '../../components/patientDetail';
import HeaderAppBar from '../../components/Header';
import { create } from 'ipfs-http-client';
import CustomButton from '../../components/CustomButton';
import { useNavigate } from 'react-router-dom'


function Patient() {
  const {
    state: { contract, accounts, role, loading },
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
  const navigate = useNavigate()

  useEffect(() => {
    console.log(role)
    if(role!== 'patient'){
      navigate('/');
    }
      
  }, [role]);


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
      alert("Access granted successfully");
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
   await contract.methods.revoke_access(addr).send({from:accounts[0]});
    alert("Access revoked successfully");
    setAddr("");
  } catch (err) {
    console.error(err);
  }
};

getPatientDetails();
handleGetRecords();
  return (
    <>
    <HeaderAppBar/>
    {/* if (role==='patient'){
    <> */}
    <Box ml={20} mr={20} mt={4} mb={4}>
    <Typography variant='h4' fontWeight={600} style={{textAlign:'left'}}>
    Your Patient Details
    </Typography>
        {patientExist && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                          <PatientDetail patients={patient} />
                    </Box>
                  )}

                  <Box mt={6} mb={6}>
      <Typography variant="h4" fontWeight={600} gutterBottom sx={{textAlign:'left'}}>
        Your Medical Records
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

<Box  ml={20} mr={20}  mt={6} mb={6}>
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
      <Box display="flex" justifyContent="center">
      <input type="file" onChange={handleFileUpload} /></Box>
      <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
            <CustomButton  text={'Add Record'} handleClick={() => handleAddRecord()}/>
            </Box>
      </Box>
      </Card>
      </Box>
 
    

      <Box ml={20} mr={20} mt={6} mb={6}>
      <Typography variant="h4" gutterBottom fontWeight={600} mb={2}>
        Grant/Revoke Access to Doctors
      </Typography>
     <Card variant="outlined" style={{ borderRadius: "10px" }}>
      <Box p={3}>
        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            label="Address"
            value={addr}
            InputProps={{ style: { fontSize: '15px' } }}
              InputLabelProps={{ style: { fontSize: '15px' } }}
              size='small'
            onChange={(e) => setAddr(e.target.value)}
            fullWidth
          />
        </Box>
          <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
          <CustomButton  text={'Grant Access'} handleClick={() => handleGrantAccess()}/>
          <Box ml={2} mr={2}/>
            <CustomButton  text={'Revoke Access'} handleClick={() => handleRevokeAccess()}/>
            </Box>
      </Box>
    </Card>
    </Box>
        
    </>
  )
}

export default Patient