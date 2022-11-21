import {
    Stack,
    Flex,
    Button,
    Text,
    VStack,
    useBreakpointValue,
  } from '@chakra-ui/react';
  import CompanySelect from './CompanySelect';
  export default function Hero() {
    return (
      <Flex
        w={'100vw'}
        h={'60vh'}
        backgroundImage={
          'url(emailhero.jpg)'
        }
        backgroundSize={'contain'}
        // backgroundRepeat="no-repeat"
        backgroundPosition={'center'}>
        <VStack
          w={'full'}
   
          justify={'center'}
          align={'flex-start'}
          px={useBreakpointValue({ base: 4, md: 8 })}
          bgGradient={'linear(to-r, blackAlpha.600, transparent)'}>
          <Stack 
          boxShadow="dark-lg" 
          rounded="lg" 
          px={8} 
          py={8} 
          maxW={'2xl'} 
          align={'flex-start'} 
          spacing={6}
          bgColor="rgba(20, 201, 200, 0.1);"
          >
            <Text
              color={'whitesmoke'}
              fontWeight={900}
              lineHeight={1.2}
              fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}>
                Pick a Client To Get Started
            </Text>
            <Stack direction={'row'}>
                <CompanySelect />
            </Stack>
          </Stack>
        </VStack>
      </Flex>
    );
  }
  