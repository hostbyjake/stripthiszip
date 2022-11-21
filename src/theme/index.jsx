import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: {
    "html, body": {
      fontSize: "18px",
    },
  },
};

const textVariants = {
  emphasis: (props) => ({
      color: mode('blue.500', 'blue.200')(props),
  }),
  description: (props) => ({
      color: mode('gray.800', 'gray.400')(props),
  }),
  accent: (props) => ({
      color: mode('gray.800', 'blue.200')(props),
  }),
  accentAlternative: (props) => ({
      color: mode('#595959', '#A6A6A6')(props),
  }),
  label: (props) => ({
      color: mode('#d1dcf0', 'blue.700')(props),
  }),
};

const fonts = {
  heading: "Playfair Display",
  body: "Poppins, -apple-system",
};

const theme = extendTheme({
  styles,
  fonts,
  Text: {
    variants: textVariants,
},
Heading: {
    variants: textVariants,
},
});

export default theme;
