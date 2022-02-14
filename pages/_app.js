import { ChakraProvider } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Box bg='gray.100' color='gray.900' style={{minHeight: '100vh'}}>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  )
}

export default MyApp
