import EthProvider from "./contexts/EthContext/EthProvider";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Admin from "./pages/admin/index"
import Home from "./pages/index"
import Doctor from "./pages/doctor";
import DoctorRegister from "./pages/doctorRegister";
import PatientRegister from "./pages/patientRegister";
import HeaderAppBar from "./components/Header";
// import PatientDetail from "./components/patientDetail";
import Patient from "./pages/patient";

function App() {

  return (
    <EthProvider>
      <Router>
      <Routes>
      <Route path ='/' element={<><HeaderAppBar/><Home/></>}/>
      <Route path='/register' element={<><DoctorRegister/><PatientRegister/></>}/>
      <Route path='/doctor' element={<Doctor/>}/>
      <Route path = '/patient' element={<Patient/>}/>
      </Routes>
      </Router>
    </EthProvider>
  );
}

export default App;
