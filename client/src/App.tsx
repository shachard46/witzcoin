import React, { createContext, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import LoginForm from "./componentes/login-form";
import AdminPage from "./componentes/admin-page";
import CommandPage, { Command } from "./componentes/command";
import CommandList from "./componentes/command-list";
import RootLayout from "./componentes/root-layout";
import axios from "axios";

export const CommandsContext = createContext<Command[]>([]);
const loadCommands = async (setCommands: Function) => {
  const res = await axios<Command[]>({
    method: "GET",
    url: "/commands",
  });
  setCommands(res.data);
  return res.data
};
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
  const [commands, setCommands] = useState([command, command2, command]);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="perms" element={<AdminPage />} />
        <Route
          path="commands"
          element={<CommandList />}
          loader={() => loadCommands(setCommands)}
        />
        <Route path="commands/name" element={<CommandPage {...command} />} />
      </Route>
    )
  );
  return (
    <CommandsContext.Provider value={commands}>
      <RouterProvider router={router} />
    </CommandsContext.Provider>
  );
}

export default App;
