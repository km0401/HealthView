import React, { useReducer, useCallback, useEffect } from 'react'
import Web3 from 'web3'
import EthContext from './EthContext'
import { reducer, actions, initialState } from './state'

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const init = useCallback(async artifact => {
    // console.log("init");
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545')
      // console.log(web3);
      const accounts = await web3.eth.requestAccounts()
      // console.log(accounts)
      const networkID = await web3.eth.net.getId()
      // console.log(networkID)
      const { abi } = artifact
      // console.log(artifact)
      let address, contract
      try {
        address = artifact.networks[networkID].address
        // console.log(address)
        contract = new web3.eth.Contract(abi, address)
      } catch (err) {
        console.error(err)
      }

      let role = 'unknown'
      if (contract && accounts) {
        console.log(accounts[0])
        role = await contract.methods.getSenderRole().call({ from: accounts[0] })
        console.log(role)
      }

      dispatch({
        type: actions.init,
        data: { artifact, web3, accounts, networkID, contract, role, loading: false },
      })
    }
  }, [])

  useEffect(() => {
    const tryInit = async () => {
      // console.log("tryinit")
      try {
        const artifact = require('../../contracts/Doctor.json')
        init(artifact)
      } catch (err) {
        console.error(err)
      }
    }

    tryInit()
  }, [init])

  useEffect(() => {
    const events = ['chainChanged', 'accountsChanged']
    const handleChange = () => {
      init(state.artifact)
    }

    events.forEach(e => window.ethereum.on(e, handleChange))
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange))
    }
  }, [init, state.artifact])

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  )
}

export default EthProvider
