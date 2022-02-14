import { Button, Box, Image } from '@chakra-ui/react'
import BoxContainer from './BoxContainer'

const GifResult = ({ gif, onReset }) => {
  return (
    <BoxContainer>
      <Image borderRadius='xl' src={gif} alt='generated gif' />
      <Box mt={5} textAlign='center'>
        <Button mr={2} colorScheme='gray' onClick={onReset}>Go back</Button>
        <a ml={2} href={gif} target="_blank" rel="noreferrer">
          <Button colorScheme='green'>Download</Button>
        </a>
      </Box>
    </BoxContainer>
  )
}

export default GifResult