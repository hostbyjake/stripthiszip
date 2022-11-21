import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 1.0
    }
  }
}

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
}

const Testimonial = ({ children }) => {
  return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
      {children}
    </Stack>
  );
};

const TestimonialHeading = ({ children }) => {
  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  );
};

const TestimonialText = ({ children }) => {
  return (
    <Text
      textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}>
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({
  src,
  name,
  title,
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar src={src} alt={name} mb={2} />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

export default function SpeechBubbles() {
  return (
    <Box rounded="md" boxShadow="lg" my={8} bg={useColorModeValue('gray.100', 'gray.600')}>
      <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={'center'}>
          <Heading>Generate Templates for Logic App Deployment</Heading>
        </Stack>
        <motion.ul
        variants={container}
        initial="hidden"
       className='mylist'
        animate="show"
        >
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}>
            <motion.li
            variants={item}
            >
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Database records for each client and shared mailbox</TestimonialHeading>
              <TestimonialText>
             Each client has the ability to hold multiple shared mailboxes, with a fully leveraged Database back-end to store the records for each.
              </TestimonialText>
            </TestimonialContent>
            <motion.div
     
            whileHover={{
              scale: 1.1,
              transition: { duration: 1 },
            }}
            
            >
            <TestimonialAvatar
              src={
                '/database.png'
              }
              name={'Database'}
              title={'Leverages Firestore'}
            />
            </motion.div>
          </Testimonial>
          </motion.li>
          <motion.li variants={item}>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Generate a unique JSON file that is ready to deploy</TestimonialHeading>
              <TestimonialText>
                Once done configuring the options for a shared Mailbox, click to generate the JSON. Copy and paste the JSON outputted into the Azure Portal under 'Code View'
               
              </TestimonialText>
            </TestimonialContent>
            <motion.div
      whileHover={{
        scale: 1.1,
        transition: { duration: 1 },
      }}
      
      >
            <TestimonialAvatar
              src={
                './code.jpg'
              }
              name={'JSON Templates'}
              title={'Ready to Deploy'}
            />
            </motion.div>
          </Testimonial>
          </motion.li>
          <motion.li variants={item}>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Customize and Adjust As You Go</TestimonialHeading>
              <TestimonialText>
              Everytime you want to generate more options, easily adjust and then recreate the JSON file, simply recopy it into the Logic App to update it.
              
              </TestimonialText>
            </TestimonialContent>
            <motion.div
      whileHover={{
        scale: 1.1,
        transition: { duration: 1 },
      }}
      
      >
            <TestimonialAvatar
              src={
                './customize.png'
              }
              name={'Fully Adaptable'}
              title={'Customize'}
            />
            </motion.div>
          </Testimonial>
          </motion.li>
        </Stack>
        </motion.ul>
      </Container>
    </Box>
  );
}
