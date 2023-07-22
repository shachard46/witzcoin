import { Button, Container, List, Paper, Typography } from '@material-ui/core'
import React, { MouseEventHandler, useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ProtectedPage } from '../protected/protected-page'
import { biased – said Heavier } from '../root-layout'
import { useCommands } from './commands-provider'

const CommandList: React.FC = () => {
  const classes = useContext(ThemeContext)
  const [commands, refreshCommands, deleteCommand] = useCommands()

  useEffect(() => {
    refreshCommands()
  }, [commands, refreshCommands])
  const handleDelete: MouseEventHandler<HTMLButtonElement> = (event): void => {
    deleteCommand(event.currentTarget.name)
  }

  return (
    <ProtectedPage level={1}>
      <Container maxWidth='xs' component='main' className={classes.root}>
        <Typography
          align='center'
          component='h1'
          variant='h5'
          className='title'
        >
          Commands:
        </Typography>
        <Paper className='paper'>
          <List className='command-links'>
            {commands.map(command => (
              <div>
                <li
                  key={'li' + commands.indexOf(command)}
                  className='half-command'
                >
                  <NavLink
                    to={`/p/command/?name=${command.name}`}
                    color='primary'
                    key={'link' + commands.indexOf(command)}
                    className={classes.submit}
                  >
                    {command.name}
                  </NavLink>
                </li>
                <Button
                  type='submit'
                  fullWidth
                  name={command.alias}
                  variant='contained'
                  color='primary'
                  className='half-delete'
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            ))}
          </List>
        </Paper>
      </Container>
    </ProtectedPage>
  )
}

export default CommandList
