/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import axios from 'axios'
import gifshot from 'gifshot'
import { Button, Box, Flex, Heading, Text } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider"
import GifResult from "../components/GifResult"
import ImageSelection from "../components/ImageSelection"
import BoxContainer from "../components/BoxContainer"

const BASE_OPTIONS = {
  gifWidth: 600,
  gifHeight: 600,
  frameDuration: 4
}

const PROVIDER_OPTIONS = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID
    }
  }
}

export default function Home() {  
  const [loading, setLoading] = useState({
    gif: false,
    connect: false
  })
  const [gif, setGif] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [web3Modal, setWeb3Modal] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [NFTs, setNFTs] = useState([])

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

  useEffect(() => {
    if (accounts[0]) {
      fetchNFTs(accounts[0])
    }
  }, [accounts])
  
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

  const fetchNFTs = async (address) => {
    try {
      const response = await axios.get('/api/nfts', {
        params: {
          address,
          limit: 9,
          offset: 0
        }
      });

      const assets = response.data.assets.map((a) => ({
        id: a.id,
        image: a.image_url
      }))

      setNFTs(assets)
      setSelectedImages(assets)
    } catch (error) {
      console.log(error)
    }
  }

  const generateGIF = async () => {
    if (selectedImages.length === 0) return
    setLoading({...loading, gif: true});

    gifshot.createGIF({
      ...BASE_OPTIONS,
      images: selectedImages.map(i => i.image)
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
            <ImageSelection images={NFTs} onChange={(imgs) => setSelectedImages(imgs)} />
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
