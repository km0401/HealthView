// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Doctor{
    uint dindex=0;
    struct doctor {
        uint docId;
        address docAddr;
        string docName;
        string docContact;
        string hName;
        string dept;
        uint256 licenseNo;
        bool isApproved;
    }

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
        string ipfs;
    }

    address[] public doctorList;
    uint256 [] public registeredDoctorList;
    address public  owner;
    mapping(address=>doctor) doctorDetails;
    mapping(address=>bool) isDoctor;
    mapping(string=>mapping(uint=>bool)) Registered;
    address[] patientList;
    mapping(address=>Patients) patientDetails;
    mapping(address=>bool) isPatient;
    mapping(address=>mapping(address=>bool)) Authorized;

    constructor(){
        owner = msg.sender;
    }

     function isAuthorized(address _patientAddr,address client ) public view returns (bool success){
        return Authorized[_patientAddr][client];
    }
    function getMappingIsDoctor(address _address) public view returns (bool) {
        return isDoctor[_address];
    }
    function getMappingIsPatient(address _address) public view returns (bool) {
        return isPatient[_address];
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
        require(getMappingIsDoctor(_addr),"Not registered as doctor");
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

    function addRecord(string memory _docName, string memory _reasonVisit, string memory _visitDate, address _addr, string memory _ipfs) public {
        require(isPatient[_addr],"No patient found at the given address");
        if(Authorized[_addr][msg.sender] || msg.sender == _addr){
                patientDetails[_addr].records.push(Records(rid, _docName,_reasonVisit,_visitDate, block.timestamp, _ipfs));
                rid+=1;
        }
        else 
        revert("Record cannot be added");
    }

    function getrecordlist(address _addr)  public view returns (uint256 ){  
     return (patientDetails[_addr].records.length);
     }

    function getPatientRecords(address _addr, uint256 _id) public view 
    returns(uint _rid,string memory dname, string memory reason ,string memory visitedDate, uint timeStamp, string memory ipfshash){
        require(isPatient[_addr],"No patient found at the given address");
        if(Authorized[_addr][msg.sender] || msg.sender == _addr){
                return( patientDetails[_addr].records[_id].recordid, patientDetails[_addr].records[_id].docName,patientDetails[_addr].records[_id].reasonVisit,
                patientDetails[_addr].records[_id].visitDate,patientDetails[_addr].records[_id].timeStamp, patientDetails[_addr].records[_id].ipfs
                    );
        }
        else 
        revert("Record cannot be accessed");
    }

    function registerDoctor(string memory _docName, uint _licenseNo) public{
        require(msg.sender==owner,"Only authority/owner can register the doctor");
        require(!Registered[_docName][_licenseNo]);
        Registered[_docName][_licenseNo] = true;
        registeredDoctorList.push(_licenseNo);
    }

    function addDoctor(string memory _doctorName, string memory _docContact, string memory _hName, string memory _dept, uint _licenseNo) public {
        require(!isDoctor[msg.sender],"Doctor Already Registered");
        require(Registered[_doctorName][_licenseNo],"Registered[_doctorName][_licenseNo]");
        require(msg.sender != owner,"Contract owner cannot register as doctor");
        require(bytes(_doctorName).length>0);
        require(bytes(_hName).length>0);
        require(bytes(_dept).length>0);
        require(bytes(_docContact).length>0);
        require(_licenseNo>0);  
        address _addr = msg.sender;
        doctorList.push(_addr);
        doctorDetails[_addr].docId = dindex;
        dindex +=1;
        isDoctor[_addr] = true;
        doctorDetails[_addr].docAddr = _addr;
        doctorDetails[_addr].docName = _doctorName;
        doctorDetails[_addr].docContact = _docContact;
        doctorDetails[_addr].hName = _hName;
        doctorDetails[_addr].dept = _dept;
        doctorDetails[_addr].licenseNo = _licenseNo;

        if (Registered[_doctorName][_licenseNo] == true){
            doctorDetails[_addr].isApproved = true;
        }
    }

    function isRegisteredbyAdmin(string memory _docName, uint _licenseNo) public view returns (bool){
        return Registered[_docName][_licenseNo];
    }

    // function getRegisteredDoctorsList(uint _docId) public view returns(uint256 license){
    //     return registeredDoctorList[_docId];
    // }

    function getDoctor(address _address) public view returns(uint256 id,string memory name , string memory contact ,string memory hname ,string memory faculty ,address addr , bool isApproved,uint256 licenseno) {
        require(doctorDetails[_address].isApproved,"Doctor is not Approved or doesn't exist");
        doctor memory doc = doctorDetails[_address];
        return (doc.docId,doc.docName,doc.docContact,doc.hName,doc.dept,doc.docAddr,doc.isApproved,doc.licenseNo);
    }

    function getSenderRole() public view returns (string memory) {
    if (doctorDetails[msg.sender].docAddr == msg.sender) {
      return "doctor";
    } else if (patientDetails[msg.sender].patientAddr == msg.sender) {
      return "patient";
    }
    else if(msg.sender==owner){
        return "admin";
    } else {
      return "unknown";
    }
  }
}

