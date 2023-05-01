import React from 'react'
import Admin from './admin'
import PatientRegister from './patientRegister'
import DoctorRegister from './doctorRegister'
import { useNavigate } from 'react-router-dom'
import useEth from '../contexts/EthContext/useEth'
import CustomButton from '../components/CustomButton'
import { Box, Typography, Backdrop, CircularProgress, Card } from '@mui/material'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import HeaderAppBar from '../components/Header'

function Home() {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  const navigate = useNavigate()

  const ActionSection = () => {
    if (!accounts) {
      return (
        <Typography variant='h5' color='black'>
          Open your MetaMask wallet to get connected, then refresh this page
        </Typography>
      )
    } else {
      if (role === 'unknown') {
        return (
          <Box display='flex' flexDirection={'row'} ml={4} mr={4} justifyContent={'space-between'}>
              <DoctorRegister />
              <Box mr={2} ml={2}/>
              <PatientRegister />
          </Box>
        )
      } else if (role === 'admin') {
        return (
          <Box>
            <Admin />
          </Box>
        )
      } else if (role === 'patient') {
        return (
          <CustomButton text='Patient Portal' handleClick={() => navigate('/patient')}>
            <LoginRoundedIcon style={{ color: 'white' }} />
          </CustomButton>
        )
      } else if (role === 'doctor') {
        return (
          <CustomButton text='Doctor Portal' handleClick={() => navigate('/doctor')}>
            <LoginRoundedIcon style={{ color: 'white' }} />
          </CustomButton>
        )
      }
    }
  }

  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  } else {
    return (
      <>
        <Box minHeight={550} sx={{ bgcolor: 'rgb(228, 239, 247,0.6)' }}>
          <Box id='home-page-box' display='flex' flexDirection='column' justifyContent='center' alignItems='center' p={5}>
            <Box mt={2} mb={5} style={{ textAlign: 'center' }}>
              <Typography variant='h4' color='black'>
                Empower Yourself with <span style={{ fontWeight: 'bold' }}>HealthView</span>
              </Typography>
              <Typography variant='h5' color='black' fontWeight={300}>
                Own Your Medical Records, Take Control of Your Health.
              </Typography>
            </Box>
            <ActionSection />

            <Box display='flex' alignItems='center' mt={2}></Box>
          </Box>
        </Box>
      </>
    )
  }
}

export default Home
