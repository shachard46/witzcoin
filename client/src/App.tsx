import React from "react";
import "./App.css";
import LoginForm from "./componentes/login-form";
import AdminPage from "./componentes/admin-page";
import CommandPage, { Command } from "./componentes/command";

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
  return (
    <div>
      <CommandPage {...command} />
    </div>
  );
}

export default App;
