import { useAccount, useAccountEffect, useSignMessage } from 'wagmi'
import AppBar from './components/AppBar'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { Alert, Button, Snackbar } from '@mui/material'
import { signUp } from './services/Auth.service'
import { useEffect, useState } from 'react'
import TokenExplorer from './pages/TokenExplorer'
import AccountInfo from './components/AccountInfo'

const App = (): JSX.Element => {
  const message = 'Signup'
  const account = useAccount()
  const [address, setAddress] = useState<string>('')
  const [isAuthenticationError, setIsAuthenticationError] = useState<boolean>(false)
  const { data: signMessageData, signMessage, error: signError, status } = useSignMessage()
  useAccountEffect({
    onDisconnect() {
      setAddress('')
    },
  })

  useEffect(() => {
    if (signMessageData) {
      ;(async () => {
        try {
          const recoveredAddress = await signUp(signMessageData)
          setAddress(recoveredAddress.data)
        } catch (error) {
          setIsAuthenticationError(true)
        }
      })()
    }
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
              <AccountInfo account={account} />
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
