const Doctor = artifacts.require("Doctor");

module.exports = function (deployer) {
  deployer.deploy(Doctor).then(function () {
    return deployer.deploy(Doctor)
  })
};