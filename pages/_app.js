import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { init, track } from "insights-js"
import { useEffect } from 'react'

import '../styles/global.css'

const theme = extendTheme({
  fonts: {
    heading: 'Nunito',
    body: 'Nunito',
  },
})

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    init("GicGe4o4UpRbxbTz")
    track({
      id: "page-view"
    })
  }, [])
  
  return (
    <ChakraProvider theme={theme}>
      <Box bg='gray.100' color='gray.900' style={{minHeight: '100vh'}}>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  )
}

export default MyApp
