import { useEffect, useState } from "react"
import { Button, Grid, GridItem, IconButton, Image, AspectRatio } from '@chakra-ui/react'
import { CheckIcon, AddIcon } from '@chakra-ui/icons'

const ImageSelection = ({ images, onChange }) => {
  const [selectedImages, setSelectedImages] = useState(images)
  
  const toggleImage = (image) => {
    const exists = selectedImages.includes(image)

    if (exists) {
      setSelectedImages(selectedImages.filter((c) => { return c !== image }))
    } else {
      setSelectedImages([...selectedImages, image])
    }
  }

  useEffect(() => {
    onChange(selectedImages)
  }, [selectedImages, onChange])

  return (
    <>
      <Button size='xs' mb={5} mr={1} colorScheme='gray' onClick={() => { setSelectedImages(images) }}>Select all</Button>
      <Button size='xs' mb={5} ml={1} colorScheme='gray' onClick={() => { setSelectedImages([]) }}>Deselect all</Button>
      <Grid templateColumns={['repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={4}>
        {images.map((image, index) => {
          const active = selectedImages.includes(image)

          return (
            <GridItem key={image.id} w='100%' position='relative' onClick={() => { toggleImage(image) }} cursor='pointer'>
              <AspectRatio w='100%' ratio={1}>
                <Image src={image.image} w='100%' alt='image' objectFit='cover' borderRadius='xl' />
              </AspectRatio>
              <IconButton
                size='xs'
                position='absolute'
                top={3}
                left={3}
                aria-label={active ? 'deselect' : 'select'}
                icon={active ? <CheckIcon /> : <AddIcon />}
                color={active ? 'green' : 'white'}
                colorScheme={active ? 'gray' : 'blackAlpha'}
                isRound
              />
            </GridItem>
          )
        })}
      </Grid>
    </>
  )
}

export default ImageSelection