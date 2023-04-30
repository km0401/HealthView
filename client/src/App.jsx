import EthProvider from "./contexts/EthContext/EthProvider";
import Admin from "./pages/admin/index"
import Doctor from "./pages/doctor";
import DoctorRegister from "./pages/doctorRegister";
import PatientRegister from "./pages/patientRegister";
// import PatientDetail from "./components/patientDetail";
import Patient from "./pages/patient";

function App() {

  return (
    <EthProvider>
      <Admin/>
      <DoctorRegister/>
      <Doctor/>
      <PatientRegister/>
      <Patient/>
      {/* <PatientDetail/> */}
    </EthProvider>
  );
}

export default App;
