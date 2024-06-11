import { Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { User } from '../transaction/models'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: 'auto',
  marginBottom: 20,
  maxWidth: 400,
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
}))

const PositiveBalance = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
}))

const NegativeBalance = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
}))
const AccountDetails: React.FC<{ user: User }> = ({ user }) => {
  return (
    <StyledPaper>
      <Typography variant='h5' gutterBottom>
        הפרופיל של {user.username}
      </Typography>
      <Typography variant='body1'>
        עו"ש:{' '}
        {user.balance >= 0 ? (
          <PositiveBalance component='span'>
            ${user.balance.toFixed(2)}
          </PositiveBalance>
        ) : (
          <NegativeBalance component='span'>
            ${user.balance.toFixed(2)}
          </NegativeBalance>
        )}
      </Typography>
      <Typography variant='body1'>
        סכום מעסקאות ממתינות:{' '}
        {user.pending >= 0 ? (
          <PositiveBalance component='span'>
            ${user.pending.toFixed(2)}
          </PositiveBalance>
        ) : (
          <NegativeBalance component='span'>
            ${user.pending.toFixed(2)}
          </NegativeBalance>
        )}
      </Typography>
    </StyledPaper>
  )
}

export default AccountDetails
