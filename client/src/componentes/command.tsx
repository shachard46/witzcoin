import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Typography,
  Button,
  FormControl,
} from "@material-ui/core";
import CommandParamsFields, { Params } from "./command_params";

export interface Command {
  name: string;
  params: Params;
}

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

const CommandPage: React.FC<Command> = (params: Command) => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs" className={classes.root}>
      <form>
        <Typography align="center" component="h1" variant="h5">
          {params.name}
        </Typography>
        <FormControl className={classes.form}>
          <CommandParamsFields {...(params.params)} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Run Command
          </Button>
        </FormControl>
      </form>
    </Container>
  );
};

export default CommandPage;
