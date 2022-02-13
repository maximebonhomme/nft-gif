import { ChakraProvider } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Box bg='purple.900' color='white' style={{minHeight: '100vh'}}>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  )
}

export default MyApp
