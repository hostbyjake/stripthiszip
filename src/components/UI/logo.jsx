import { chakra } from "@chakra-ui/react";
import NextLink from "next/link";
import NextImage from 'next/image'
const Logo = () => {
  return (
    <NextLink href="/" passHref>
      <chakra.a pt={6} fontSize="2rem" fontWeight="700">
      <NextImage
  src="/BSGLOGO2.png"
  width="200"
  height="60"
  alt="avatar bigheads"
  placeholder="blur"
  blurDataURL="L5I~of#i004mgjw]-4XA00?wL#xu"
  priority
/>
      </chakra.a>
    </NextLink>
  );
};

export default Logo;
