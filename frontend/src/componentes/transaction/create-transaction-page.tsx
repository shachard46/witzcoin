import {
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useNavigate } from 'react-router-dom'

import React, { useEffect, useState } from 'react'
import { useApi } from '../api/api-provider'
import { Approver, Transaction } from './models'
import { useToken } from '../auth/token-provider'
import { ProtectedPage } from '../protected/protected-page'
import { Role } from '../auth/models'
import { EscrowFormHeader } from './create/escrow-form-header'
import { HandshakeButton } from './create/handshake-button'
import { IconTextInput } from './create/icon-text-input'
import { LabeledField } from './create/labeled-field'
import { formTextareaClass } from './create/form-input-classes'
import { TextInput } from './create/text-input'

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
      <MenuItem key={String(item)} value={item} id={categories.indexOf(item).toString()}>
        <Checkbox checked={transaction.category.indexOf(item) > -1} />{' '}
        <ListItemText primary={item} />{' '}
      </MenuItem>
    )
  })
  return (
    <ProtectedPage reqScope={Role.USER}>
      <div className='flex w-full justify-center'>
        <div className='custom-shadow w-full max-w-3xl rounded-2xl bg-white p-card-padding'>
          <EscrowFormHeader />
          <div className='flex flex-col gap-gutter'>
            <LabeledField label='Transaction Name' htmlFor='transaction_name'>
              <TextInput
                id='transaction_name'
                name='transaction_name'
                autoComplete='transaction name'
                autoFocus
                placeholder='e.g., Domain Name Transfer'
                value={transaction.transactionName}
                onChange={handleTransactionNameChange}
              />
            </LabeledField>

            <div className='grid grid-cols-1 gap-gutter md:grid-cols-3'>
              <LabeledField label='Buyer account id' htmlFor='buyer_username'>
                <IconTextInput
                  id='buyer_username'
                  name='buyer_username'
                  autoComplete='username'
                  placeholder='Username (account id)'
                  value={transaction.buyerUser}
                  onChange={handleBuyerUsernameChange}
                  icon={
                    <span className='material-symbols-outlined text-lg'>
                      person
                    </span>
                  }
                />
              </LabeledField>
              <LabeledField label='Seller ID' htmlFor='seller_username'>
                <IconTextInput
                  id='seller_username'
                  name='seller_username'
                  autoComplete='username'
                  placeholder='Wallet Address'
                  value={transaction.sellerUser}
                  onChange={handleSellerUsernameChange}
                  icon={
                    <span className='material-symbols-outlined text-lg'>
                      storefront
                    </span>
                  }
                />
              </LabeledField>
              <LabeledField
                label='Witness account id (optional)'
                htmlFor='witness_username'
              >
                <IconTextInput
                  id='witness_username'
                  name='witness_username'
                  autoComplete='username'
                  placeholder='Username (account id)'
                  value={transaction.witnessUser}
                  onChange={handleWitnessUsernameChange}
                  icon={
                    <span className='material-symbols-outlined text-lg'>
                      gavel
                    </span>
                  }
                />
              </LabeledField>
            </div>

            <div className='grid grid-cols-1 gap-gutter md:grid-cols-2'>
              <LabeledField label='Category' htmlFor='category-select'>
                <FormControl fullWidth>
                  <Select
                    id='category-select'
                    variant='outlined'
                    className='rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface [&_.MuiOutlinedInput-notchedOutline]:border-outline-variant [&_.MuiSelect-icon]:text-tertiary'
                    value={transaction.category}
                    multiple
                    displayEmpty
                    renderValue={selected =>
                      selected.length === 0
                        ? 'Select Category'
                        : (selected as string[]).join(', ')
                    }
                    onChange={handleCategoryChange}
                    inputProps={{ 'aria-label': 'Category' }}
                  >
                    {categories_items}
                  </Select>
                </FormControl>
              </LabeledField>

              <div className='flex flex-col gap-2'>
                <label
                  className='font-label-caps text-label-caps text-on-surface-variant'
                  htmlFor='price'
                >
                  Escrow Amount
                </label>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-stretch'>
                  <div className='relative min-w-0 flex-1'>
                    <span className='text-primary-container font-h3 pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-bold'>
                      W
                    </span>
                    <input
                      id='price'
                      name='price'
                      autoComplete='off'
                      placeholder='0.00'
                      step='0.01'
                      type='number'
                      value={transaction.price}
                      onChange={handlePriceChange}
                      className='font-data-mono text-data-mono h-12 w-full rounded-lg border border-outline-variant bg-surface-container-low pl-12 pr-4 text-on-surface transition-shadow outline-none focus-gold'
                    />
                  </div>
                  <FormControl className='min-w-0 shrink-0 sm:w-40'>
                    <Select
                      variant='outlined'
                      className='rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface [&_.MuiOutlinedInput-notchedOutline]:border-outline-variant'
                      id='currency'
                      value={currency}
                      onChange={handleCurrencyChange}
                      inputProps={{ 'aria-label': 'Currency' }}
                    >
                      <MenuItem value={1}>Witzcoin</MenuItem>
                      <MenuItem value={1 / 30}>ShWitzcoin</MenuItem>
                      <MenuItem value={0}>Adamium</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>

            <LabeledField label='Terms & Conditions' htmlFor='details'>
              <textarea
                id='details'
                name='details'
                autoComplete='off'
                rows={5}
                placeholder='Describe the deliverables, timeline, and release conditions...'
                value={transaction.details}
                onChange={e =>
                  handleDetailsChange(
                    e as unknown as React.ChangeEvent<HTMLInputElement>,
                  )
                }
                className={formTextareaClass}
              />
            </LabeledField>

            <div className='pt-4'>
              <HandshakeButton
                onClick={event =>
                  handleSubmit(event, Number.parseFloat(currency))
                }
              >
                Handshake
              </HandshakeButton>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  )
}

export default CreateDealPage
