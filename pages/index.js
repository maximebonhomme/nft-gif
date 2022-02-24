import { useCallback, useEffect, useState } from "react"
import axios from 'axios'
import gifshot from 'gifshot'
import { Button, Box, Flex, Heading, Text, Link, Icon } from '@chakra-ui/react'
import { RepeatIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { SiGithub } from "react-icons/si";
import Head from 'next/head'

import GifResult from "../components/GifResult"
import ImageSelection from "../components/ImageSelection"
import BoxContainer from "../components/BoxContainer"
import { getFrameDuration } from "../helpers/gif"

const PROVIDER_OPTIONS = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID
    }
  }
}

const LIMIT = 9

export default function Home() {  
  const [loading, setLoading] = useState({
    gif: false,
    connect: false,
    nfts: false
  })
  const [gif, setGif] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [web3Modal, setWeb3Modal] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [NFTs, setNFTs] = useState([])
  const [page, setPage] = useState(0)

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, page])
  
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
    setLoading({...loading, nfts: true})

    try {
      const response = await axios.get('/api/nfts', {
        params: {
          address,
          limit: LIMIT,
          offset: page * LIMIT
        }
      });

      console.log('response', response)

      const assets = response.data.assets.map((a) => ({
        id: a.id,
        image: a.image_url
      }))

      setNFTs([...NFTs, ...assets])
      setLoading({...loading, nfts: false})
    } catch (error) {
      console.log(error)
      setLoading({...loading, nfts: false})
    }
  }

  const generateGIF = async () => {
    if (selectedImages.length === 0) return
    setLoading({...loading, gif: true});

    gifshot.createGIF({
      gifWidth: 600,
      gifHeight: 600,
      frameDuration: 3,
      numWorkers: navigator.hardwareConcurrency || 2,
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
    <Box as='main' px={[4, 6, 10]} pt={10} pb={20}>
      <Head>
        <title>GIF Wallet</title>
        <meta property="og:title" content="GIF Wallet" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:url" content="https://gifwallet.xyz" />
        <meta property="og:image" content="/gifwallet-og.img" />
      </Head>
      <Flex flexDirection='column' alignItems='center'>
        <Heading as='h2' size='3xl' color='gray.700'>GIF Wallet</Heading>
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
          <>
            <BoxContainer>
              <ImageSelection images={NFTs} onChange={(imgs) => setSelectedImages(imgs)} />
              <Button mt={5} isLoading={loading.nfts} colorScheme='gray' onClick={() => { setPage(page + 1) }}>
                <RepeatIcon mr={2} />
                Load more
              </Button>
            </BoxContainer>
            <Button size='lg' mt={5} isLoading={loading.gif} isDisabled={selectedImages.length < 2} colorScheme='green' onClick={generateGIF}>
              <CheckCircleIcon mr={2} />
              Generate GIF
            </Button>
          </>
        )}
      </Flex>
      <Flex position='fixed' bottom={1} right={0}>
        <Box fontSize='s' bg='white' borderRadius='xl' p={3}>
          <Link ml={1} href="https://twitter.com/pixel_arts">himlate.eth</Link>
        </Box>
        <Box fontSize='s' bg='white' borderRadius='xl' p={3} mx={1} >
          <Link ml={1} href="https://github.com/maximebonhomme">
            <Icon as={SiGithub} />
          </Link>
        </Box>
      </Flex>
      
    </Box>
  )
}
