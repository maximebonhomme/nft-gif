/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import gifshot from 'gifshot'
import { Button, Box, Flex, Heading, Text } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider"
import GifResult from "../components/GifResult"
import ImageSelection from "../components/ImageSelection"
import BoxContainer from "../components/BoxContainer"

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
  const [selectedImages, setSelectedImages] = useState(IMAGES)
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
    if (selectedImages.length === 0) return
    setLoading({...loading, gif: true});

    gifshot.createGIF({
      ...BASE_OPTIONS,
      images: selectedImages
    }, (obj) => {
      setLoading({...loading, gif: false});
      if (!obj.error) {
        setGif(obj.image)
      }
    });
  }

  const resetGif = () => {
    setGif(null)
  }

  return (
    <Box as='main' px={[4, 6, 10]} py={8}>
      <Flex flexDirection='column' alignItems='center'>
        <Heading as='h2' size='xl'>Gif Wallet</Heading>
        <Text>Turn your NFT collection into a GIF</Text>

        <Box my={5}>
          {accounts.length === 0 && (
            <Button isLoading={loading.connect} colorScheme='green' onClick={connectWallet}>Connect Wallet</Button>
          )}
        </Box>

        {gif && (
          <GifResult gif={gif} onReset={resetGif} />
        )}
        {accounts.length > 0 && !gif && (
          <BoxContainer>
            <ImageSelection images={IMAGES} onChange={(imgs) => setSelectedImages(imgs)} />
            <Button mt={5} isLoading={loading.gif} isDisabled={selectedImages.length < 2} colorScheme='green' onClick={generateGIF}>
              <RepeatIcon mr={2} />
              Generate GIF
            </Button>
          </BoxContainer>
        )}
      </Flex>
    </Box>
  )
}
