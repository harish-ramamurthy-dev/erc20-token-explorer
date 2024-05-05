export const MOCK_MORALIS_ERC20_RESPONSE = [
  {
    tokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    symbol: 'ETH',
    name: 'Ether',
    logo: 'https://cdn.moralis.io/eth/0x.png',
    thumbnail: 'https://cdn.moralis.io/eth/0x_thumb.png',
    decimals: 18,
    balance: '9169138217756822',
    possibleSpam: false,
    verifiedContract: true,
    balanceFormatted: '0.009169138217756822',
    usdPrice: 3131.463710781688,
    usdPrice24hrPercentChange: 0.8289100119639181,
    usdPrice24hrUsdChange: 25.743624736800484,
    usdValue: 28.71282358804697,
    nativeToken: true,
    portfolioPercentage: 35.5395,
  },
  {
    tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    logo: 'https://logo.moralis.io/0x1_0xdac17f958d2ee523a2206206994597c13d831ec7_0b0d126af6c744c185e112a2c8dc1495',
    thumbnail:
      'https://logo.moralis.io/0x1_0xdac17f958d2ee523a2206206994597c13d831ec7_0b0d126af6c744c185e112a2c8dc1495',
    decimals: 6,
    balance: '52035000',
    possibleSpam: false,
    verifiedContract: true,
    balanceFormatted: '52.035',
    usdPrice: 0.9997443641204108,
    usdPrice24hrPercentChange: -0.047429523241757934,
    usdPrice24hrUsdChange: -0.0004743989907182167,
    usdValue: 52.021697987005574,
    nativeToken: false,
    portfolioPercentage: 64.3902,
  },
];

export const MOCK_MORALIS_ADDRES_NET_WORTH_RESPONSE = {
  result: {
    totalNetworthUsd: '2818201.30',
    chains: [
      {
        chain: 'eth',
        nativeBalance: '605370743007649911133',
        nativeBalanceFormatted: '605.370743007649911133',
        nativeBalanceUsd: '1908759.08',
        tokenBalanceUsd: '909442.22',
        networthUsd: '2818201.30',
      },
    ],
  },
};
