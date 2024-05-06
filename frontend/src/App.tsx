import { useAccount, useSignMessage } from 'wagmi'
import AppBar from './components/AppBar'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Alert, Button, List, ListItem, ListItemText, Snackbar } from '@mui/material'
import { signUp } from './services/Auth.service'
import { useEffect, useState } from 'react'
import TokenExplorer from './pages/TokenExplorer'

const App = (): JSX.Element => {
  const message = 'Signup'
  const account = useAccount()
  const [address, setAddress] = useState<string>('')
  const [isAuthenticationError, setIsAuthenticationError] = useState<boolean>(false)
  const { data: signMessageData, signMessage, error: signError, status } = useSignMessage()

  useEffect(() => {
    ;(async () => {
      if (signMessageData) {
        try {
          const recoveredAddress = await signUp(signMessageData)
          setAddress(recoveredAddress.data)
        } catch (error) {
          setIsAuthenticationError(true)
        }
      }
    })()
  }, [signMessageData])

  return (
    <>
      <AppBar />
      <Grid container spacing={3} sx={{ padding: '8px 64px' }}>
        <Grid item xs={12}>
          {address ? (
            <TokenExplorer address={address} />
          ) : (
            <>
              <Typography variant="h4" component="div">
                Account Info
              </Typography>
              {account.status === 'disconnected' && (
                <Alert variant="outlined" severity="error">
                  Connect your wallet to get started.
                </Alert>
              )}
              <List dense={true}>
                <ListItem sx={{ p: 0, m: 0 }}>
                  <ListItemText primary={`Status: ${account.status}`} />
                </ListItem>
                <ListItem sx={{ p: 0, m: 0 }}>
                  <ListItemText primary={`Addresses: ${JSON.stringify(account.addresses) ?? ''}`} />
                </ListItem>
                <ListItem sx={{ p: 0, m: 0 }}>
                  <ListItemText primary={`ChainId: ${account.chainId ?? ''}`} />
                </ListItem>
              </List>
              {account.isConnected && (
                <Button
                  color="primary"
                  disabled={status === 'pending'}
                  variant={status === 'pending' ? 'contained' : 'outlined'}
                  onClick={() => signMessage({ message })}
                >
                  {status === 'pending' ? 'Check Wallet' : 'Create Account'}
                </Button>
              )}
              {signError && (
                <Typography variant="h6" component="div" sx={{ color: '#cc0000', margin: '12px 0' }}>
                  Failed to sign the message. Please try again.
                </Typography>
              )}
              {isAuthenticationError && (
                <Snackbar
                  open={isAuthenticationError}
                  autoHideDuration={3000}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  onClose={() => setIsAuthenticationError(false)}
                >
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                    onClose={() => setIsAuthenticationError(false)}
                  >
                    Failed to authenticate the user. Please try again.
                  </Alert>
                </Snackbar>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default App
