import { AxiosResponse } from 'axios'
import { axiosInstance } from '../Axios'

export const signUp = async (signature: string): Promise<AxiosResponse<string>> => {
  return axiosInstance.post('auth/signup', { signature })
}
