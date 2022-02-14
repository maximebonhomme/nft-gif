import { Button, Box, Image, Icon } from '@chakra-ui/react'
import { ArrowBackIcon, DownloadIcon } from '@chakra-ui/icons'
import BoxContainer from './BoxContainer'

const GifResult = ({ gif, onReset }) => {
  return (
    <BoxContainer>
      <Image borderRadius='xl' src={gif} alt='generated gif' />
      <Box mt={5} textAlign='center'>
        <Button mr={2} colorScheme='gray' onClick={onReset}>
          <ArrowBackIcon mr={2} />
          Go back
        </Button>
        <a ml={2} href={gif} target="_blank" rel="noreferrer">
          <Button colorScheme='green'>
            <DownloadIcon mr={2} />
            Download
          </Button>
        </a>
      </Box>
    </BoxContainer>
  )
}

export default GifResult