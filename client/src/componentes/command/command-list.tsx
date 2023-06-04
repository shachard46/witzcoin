import { Container, List, Paper, Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ProtectedPage } from '../protected/protected-page'
import { ThemeContext } from '../root-layout'
import { useCommands } from './commands-provider'

const CommandList: React.FC = () => {
  const classes = useContext(ThemeContext)
  const commands = useCommands()
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
              <li key={'li' + commands.indexOf(command)}>
                <NavLink
                  to={`/p/command/?name=${command.name}`}
                  color='primary'
                  key={'link' + commands.indexOf(command)}
                  className={classes.submit}
                >
                  {command.name}
                </NavLink>
              </li>
            ))}
          </List>
        </Paper>
      </Container>
    </ProtectedPage>
  )
}

export default CommandList
