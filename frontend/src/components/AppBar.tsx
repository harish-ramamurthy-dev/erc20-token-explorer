import { default as MuiAppBar } from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const WalletIcon = (): JSX.Element => (
  <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 0.5 }}>
    <AccountBalanceWalletOutlined />
  </IconButton>
)

const AppTitle = (): JSX.Element => (
  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    ERC20 Token Explorer
  </Typography>
)

const AppBar = (): JSX.Element => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position="static">
        <Toolbar>
          <WalletIcon />
          <AppTitle />
          <ConnectButton />
        </Toolbar>
      </MuiAppBar>
    </Box>
  )
}

export default AppBar
