import {Route, Routes} from "react-router";

import {CompanyPage} from "$pages/company";
import {EmployeePage} from "$pages/employee";
import {LoginPage} from "$pages/login";

function App() {

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>

                <Route
                    path="/employee"
                    element={<EmployeePage/>}
                />

                <Route
                    path="/company"
                    element={<CompanyPage/>}
                />
            </Routes>


        </>
    )
}

export default App
