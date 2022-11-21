import {
  Stack,
  Heading,
  Text,
  Button,
  useColorMode,
  Container,
  Link,
  Box,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react'

import { motion } from 'framer-motion'


import {
  fadeInUp,
  letterSpace,
  simpleOpacity,
  stagger,
  scaleUp,
} from '@/theme/animations'

const Title = ({ title }) => {
  const MotionHeading = motion(Heading)
  const MotionBox = motion(Box)
  const MotionStack = motion(Stack)

  const surNameSize = useBreakpointValue({ base: '3xl', md: '3xl' })

  return (
    <MotionBox
      initial="initial"
      animate="animate"
      position={{ '2xl': 'fixed' }}
      maxWidth={{ '2xl': '34%' }}
      top={{ lg: 0 }}
    >
      <MotionStack variants={stagger} spacing={6} w="100">

        <MotionHeading
          as="h2"
          size={surNameSize}
          variant="emphasis"
          variants={letterSpace}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {title}
        </MotionHeading>
      </MotionStack>
    </MotionBox>
  )

}

export default Title