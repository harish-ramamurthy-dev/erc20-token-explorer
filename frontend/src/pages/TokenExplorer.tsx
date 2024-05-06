import { FC, useEffect, useState } from 'react'
import { getErc20Tokens, getTokenLeaderboard } from '../services/Token.service'
import { Erc20Token } from '../interfaces/Erc20.interface'
import {
  Tab,
  Box,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Erc20LeaderBoard } from '../interfaces/Erc20Leaderboard.interface'

interface Props {
  address: string
}

enum TokenExplorerTabs {
  TOKENS = 'tokens',
  LEADERBOARD = 'leaderboard',
}

const TokenExplorer: FC<Props> = ({ address }) => {
  const [tab, setTab] = useState<TokenExplorerTabs>(TokenExplorerTabs.TOKENS)
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false)
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false)
  const [tokens, setTokens] = useState<Erc20Token[] | null>(null)
  const [leaderboard, setLeaderBoard] = useState<Erc20LeaderBoard[] | null>(null)
  const [isLoadingTokensError, setIsLoadingTokensError] = useState<boolean>(false)
  const [isLoadingLeaderboardError, setIsLoadingLeaderboardError] = useState<boolean>(false)

  useEffect(() => {
    const tokenAbortController = new AbortController()
    const tokenSignal = tokenAbortController.signal

    const leaderboardAbortController = new AbortController()
    const leaderboardSignal = leaderboardAbortController.signal

    const getTokens = async () => {
      try {
        setIsLoadingTokens(true)
        const fetchedTokens = await getErc20Tokens(address, tokenSignal)
        setTokens(fetchedTokens.data.tokens)
      } catch (error) {
        if ((error as any).name !== 'AbortError' && (error as any).name !== 'CanceledError') {
          setIsLoadingTokensError(true)
        }
      } finally {
        setIsLoadingTokens(false)
      }
    }
    const getLeaderboard = async () => {
      try {
        setIsLoadingLeaderboard(true)
        const leadernboard = await getTokenLeaderboard(leaderboardSignal)
        setLeaderBoard(leadernboard.data.sort((a, b) => b.netWorth - a.netWorth))
      } catch (error) {
        if ((error as any).name !== 'AbortError' && (error as any).name !== 'CanceledError') {
          setIsLoadingLeaderboardError(true)
        }
      } finally {
        setIsLoadingLeaderboard(false)
      }
    }
    getTokens()
    getLeaderboard()

    return () => {
      tokenAbortController.abort()
      leaderboardAbortController.abort()
    }
  }, [])

  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={(_, value) => setTab(value)}>
          <Tab label="Token Balance" value={TokenExplorerTabs.TOKENS} />
          <Tab label="Leaderboard" value={TokenExplorerTabs.LEADERBOARD} />
        </TabList>
      </Box>
      {isLoadingTokens ? (
        <Skeleton animation="wave" />
      ) : (
        <TabPanel value={TokenExplorerTabs.TOKENS}>
          {tokens?.length === 0 ? (
            <Typography variant="body2" component="div">
              No tokens available in the wallet.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Symbol</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokens?.map((token) => (
                    <TableRow key={token.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {token.name}
                      </TableCell>
                      <TableCell align="right">{token.symbol}</TableCell>
                      <TableCell align="right">{token.balance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {isLoadingTokensError && (
            <Snackbar
              open={isLoadingTokensError}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              onClose={() => setIsLoadingTokensError(false)}
            >
              <Alert
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
                onClose={() => setIsLoadingTokensError(false)}
              >
                {`Failed to load the tokens for the wallet address ${address}`}.
              </Alert>
            </Snackbar>
          )}
        </TabPanel>
      )}
      {isLoadingLeaderboard ? (
        <Skeleton animation="wave" />
      ) : (
        <TabPanel value={TokenExplorerTabs.LEADERBOARD}>
          {leaderboard?.length === 0 ? (
            <Typography variant="body2" component="div">
              No wallets connected to the app.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Address</TableCell>
                    <TableCell align="right">Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard?.map((board) => (
                    <TableRow key={board.address} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {board.address}
                      </TableCell>
                      <TableCell align="right">{board.netWorth}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {isLoadingLeaderboardError && (
            <Snackbar
              open={isLoadingLeaderboardError}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              onClose={() => setIsLoadingLeaderboardError(false)}
            >
              <Alert
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
                onClose={() => setIsLoadingLeaderboardError(false)}
              >
                {`Failed to load the wallets connected to the dapp.`}.
              </Alert>
            </Snackbar>
          )}
        </TabPanel>
      )}
    </TabContext>
  )
}

export default TokenExplorer
