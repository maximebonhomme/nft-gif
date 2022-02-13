import { useState } from "react"
import gifshot from 'gifshot'
import { Button, ButtonGroup } from '@chakra-ui/react'

const IMAGES = [
  'https://lh3.googleusercontent.com/iq0CgnMi5uCHDjwzqAhM6wheX8erSJ7s_xY9ZuYmXw-geTFB32KB4qZslSGdKoYjBvAKWkcmN_Aqq0KkbOiNdL7Bl30w-u1FFbK0Kg=w600',
  'https://lh3.googleusercontent.com/XlW3yFLEK17KY400oCxIss64KoDGdLXI5DvM0pVKProI5L9JKRheM_bY4HSQfckauccOWOf8lPtO5olGJXo1ZJhgh52inuRz_6Lv-j4=w600',
  'https://lh3.googleusercontent.com/m_O9xhMlRUN0T7RPJQChFvCx44oOF0ZToLitCMX8lc1IwxDGHpBq8dLsWZ0kTyC3MT3qMf9NfjmhqMnfHM2e9QBuzRSASocNa4ZH=w600',
  'https://lh3.googleusercontent.com/AUoSD8YulzhM7mhOBJ7aZmIR7NpQPbcQwUvlbK2Ca0VEoJQ4J4fu3sT53MOUce4mKQndul0OmCk0YdpWP58N4r5021J7AheUuOxgD4w=w600',
  'https://lh3.googleusercontent.com/TdMvivmk-cTtQCYmRLBibsMQKUyk-53S4IWsFOBkFlFrd5sIGqLkOIiYzzDolxZsjBbnPWVk8eSoiaAEYopWVoyme4k8BVBQLfet=w600'
]

const BASE_OPTIONS = {
  gifWidth: 600,
  gifHeight: 600,
  frameDuration: 3
}

export default function Home() {  
  const [loading, setLoading] = useState(false)
  const [gif, setGif] = useState(null)
  // const imageRefs = useRef([])
  
  const generateGIF = async () => {
    setLoading(true);

    gifshot.createGIF({
      ...BASE_OPTIONS,
      images: IMAGES
    }, (obj) => {
      setLoading(false);
      if (!obj.error) {
        setGif(obj.image)
      }
    });
  }


  return (
    <main>
      <div>Turn your NFTs into a gif</div>

        <Button isLoading={loading} colorScheme='blue' onClick={generateGIF}>Generate GIF</Button>

      {gif && (
        <img src={gif} alt='generated gif' />
      )}
    </main>
  )
}
