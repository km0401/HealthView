// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Doctor.sol";

contract Patient{
    // Doctor doctorContract = Doctor(0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c);
    Doctors public doctorContract;
    uint pindex = 0;
    uint rid = 0;
    struct Patients{
        uint patientId;
        address patientAddr;
        string patientName;
        string phone;
        string gender;
        string dob;
        string bloodgroup;
        Records [] records;
    }

    struct Records{
        uint recordid;
        string docName;
        string reasonVisit;
        string visitDate;
        uint timeStamp;
    }

    constructor(address _doctorAddr){
        doctorContract = Doctors(_doctorAddr);
    }

    address[] patientList;
    mapping(address=>Patients) patientDetails;
    mapping(address=>bool) isPatient;
    mapping(address=>mapping(address=>bool)) Authorized;

    function isAuthorized(address _patientAddr,address client ) public view returns (bool success){
        return Authorized[_patientAddr][client];
    }

    function addPatient(string memory _patientName, string memory _phone, string memory _gender, string memory _dob, string memory _bloodgroup) public {
        require(!isPatient[msg.sender],"Already Patient account exists");
        require(bytes(_patientName).length>0);
        require(bytes(_phone).length>0);
        require(bytes(_gender).length>0);
        require(bytes(_dob).length>0);
        require(bytes(_bloodgroup).length>0);        
        patientList.push(msg.sender);
        patientDetails[msg.sender].patientId = pindex;
        pindex+=1;
        isPatient[msg.sender]=true;
        patientDetails[msg.sender].patientAddr = msg.sender;
        patientDetails[msg.sender].patientName = _patientName;
        patientDetails[msg.sender].phone = _phone;
        patientDetails[msg.sender].gender = _gender;
        patientDetails[msg.sender].dob = _dob;
        patientDetails[msg.sender].bloodgroup = _bloodgroup;
    }

    function getPatientDetails(address _addr) public view returns(string memory _patientName,string memory _phone,string memory _gender,string memory _dob,string memory _bloodgroup){
        require(isPatient[_addr],"No Patients found at the given address");
        Patients memory pat = patientDetails[_addr];
        return (pat.patientName,pat.phone,pat.gender,pat.dob,pat.bloodgroup);
    }

    function grantAccess(address _addr) public returns (bool success)
    {   require(msg.sender != _addr,"You cannot add yourself");
        require(doctorContract.getMappingIsDoctor(_addr),"Not registered as doctor");
        require(!Authorized[msg.sender][_addr],"User is already authorized");
        Authorized[msg.sender][_addr] = true;
        return true;
    }

    function revoke_access(address _addr)  public returns (bool success){
        require(msg.sender!=_addr,"You can't remove yourself");
        require(Authorized[msg.sender][_addr],"User is not authorized yet");
        Authorized[msg.sender][_addr] = false;
        return true;
    }

    function addRecord(string memory _docName, string memory _reasonVisit, string memory _visitDate, address _addr) public {
        require(isPatient[_addr],"No patient found at the given address");
        if(Authorized[_addr][msg.sender] || msg.sender == _addr){
                patientDetails[_addr].records.push(Records(rid, _docName,_reasonVisit,_visitDate, block.timestamp));
                rid+=1;
        }
        else 
        revert("Record cannot be added");
    }

    function getPatientRecords(address _addr, uint256 _id) public view 
    returns(uint _rid,string memory dname, string memory reason ,string memory visitedDate, uint timeStamp){
        require(isPatient[_addr],"No patient found at the given address");
        if(Authorized[_addr][msg.sender] || msg.sender == _addr){
                return( patientDetails[_addr].records[_id].recordid, patientDetails[_addr].records[_id].docName,patientDetails[_addr].records[_id].reasonVisit,
                patientDetails[_addr].records[_id].visitDate,patientDetails[_addr].records[_id].timeStamp
                    );
        }
        else 
        revert("Record cannot be accessed");
    }
}