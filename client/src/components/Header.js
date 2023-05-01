import { AppBar, Chip, Toolbar, Box, Typography } from '@mui/material'
import React from 'react'
import useEth from '../contexts/EthContext/useEth'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import { grey, teal } from '@mui/material/colors'
import logo from "../assets/logo.png"

const HeaderAppBar = () => {
  const {
    state: { accounts, role },
  } = useEth()

  return (
    <AppBar position='static' style={{ backgroundColor: '#51AFA1' }}>
      <Toolbar>
        <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
          <a href='/'>
            <img src={logo} alt='med-chain-logo' style={{ height: 30, weight: 30 }} />
          </a>
          <Box flexGrow={1} />
          <Box display='flex' alignItems='center'>
            <Box mb={0.1}>
              <PersonRoundedIcon style={{ color: 'whitesmoke', fontSize: '22px' }} />
            </Box>
            <Box ml={0.5} mr={2}>
              <Typography variant='h6' color='white'>
                {accounts ? accounts[0] : 'Wallet not connected'}
              </Typography>
            </Box>
            <Chip
              label={role === 'unknown' ? 'not registered' : role}
              style={{ fontSize: '12px', backgroundColor: 'white', color: teal['A700'] }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
export default HeaderAppBar
