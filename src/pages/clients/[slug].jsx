import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Heading,
  Button,
  Center,
  Text,
  Link as ChakraLink,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import hydrate from "next-mdx-remote/hydrate";
import TablePage from '@/components/TablePage'
import CallTable from '@/components/Table/CallTable'
import { seo } from "config";
import MDXComponents from "@/components/MDXComponents";
import NextImage from "next/image";
import FadeInWhenVisible from "@/components/MicroInteractions/FadeInWhenVisible";
const Clients = () => {
  const router = useRouter()
  const { slug } = router.query

  const color = useColorModeValue("gray.700", "gray.400");

  const dehyphenate = (text) => {
    if(text) {
        let newText = text.replaceAll('-', ' ')
        return newText
    }
  }

  return (

        <Box
          backgroundColor="gray.300"
          rounded="lg"
          boxShadow="dark-lg"
          width='85%'
          mx="auto"
          as="section"
          my={8}
          px={{ md: "10", lg: "20", xl: "40" }}
          py="4"
          fontSize="16px"
        >    
            <Center>
                  <Heading
                  my={6}
      color="blue.700"
      fontSize={60}
      letterSpacing={1}
      textTransform='uppercase'
      pb={2}
      >{dehyphenate(slug)}</Heading>
      </Center>
        <CallTable client={dehyphenate(slug)} />
        <FadeInWhenVisible>
          <Center>
            <NextImage
    src="/sharedmailbox3.png"
    width="800"
    height="300"
    alt="avatar bigheads"
    placeholder="blur"
    blurDataURL="L5I~of#i004mgjw]-4XA00?wL#xu"
    priority
  />
  </Center>
  </FadeInWhenVisible>
        </Box>

  );
};


 export default Clients