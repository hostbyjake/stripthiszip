import CompanySelect from '@/components/CompanySelect'
import AddAccountForm from '@/components/Form/AddAccountForm'
import FadeInWhenVisible from '@/components/MicroInteractions/FadeInWhenVisible';

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
const AddClient = () => {
    return (
        <Box mx={10} 
        rounded="md" 
        boxShadow="lg" 
        my={8} 
        bgColor="blue.200" 
        height="700px" 
        display="flex" 
        justifyContent="center" 
        flexDirection="column" 
        alignContent="center">
            <FadeInWhenVisible>
        <AddAccountForm />
        </FadeInWhenVisible>
        </Box>
    )
}

export default AddClient