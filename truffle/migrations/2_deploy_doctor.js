const Doctor = artifacts.require("Doctor");

module.exports = function (deployer) {
  deployer.deploy(Doctor);
}



// const path = require('path');
// const fs = require('fs');

// const Doctors = artifacts.require("Doctors");

// module.exports = function(deployer) {
//   deployer.deploy(Doctors).then(() => {
//     const contractAddress = Doctors.address;
//     const filePath = path.join(__dirname,'..','..', 'client', 'src', 'contracts', 'contractAddress.json');
//     fs.writeFileSync(filePath, JSON.stringify({ contractAddress }));
//   });
// };
