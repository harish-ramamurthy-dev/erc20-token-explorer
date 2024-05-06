import { AxiosResponse } from 'axios'
import { axiosInstance } from '../Axios'
import { Erc20TokenWithNetWorth } from '../interfaces/Erc20.interface'
import { Erc20LeaderBoard } from '../interfaces/Erc20Leaderboard.interface'

export const getErc20Tokens = async (address: string): Promise<AxiosResponse<Erc20TokenWithNetWorth>> => {
  return axiosInstance.get(`token/erc20/${address}`)
}

export const getTokenLeaderboard = async (): Promise<AxiosResponse<Erc20LeaderBoard[]>> => {
  return axiosInstance.get('token/erc20/leaderboard')
}
