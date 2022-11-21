import { Box, Button, Icon, Link as ChakraLink, Text } from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaInstagram, FaCode } from "react-icons/fa";

import { MAX_WIDTH } from "config";

// Fell free to add your social media accounts!
const socialAccounts = [
  { icon: FaGithub, path: "https://github.com/", title: "Github" },
  { icon: FaLinkedin, path: "https://www.linkedin.com/", title: "Linkedin" },
  { icon: FaInstagram, path: "https://www.instagram.com/", title: "Instagram" },
];

const Footer = () => {
  return (
    <Box bgColor="gray.100" as="footer">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
        textAlign="center"
        minH="4rem"
        px={[4, 6, 10, 14, 20]}
        maxW={MAX_WIDTH}
        mx="auto"
      >
        <Box py="2">
          <Text>
            Built By
            {" "}
            <ChakraLink
              href="https://nextjs.org/"
              fontWeight="600"
              _focus={{ outline: "none" }}
              isExternal
            >
              BSG
            </ChakraLink>
            {" "}
          </Text>
        </Box>
        <Box py="2">
          <ChakraLink
            href="https://github.com/hostbyjake/stripthiszip"
            aria-label="source code"
            isExternal
          >
            <Button aria-label="source code">
              <Icon as={FaCode} w="6" h="6" />
            </Button>
          </ChakraLink>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
