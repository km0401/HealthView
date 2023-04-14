const Patient = artifacts.require("Patient");

module.exports = function (deployer) {
  deployer.deploy(Patient, Doctor.address);
};