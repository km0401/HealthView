// const IPFS = require('ipfs-api');
// const ipfs = new IPFS(
//   { 
//     host: 'localhost', 
//     port: 5001,
//     protocol: 'http' 
//   }
// );
// export default ipfs;

const IPFS = require('ipfs-core');

const ipfs = await IPFS.create({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
});
