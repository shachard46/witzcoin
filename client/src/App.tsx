import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginForm from "./componentes/login-form";
import AdminPage from "./componentes/admin-page";
import CommandPage, { Command } from "./componentes/command";
import CommandList from "./componentes/command_list";

function App() {
  const command: Command = {
    name: "com",
    params: {
      arg1: "arg",
      arg2: "arg2",
      arg4: "arg2",
      arg5: "arg2",
      arg3: "arg2",
    },
  };
    const command2: Command = {
      name: "com22",
      params: {
        arg1: "arg",
        arg2: "arg2",
        arg4: "arg2",
        arg5: "arg2",
        arg3: "arg2",
      },
    };
  const commands: Command[] = [command, command2, command];
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/perms" element={<AdminPage />} />
          <Route
            path="/commands"
            element={<CommandList commands={commands} />}
          />
          <Route path="/commands/name" element={<CommandPage {...command} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
