import { Container, Typography } from '@material-ui/core'
import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { CommandsContext } from '../App'
import { ThemeContext } from './root-layout'

const CommandList: React.FC = () => {
  const classes = useContext(ThemeContext)
  const commands = useContext(CommandsContext)
  const navigate = useNavigate()
  const handleCommand = (name: string): void => {
    navigate(`/commands/${name}`)
  }

  return (
    <Container maxWidth='xs' component='main' className={classes.root}>
      <Typography align='center' component='h1' variant='h5'>
        Commands:
      </Typography>
      {commands.map(command => (
        <NavLink
          to={`/command/?name=${command.name}`}
          color='primary'
          className={classes.submit}
          onClick={() => {
            handleCommand(command.name)
          }}
        >
          {command.name}
        </NavLink>
      ))}
    </Container>
  )
}

export default CommandList
