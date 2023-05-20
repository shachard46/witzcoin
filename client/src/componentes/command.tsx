import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Button, FormControl } from "@material-ui/core";
import CommandParamsFields, { Params } from "./command-params";
import { FormEvent, useContext, useState } from "react";
import axios from "axios";
import { ThemeContext } from "./root-layout";

export interface Command {
  name: string;
  params: Params;
}

const runCommand = (command: Command) => {
  axios({
    method: "post",
    url: `/commands/${command.name}/run`,
    data: {},
  })
    .then((res) => {
      return JSON.stringify(res.data);
    })
    .catch((err) => {
      return err;
    });
  return "";
};

const CommandPage: React.FC<Command> = (command: Command) => {
  const classes = useContext(ThemeContext);
  const [output, setOutput] = useState("");
  const handleSubmit = (event: FormEvent) => {
    setOutput(runCommand(command));
  };
  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <Typography align="center" component="h1" variant="h5">
        {command.name}
      </Typography>
      <FormControl className={classes.form}>
        <CommandParamsFields {...command.params} />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleSubmit}
        >
          Run Command
        </Button>
      </FormControl>
      <Typography align="center" component="h1" variant="h5">
        Output:
      </Typography>
      <Typography align="center">{output}</Typography>
    </Container>
  );
};

export default CommandPage;
