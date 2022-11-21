import React, { useState } from 'react'
import { initFirebase } from '@/firebase/initFirebase';
import Table from '@/components/TablePage'
import { doc, getDoc, getDocs, limit, setDoc, onSnapshot, collection, orderBy, query } from "firebase/firestore"
import { db } from '@/firebase/initFirebase'
import Swal from 'sweetalert2'
import FadeInWhenVisible from '../MicroInteractions/FadeInWhenVisible';
import {
    FormControl,
    FormLabel,
    Flex,
    Input,
    Box,
    Form,
    Tooltip,
    Select,
    Text,
    MenuButton,
    Menu,
    MenuList,
    Heading,
    useDisclosure,
    VisuallyHidden,
    VisuallyHiddenInput,
    Center,
    IconButton,
    Button,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'

initFirebase()


const AddAccountForm = () => {
    const [clientName, setClientName] = useState()
    const [clientSubscripton, setClientSubscription] = useState()
    const [sharePoint, setSharePoint] = useState()


    const sendData = async () => {
        try {
          const accountDoc = doc(db, "accountDetails", clientName)
          await setDoc(accountDoc, {
            subscription: clientSubscripton,
            client: clientName,
            sharepoint: sharePoint
          }, { merge: true })
          Swal.fire({
            title: 'Success',
            text: `${clientName} added!`,
            icon: 'success'
          })
          setClientName('')
          setClientSubscription('')
          setSharePoint('')
        } catch (error) {
          console.log(error)
        }
      }

      const handleSubmit = (event) => {
        event.preventDefault()
        sendData()

      }

    const handleClientNameChange = (event) => {
        console.log(event.target.value)
        setClientName(event.target.value)
      }

      const handleClientSubscriptionChange = (event) => {
        console.log(event.target.value)
        setClientSubscription(event.target.value)
      }
      const handleSharePointChange = (event) => {
        console.log(event.target.value)
        setSharePoint(event.target.value)
      }

    return (
  
   <Box 
   boxShadow="dark-lg" 
   rounded="lg" 
   py={8} 
   bg="gray.700" 
   mx="auto" 
   width="50%">
        <form onSubmit={handleSubmit}>
               <Box 
               gap={8} 
               px={4} 
               display="flex" 
               flexDirection="column">
            <FormLabel mx="auto">
              <Heading color="whitesmoke">Client Details</Heading>
              </FormLabel>
            <Input color="whitesmoke" onChange={handleClientNameChange} value={clientName} mx="auto" type="text" width='100%' placeholder='Client Name' />
              <Input color="whitesmoke" onChange={handleClientSubscriptionChange} value={clientSubscripton} mx="auto" type="text" width='100%' placeholder='Azure Subscription' />
              <Input color="whitesmoke" onChange={handleSharePointChange} value={sharePoint} mx="auto" type="text" width='100%' placeholder='SharePoint URL e.g. https://bsgtech.sharepoint.com' />
              <Button mx="auto" width="40%" type="submit">Add Client</Button>
              </Box>
        </form>
        </Box>
     
    )
}

export default AddAccountForm