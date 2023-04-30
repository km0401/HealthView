import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const PatientDetail = ({patients}) => {
  const { _patientId, _patientAddr, _patientName, _phone, _gender, _dob, _bloodgroup, records } = patients;
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>{_patientName}</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>{_phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gender</TableCell>
              <TableCell>{_gender}</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>{_dob}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Blood Group</TableCell>
              <TableCell>{_bloodgroup}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
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
