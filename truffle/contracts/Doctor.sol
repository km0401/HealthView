// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Doctors{
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

    address[] public doctorList;
    uint256 [] public registeredDoctorList;
    address public  owner;
    mapping(address=>doctor) doctorDetails;
    mapping(address=>bool) isDoctor;
    mapping(string=>mapping(uint=>bool)) Registered;

    constructor(){
        owner = msg.sender;
    }

    function getMappingIsDoctor(address _address) public view returns (bool) {
        return isDoctor[_address];
    }

    function registerDoctor(string memory _docName, uint _licenseNo) public{
        require(msg.sender==owner,"Only authority/owner can register the doctor");
        Registered[_docName][_licenseNo] = true;
        registeredDoctorList.push(_licenseNo);
    }

    function addDoctor(string memory _doctorName, string memory _docContact, string memory _hName, string memory _dept, uint _licenseNo) public {
        require(!isDoctor[msg.sender],"Doctor Already Registered");
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


    function isRegistered(address _docAddr) public view returns (bool){
        doctor memory doc = doctorDetails[_docAddr];
        return Registered[doc.docName][doc.licenseNo];
    }

    // function getRegisteredDoctorsList(uint _docId) public view returns(uint256 license){
    //     return registeredDoctorList[_docId];
    // }

    function getDoctor(address _address) public view returns(uint256 id,string memory name , string memory contact ,string memory hname ,string memory faculty ,address addr , bool isApproved,uint256 licenseno) {
        require(doctorDetails[_address].isApproved,"Doctor is not Approved or doesn't exist");
        doctor memory doc = doctorDetails[_address];
        return (doc.docId,doc.docName,doc.docContact,doc.hName,doc.dept,doc.docAddr,doc.isApproved,doc.licenseNo);
    }
}