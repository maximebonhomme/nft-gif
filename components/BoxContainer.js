import { Box } from '@chakra-ui/react'

const BoxContainer = ({ children }) => {
  return (
    <Box boxShadow='2xl' textAlign='center' w={600} bg='white' borderRadius='2xl' p={6}>
      {children}
    </Box>
  )
}

export default BoxContainer