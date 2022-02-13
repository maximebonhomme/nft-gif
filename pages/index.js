import { useEffect, useState } from "react"
import gifshot from 'gifshot'
import { Button, Box, Flex, Heading } from '@chakra-ui/react'
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider"

const IMAGES = [
  'https://lh3.googleusercontent.com/iq0CgnMi5uCHDjwzqAhM6wheX8erSJ7s_xY9ZuYmXw-geTFB32KB4qZslSGdKoYjBvAKWkcmN_Aqq0KkbOiNdL7Bl30w-u1FFbK0Kg=w600',
  'https://lh3.googleusercontent.com/XlW3yFLEK17KY400oCxIss64KoDGdLXI5DvM0pVKProI5L9JKRheM_bY4HSQfckauccOWOf8lPtO5olGJXo1ZJhgh52inuRz_6Lv-j4=w600',
  'https://lh3.googleusercontent.com/m_O9xhMlRUN0T7RPJQChFvCx44oOF0ZToLitCMX8lc1IwxDGHpBq8dLsWZ0kTyC3MT3qMf9NfjmhqMnfHM2e9QBuzRSASocNa4ZH=w600',
  'https://lh3.googleusercontent.com/AUoSD8YulzhM7mhOBJ7aZmIR7NpQPbcQwUvlbK2Ca0VEoJQ4J4fu3sT53MOUce4mKQndul0OmCk0YdpWP58N4r5021J7AheUuOxgD4w=w600',
  'https://lh3.googleusercontent.com/TdMvivmk-cTtQCYmRLBibsMQKUyk-53S4IWsFOBkFlFrd5sIGqLkOIiYzzDolxZsjBbnPWVk8eSoiaAEYopWVoyme4k8BVBQLfet=w600'
]

const BASE_OPTIONS = {
  gifWidth: 600,
  gifHeight: 600,
  frameDuration: 4
}

const PROVIDER_OPTIONS = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "d5468cdec51b4e139ebedc5bd5ae2251"
    }
  }
}

export default function Home() {  
  const [loading, setLoading] = useState({
    gif: false,
    connect: false
  })
  const [gif, setGif] = useState(null)
  const [web3Modal, setWeb3Modal] = useState(null)
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions: PROVIDER_OPTIONS 
    })

    setWeb3Modal(web3Modal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Modal])
  
  const connectWallet = async () => {
    setLoading({...loading, connect: true})

    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const accounts = await provider.listAccounts();

      setAccounts(accounts)
      setLoading({...loading, connect: false})
    } catch (error) {
      console.log(error)
      setLoading({...loading, connect: false})
    }
  }

  const generateGIF = async () => {
    setLoading({...loading, gif: true});

    gifshot.createGIF({
      ...BASE_OPTIONS,
      images: IMAGES
    }, (obj) => {
      setLoading({...loading, gif: false});
      if (!obj.error) {
        setGif(obj.image)
      }
    });
  }


  return (
    <Box as='main' px={10}>
      <Flex flexDirection='column' alignItems='center'>
        <Heading my={5} as='h2' size='xl'>Turn your NFTs into a gif</Heading>

        <Box my={5}>
          {accounts.length > 0 ? (
            <Button isLoading={loading.gif} colorScheme='blue' onClick={generateGIF}>Generate GIF</Button>
          ) : (
            <Button isLoading={loading.connect} colorScheme='blue' onClick={connectWallet}>Connect Wallet</Button>
          )}
        </Box>

        {gif && (
          <img src={gif} alt='generated gif' />
        )}
      </Flex>
    </Box>
  )
}
