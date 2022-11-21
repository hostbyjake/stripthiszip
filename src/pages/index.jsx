import {
  Box,
  Button,
  Heading,
  MenuButton,
  Link,
  Menu,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ChevronDownIcon
} from "@chakra-ui/icons";
import React, { useState } from "react";
import { NextSeo } from "next-seo";
import NextImage from "next/image";
import MakeTable from '@/components/table'
import { seo, data } from "config";
import Title from '@/components/header/title'
import SpeechBubbles from "@/components/SpeechBubbles";
import Hero from "@/components/Hero";
import CompanySelect from "@/components/CompanySelect"
import FadeInWhenVisible from "@/components/MicroInteractions/FadeInWhenVisible";
const Home = () => {
  const color = useColorModeValue("telegram.500", "telegram.400");


  const title = "Home";
  const description = seo.description;

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={seo.canonical}
        openGraph={{
          title,
          description,
          images: [
            {
              url: `${seo.canonical}bighead.svg`,
              width: "350px",
              height: "350px",
              alt: "avatar bigheads",
            },
          ],
        }}
      />

      <Box
        as="section"
        d="flex"
        alignItems="center"
        flexDir="column"
        textAlign="center"
        py="4"
      >
               <FadeInWhenVisible>
        <Hero />
        </FadeInWhenVisible>
        <Title title='StripThisZip' />
 
    
        <Box my={8}>
          
          <FadeInWhenVisible>
<SpeechBubbles />
</FadeInWhenVisible>
        </Box>
      </Box>

    </>
  );
};

export default Home;
