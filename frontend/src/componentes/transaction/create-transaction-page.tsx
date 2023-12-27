import {
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'

import React, { useState } from 'react'
import { useApi } from '../api/api-provider'
import { Approver, Transaction } from './models'
import { useToken } from '../auth/token-provider'

const categories = ['אוכל', 'מטלה', 'חד פעמי', 'ממושך', 'מביך']

const CreateDealPage: React.FC = () => {
  const api = useApi()
  const [token,] = useToken()
  const [transaction, setTrasaction] = useState<Transaction>({
    buyerUsername: '',
    sellerUsername: '',
    witnessUsername: '',
    category: [],
    details: '',
    price: 0,
    status: Approver.ALL,
    transactionName: '',
  })
  const handleInputChange = (fieldName: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      {
        setTrasaction((prev) => ({
          ...prev,
          [fieldName]: event.target.value,
        }))
    }
    }
  }
  const handleBuyerUsernameChange = handleInputChange('buyerUsername')
  const handleSellerUsernameChange = handleInputChange('sellerUsername')
  const handleWitnessUsernameChange = handleInputChange('witnessUsername')
  const handleTransactionNameChange = handleInputChange('transactionName')
  const handleDetailsChange = handleInputChange('details')
  const handlePriceChange = handleInputChange('price')
  const handleCategoryChange = (
    event: SelectChangeEvent<typeof categories>,
  ) => {
    const {
      target: { value },
    } = event
    setTrasaction((prev) => ({
      ...prev,
      category:typeof value === 'string' ? value.split(',') : value,
    })
    )
  }
  const handleSubmit = async (event: React.FormEvent)=> {
    event.preventDefault()
    const res = await api.post('/transactions', {transaction: transaction, issuing_username: token? token.access_token.username : ''})
    if (res)
      return
    // need to add socket.io.emit
  }
  const categories_items = categories.map(item => {
    return (
      <MenuItem value={item}>
        <Checkbox checked={transaction.category.indexOf(item) > -1} />{' '}
        <ListItemText primary={item} />{' '}
      </MenuItem>
    )
  })
  return (
    <div className='deal-container'>
      <Container component='main' maxWidth='md' className='root'>
        <div>
          <Typography component='h1' variant='h5' align='center'>
            יצירת עסקה
          </Typography>
          <TextField
            variant='outlined'
            margin='normal'
            required
            className='textField'
            fullWidth
            id='transaction_name'
            label='שם העסקה'
            name='transaction_name'
            autoComplete='שם העסקה'
            autoFocus
            value={transaction.transactionName}
            onChange={handleTransactionNameChange}
          />
          <div className='usernames-row row'>
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='deal-username'
              fullWidth
              id='buyer_username'
              label='שם הקונה'
              name='buyer_username'
              autoComplete='שם הקונה'
              autoFocus
              value={transaction.buyerUsername}
              onChange={handleBuyerUsernameChange}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='deal-username'
              fullWidth
              id='witness_username'
              label='שם העד'
              name='witness_username'
              autoComplete='שם העד'
              autoFocus
              value={transaction.witnessUsername}
              onChange={handleWitnessUsernameChange}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='deal-username'
              fullWidth
              id='seller_username'
              label='שם המוכר'
              name='seller_username'
              autoComplete='שם המוכר'
              autoFocus
              value={transaction.sellerUsername}
              onChange={handleSellerUsernameChange}
            />
          </div>
          <FormControl fullWidth>
            <InputLabel id='category-label'>קטגוריה</InputLabel>
            <Select
              labelId='category-label'
              id='category-select'
              className='row'
              value={transaction.category}
              multiple
              renderValue={selected => selected.join(', ')}
              label='קטגוריה'
              onChange={handleCategoryChange}
            >
              {categories_items}
            </Select>
          </FormControl>
         < TextField
            variant='outlined'
            margin='normal'
            required
            className='deal-notes row'
            fullWidth
            multiline
            minRows={5}
            id='price'
            label='מחיר'
            name='price'
            autoComplete='0'
            autoFocus
            value={transaction.details}
            onChange={handlePriceChange}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            className='deal-notes row'
            fullWidth
            multiline
            minRows={5}
            id='details'
            label='פירוט העסקה'
            name='details'
            autoComplete='פירוט העסקה'
            autoFocus
            value={transaction.details}
            onChange={handleDetailsChange}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className='submit'
            onClick={handleSubmit
            }
          >
            לחיצת ידיים
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default CreateDealPage