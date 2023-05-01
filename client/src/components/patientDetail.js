import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PatientDetail = ({patients}) => {
  const { _patientId, _patientAddr, _patientName, _phone, _gender, _dob, _bloodgroup, records } = patients;
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#00BFA5' }}>
              <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}}>Patient Name</TableCell>
              <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}}>Gender</TableCell>
              <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}}>Date of Birth</TableCell>
              <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}}>Blood Group</TableCell>
              <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}}>Phone</TableCell>
              
            </TableRow>
            <TableRow>
            <TableCell style={{ color: '#000000', fontSize:'15px' }}>{_patientName}</TableCell>
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{_gender}</TableCell>
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{_dob}</TableCell>
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{_bloodgroup}</TableCell>
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{_phone}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PatientDetail;
