import {
  Button,
  Checkbox,
  Container,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  TextField,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useNavigate } from 'react-router-dom'

import React, { useEffect, useState } from 'react'
import { useApi } from '../api/api-provider'
import { Approver, Transaction } from './models'
import { useToken } from '../auth/token-provider'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'

// const categories = ['אוכל', 'מטלה', 'חד פעמי', 'ממושך', 'מביך']

const CreateDealPage: React.FC = () => {
  const api = useApi()
  const navigate = useNavigate()
  const [token] = useToken()
  const [categories, setCategories] = useState<[]>([])
  const [currency, setCurrency] = React.useState('')

  const [transaction, setTrasaction] = useState<Transaction>({
    id: 0,
    buyerUser: '',
    sellerUser: '',
    witnessUser: '',
    category: [],
    details: '',
    price: 0,
    status: Approver.ALL,
    transactionName: '',
  })
  useEffect(() => {
    api.get<[]>('/categories').then(res => setCategories(res.data))
  }, [])
  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as string)
  }
  const handleInputChange = (fieldName: string) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      {
        setTrasaction(prev => ({
          ...prev,
          [fieldName]: event.target.value,
        }))
      }
    }
  }
  const handleBuyerUsernameChange = handleInputChange('buyerUser')
  const handleSellerUsernameChange = handleInputChange('sellerUser')
  const handleWitnessUsernameChange = handleInputChange('witnessUser')
  const handleTransactionNameChange = handleInputChange('transactionName')
  const handleDetailsChange = handleInputChange('details')
  const handlePriceChange = handleInputChange('price')
  const handleCategoryChange = (
    event: SelectChangeEvent<typeof categories>,
  ) => {
    const {
      target: { value },
    } = event
    setTrasaction(prev => ({
      ...prev,
      category: typeof value === 'string' ? value.split(',') : value,
    }))
  }
  const handleSubmit = async (event: React.FormEvent, currency: number) => {
    event.preventDefault()
    transaction.price = currency == 0 ? 0 : transaction.price / currency
    const res = await api.post('/transactions', {
      transaction: transaction,
      issuingUsername: token ? token.data.username : '',
    })
    if (res) navigate('/p/profile')
    return
    // need to add socket.io.emit
  }
  const categories_items = categories.map(item => {
    return (
      <MenuItem value={item} id={categories.indexOf(item).toString()}>
        <Checkbox checked={transaction.category.indexOf(item) > -1} />{' '}
        <ListItemText primary={item} />{' '}
      </MenuItem>
    )
  })
  return (
    <ProtectedPage reqScope={Role.USER}>
      <div className='mx-auto my-4 flex w-full max-w-4xl justify-center rounded-[10px] bg-white px-4 py-6 sm:px-6 sm:py-8'>
        <Container component='main' maxWidth='md' className='w-full min-w-0'>
          <div>
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='mb-5 rounded-[10px] bg-white'
              fullWidth
              id='transaction_name'
              label='שם העסקה'
              name='transaction_name'
              autoComplete='שם העסקה'
              autoFocus
              // dir='rtl'
              value={transaction.transactionName}
              onChange={handleTransactionNameChange}
            />
            <div className='mb-5 flex w-full flex-col gap-4 md:flex-row md:flex-wrap md:items-start'>
              <TextField
                variant='outlined'
                margin='normal'
                required
                className='min-w-0 flex-1 rounded-[10px] bg-white md:min-w-[200px]'
                fullWidth
                id='buyer_username'
                label='שם הקונה'
                name='buyer_username'
                autoComplete='שם הקונה'
                autoFocus
                value={transaction.buyerUser}
                onChange={handleBuyerUsernameChange}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                className='min-w-0 flex-1 rounded-[10px] bg-white md:min-w-[200px]'
                fullWidth
                id='witness_username'
                label='שם העד'
                name='witness_username'
                autoComplete='שם העד'
                autoFocus
                value={transaction.witnessUser}
                onChange={handleWitnessUsernameChange}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                className='min-w-0 flex-1 rounded-[10px] bg-white md:min-w-[200px]'
                fullWidth
                id='seller_username'
                label='שם המוכר'
                name='seller_username'
                autoComplete='שם המוכר'
                autoFocus
                value={transaction.sellerUser}
                onChange={handleSellerUsernameChange}
              />
            </div>
            <FormControl fullWidth>
              <InputLabel id='category-label'>קטגוריה</InputLabel>
              <Select
                labelId='category-label'
                id='category-select'
                className='mb-5 bg-white'
                value={transaction.category}
                multiple
                renderValue={selected => selected.join(', ')}
                label='קטגוריה'
                onChange={handleCategoryChange}
              >
                {categories_items}
              </Select>
            </FormControl>
            <Grid container spacing={2} alignItems={'center'}>
              <Grid item xs={10}>
                <TextField
                  variant='outlined'
                  margin='normal'
                  required
                  className='mb-5 rounded-[10px] bg-white'
                  fullWidth
                  id='price'
                  label='מחיר'
                  name='price'
                  autoComplete='0'
                  autoFocus
                  value={transaction.price}
                  onChange={handlePriceChange}
                />
              </Grid>
              <Grid item xs={2}>
                <Select
                  labelId='currencylabel'
                  variant='outlined'
                  className='rounded-[10px] bg-white'
                  autoFocus
                  fullWidth
                  id='currency'
                  value={currency}
                  label='currency'
                  onChange={handleCurrencyChange}
                >
                  <MenuItem value={1}>Witzcoin</MenuItem>
                  <MenuItem value={1 / 30}>ShWitzcoin</MenuItem>
                  <MenuItem value={0}>Adamium</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <TextField
              variant='outlined'
              margin='normal'
              required
              className='mb-5 rounded-[10px] bg-white'
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
              sx={{ mt: 3, mb: 1, py: 1.25 }}
              onClick={event =>
                handleSubmit(event, Number.parseFloat(currency))
              }
            >
              לחיצת ידיים
            </Button>
          </div>
        </Container>
      </div>
    </ProtectedPage>
  )
}

export default CreateDealPage
