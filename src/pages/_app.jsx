import { ChakraProvider, ScaleFade } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";
import { AnimatePresence } from 'framer-motion'

import theme from "@/theme/index";
import Layout from "@/layouts/global";
import SEO from "next-seo.config";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@/styles/index.css";
import "@fontsource/playfair-display"


const MyApp = ({ Component, pageProps }) => (
  <>
    <AnimatePresence exitBeforeEnter>

      <DefaultSeo {...SEO} />

      <ChakraProvider theme={theme}>
        <ScaleFade
          initialScale={0.9}
          in="true"
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ScaleFade>
      </ChakraProvider>
    </AnimatePresence>

  </>
);

export default MyApp;
