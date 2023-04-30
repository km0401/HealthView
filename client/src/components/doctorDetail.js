import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DoctorDetail = ({ doctor }) => {
  const { id, name, contact, hname, faculty, addr, licenseno, isApproved } = doctor;
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor ID</TableCell>
              <TableCell>{id}</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>{contact}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>Hospital Name</TableCell>
              <TableCell>{hname}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Department</TableCell>
              <TableCell>{faculty}</TableCell>
              <TableCell>Wallet Address</TableCell>
              <TableCell>{addr}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>License Number</TableCell>
              <TableCell>{licenseno}</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>{isApproved ? "Yes" : "No"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DoctorDetail;
