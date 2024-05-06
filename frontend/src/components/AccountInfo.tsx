import { List, ListItem, ListItemText } from '@mui/material'
import { FC } from 'react'
import { UseAccountReturnType } from 'wagmi'

interface Props {
  account: UseAccountReturnType
}

const AccountInfo: FC<Props> = ({ account }): JSX.Element => (
  <List dense>
    <ListItem>
      <ListItemText primary={`Status: ${account.status}`} />
    </ListItem>
    <ListItem>
      <ListItemText primary={`Addresses: ${account.addresses?.toString() ?? ''}`} />
    </ListItem>
    <ListItem>
      <ListItemText primary={`ChainId: ${account.chainId ?? ''}`} />
    </ListItem>
  </List>
)

export default AccountInfo
