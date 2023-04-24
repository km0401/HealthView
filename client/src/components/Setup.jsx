import React, { Component } from 'react'
import ipfs from "../ipfs"

export class Setup extends Component {
  constructor(props){
    super(props)
    this.state = {
      web3:null,
      accounts:null,
      contract:null,
      ipfsHash:null
    };
  }
    captureFile = (event)=>{
      event.stopPropagation()
      event.preventDefault()
      const file = event.target.files[0]
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () =>this.convertToBuffer(reader)
    };

    convertToBuffer = async(reader) =>{
      const buffer = await Buffer.from(reader.result);
      this.setState({buffer});
    };

    onIPFSSubmit = async (event) =>{
      event.preventDefault();
      await ipfs.add(this.state.buffer,(err,ipfsHash)=>{
        console.log(err,ipfsHash);
        this.setState({ipfsHash:ipfsHash[0].hash});
      })
    };

  render() {
    return (
      <>
        <div>
          <h2>
            1. Add a file to IPFS here
          </h2>
          <form id="ipfs-hash-form" className = "scep-form" onSubmit={this.onIPF
          }>
            <input type="file" onChange={this.captureFile}/>
            <button type="submit">Send it</button>
          </form>
          <p>The IPFS hash is {this.state.ipfsHash}</p>
        </div>
      </>
    )
  }
}

export default Setup



  
