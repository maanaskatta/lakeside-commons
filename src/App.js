import { Switch, Route, Redirect } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import { useEffect, useState } from "react";
import Manager from "./pages/Manager";

function App() {
  const [currentRole, setCurrentRole] = useState(
    localStorage.getItem("role") ? localStorage.getItem("role") : ""
  );

  return (
    <Switch>
      <Route
        path="/login"
        component={() => <LoginPage setCurrentRole={setCurrentRole} />}
      />
      {currentRole === "manager" ? (
        <Route path="/manager" component={() => <Manager />} />
      ) : (
        <Redirect to="/login" />
      )}
      <Redirect to="/login" />
    </Switch>
  );
}

export default App;
