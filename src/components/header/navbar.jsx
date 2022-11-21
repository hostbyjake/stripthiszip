import { useState } from "react";
import { Box, chakra, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons'
import CompanySelect from "@/components/CompanySelect"

import CustomLink from '@/components/Link'
import {
  Menu,
  MenuButton,
  MenuList,
  Button,
  Link,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import HamburgerMenu from "../UI/hamburgerMenu";
import ColorModeToggle from "../UI/colorModeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const clients = ['vivify', 'twin orchard', 'gam', 'bsg', 'fisher cohen']
  const bg = useColorModeValue("gray.200", "gray.300");
  const color = useColorModeValue("black", "white");


  const hyphenate = (text) => {
    const newText = text.replaceAll(' ', '-')
    return newText
  }

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <Box
      as="nav"
      display="flex"
      flexDir={{ base: "row-reverse", lg: "row" }}
      alignItems="center"
      fontWeight="500"
    >
      <HamburgerMenu toggled={isOpen} toggle={setIsOpen} />
      <chakra.ul
        bg={{ base: bg, lg: "transparent" }}
        color={{ base: "black", lg: color }}
        display={{
          base: isOpen ? "block" : "none",
          lg: "flex",
        }}
        position={{ base: "absolute", lg: "static" }}
        top="5rem"
        left="5%"
        right="5%"
        rounded={{ base: "lg", lg: "none" }}
        py={{ base: "2", lg: "0" }}
        px={{ base: "4", lg: "0" }}
        alignItems={{ lg: "center" }}
        boxShadow={{ base: "xl", lg: "none" }}
        zIndex="2"
      >

        <chakra.li
          listStyleType="none"
          px={{ lg: "8" }}
          py={{ base: "3", lg: "0" }}
        >
          <CompanySelect />
                  </chakra.li>
                  <chakra.li
      listStyleType="none"
      px={{ lg: "8" }}
      py={{ base: "3", lg: "0" }}
    >
      <NextLink href="/add-client">
        <Link onClick={closeMenu}>Add Client<AddIcon mb={1} color="blue.400" mx={1} fontSize="xs"></AddIcon> </Link>
      </NextLink>
    </chakra.li>
      </chakra.ul>

      {/* <ColorModeToggle /> */}
    </Box>
  );
};

export default Navbar;
