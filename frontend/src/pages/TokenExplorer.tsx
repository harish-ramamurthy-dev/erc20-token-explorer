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

interface TokensTabProps {
  tokens: Erc20Token[] | null
  isLoading: boolean
  error: boolean
  address: string
  setError: (error: boolean) => void
}

interface LeaderboardTabProps {
  leaderboard: Erc20LeaderBoard[] | null
  isLoading: boolean
  error: boolean
  setError: (error: boolean) => void
}

enum TokenExplorerTabs {
  TOKENS = 'tokens',
  LEADERBOARD = 'leaderboard',
}

const TokensTab: FC<TokensTabProps> = ({ tokens, isLoading, error, address, setError }) => (
  <TabPanel value={TokenExplorerTabs.TOKENS}>
    {isLoading ? (
      <Skeleton animation="wave" />
    ) : (
      <>
        {error && (
          <Snackbar
            open={error}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={() => setError(false)}
          >
            <Alert severity="error" variant="filled" sx={{ width: '100%' }} onClose={() => setError(false)}>
              {`Failed to load the tokens for the wallet address ${address}`}.
            </Alert>
          </Snackbar>
        )}
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
      </>
    )}
  </TabPanel>
)

const LeaderboardTab: FC<LeaderboardTabProps> = ({ leaderboard, isLoading, error, setError }) => (
  <TabPanel value={TokenExplorerTabs.LEADERBOARD}>
    {isLoading ? (
      <Skeleton animation="wave" />
    ) : (
      <>
        {error && (
          <Snackbar
            open={error}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={() => setError(false)}
          >
            <Alert severity="error" variant="filled" sx={{ width: '100%' }} onClose={() => setError(false)}>
              Failed to load the wallets connected to the dapp.
            </Alert>
          </Snackbar>
        )}
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
      </>
    )}
  </TabPanel>
)

const TokenExplorer: FC<Props> = ({ address }): JSX.Element => {
  const [tab, setTab] = useState<TokenExplorerTabs>(TokenExplorerTabs.TOKENS)
  const [tokens, setTokens] = useState<Erc20Token[] | null>(null)
  const [leaderboard, setLeaderBoard] = useState<Erc20LeaderBoard[] | null>(null)
  const [isLoadingTokens, setIsLoadingTokens] = useState<boolean>(false)
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(false)
  const [errorTokens, setErrorTokens] = useState<boolean>(false)
  const [errorLeaderboard, setErrorLeaderboard] = useState<boolean>(false)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setIsLoadingTokens(true)
        const fetchedTokens = await getErc20Tokens(address)
        setTokens(fetchedTokens.data.tokens)
      } catch (error) {
        if ((error as any).name !== 'AbortError' && (error as any).name !== 'CanceledError') {
          setErrorTokens(true)
        }
      } finally {
        setIsLoadingTokens(false)
      }
    }

    const fetchLeaderboard = async () => {
      try {
        setIsLoadingLeaderboard(true)
        const leaderboardData = await getTokenLeaderboard()
        setLeaderBoard(leaderboardData.data.sort((a, b) => b.netWorth - a.netWorth))
      } catch (error) {
        if ((error as any).name !== 'AbortError' && (error as any).name !== 'CanceledError') {
          setErrorLeaderboard(true)
        }
      } finally {
        setIsLoadingLeaderboard(false)
      }
    }

    fetchTokens()
    fetchLeaderboard()
  }, [address])

  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={(_, value) => setTab(value)}>
          <Tab label="Token Balance" value={TokenExplorerTabs.TOKENS} />
          <Tab label="Leaderboard" value={TokenExplorerTabs.LEADERBOARD} />
        </TabList>
      </Box>
      <TokensTab
        tokens={tokens}
        isLoading={isLoadingTokens}
        error={errorTokens}
        address={address}
        setError={setErrorTokens}
      />
      <LeaderboardTab
        leaderboard={leaderboard}
        isLoading={isLoadingLeaderboard}
        error={errorLeaderboard}
        setError={setErrorLeaderboard}
      />
    </TabContext>
  )
}

export default TokenExplorer
