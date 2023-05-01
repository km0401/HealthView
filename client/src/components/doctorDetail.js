import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DoctorDetail = ({ doctor }) => {
  const { id, name, contact, hname, faculty, addr, licenseno, isApproved } = doctor;
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#00BFA5' }}>
              {/* <TableCell style={{ color: '#FFFFFF' }}>Doctor ID</TableCell> */}
              <TableCell style={{ color: '#FFFFFF' , fontSize:'15px'}}>Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontSize:'15px' }}>Contact</TableCell>
              
              <TableCell style={{ color: '#FFFFFF', fontSize:'15px' }}>Hospital Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontSize:'15px' }}>Department</TableCell>
              {/* <TableCell style={{ color: '#FFFFFF' }}>Wallet Address</TableCell> */}
              <TableCell style={{ color: '#FFFFFF', fontSize:'15px' }}>License Number</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontSize:'15px' }}>Approved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {/* <TableCell>{id}</TableCell> */}
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{name}</TableCell>
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{contact}</TableCell>
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{hname}</TableCell>
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{faculty}</TableCell>
              {/* <TableCell>{addr}</TableCell> */}
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{licenseno}</TableCell>
              <TableCell style={{ color: '#000000', fontSize:'15px' }}>{isApproved ? "Yes" : "No"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DoctorDetail;