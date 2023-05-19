import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Button, FormControl } from "@material-ui/core";
import CommandParamsFields, { Params } from "./command_params";
import { json } from "stream/consumers";
import { FormEvent, useState } from "react";

export interface Command {
  name: string;
  params: Params;
}

const runCommand = async (command: Command) => {
  const url: URL = new URL(
    `/commands/${command.name}/run`,
    "http://localhost:3000",
  );
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command.params),
  });
  return await response.json();
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(15),
    width: "wrap-content",
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    backgroundColor: "#e0e0e0",
    borderRadius: theme.spacing(1),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  textField: {
    backgroundColor: "white",
    borderRadius: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const CommandPage: React.FC<Command> = (command: Command) => {
  const classes = useStyles();
  const [output, setOutput] = useState("");
  const handleSubmit = (event: FormEvent) => {
    runCommand(command).then((out) => {
      setOutput(out);
    });
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
