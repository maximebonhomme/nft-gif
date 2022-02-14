import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

import '../styles/global.css'

const theme = extendTheme({
  fonts: {
    heading: 'Nunito',
    body: 'Nunito',
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Box bg='gray.100' color='gray.900' style={{minHeight: '100vh'}}>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  )
}

export default MyApp
