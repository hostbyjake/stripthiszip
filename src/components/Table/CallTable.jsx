import React, { useState, useEffect } from 'react'
import {
  Flex,
  Box,
  useDisclosure,
  MenuItem,
  Menu,
  Input,
  MenuButton,
  MenuList,
  FormControl,
  FormLabel,
  Select,
  Center,
  Button,
} from '@chakra-ui/react'
import { initFirebase } from '@/firebase/initFirebase';
import FadeInWhenVisible from '../MicroInteractions/FadeInWhenVisible';
import Table from '@/components/TablePage'
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from '@/firebase/initFirebase'
import { CheckCircleIcon, CloseIcon, AddIcon, WarningIcon, ChevronDownIcon } from '@chakra-ui/icons'
import Swal from 'sweetalert2'

initFirebase()



const CallTable = ({ client }) => {
  const [currentClient, setCurrentClient] = useState()
  const [entries, setEntries] = useState()
  const [subscriptions, setSubscrptions] = useState()
  const [sharedMailboxes, setSharedMailboxes] = useState()
  const [sharedMailbox, setSharedMailbox] = useState()
  const [mailboxToAdd, setMailboxToAdd] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const getMailboxes = async () => {
    try {
      const accountDoc = doc(db, "clients", client)
      await getDoc(accountDoc).then((doc) => {
        if (doc.exists()) {
          setSharedMailboxes(Object.keys(doc.data()))
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  const getSubscriptions = async () => {
    try {
      const accountDoc = doc(db, "accountDetails", client)
      await getDoc(accountDoc).then((doc) => {
        if (doc.exists()) {
          console.log(doc.data())
          setSubscrptions(doc.data().subscription)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDropDownClick = () => {
    if (!sharedMailboxes) {
      getMailboxes()
    }
    else {
      console.log('already present')
    }
  }
  useEffect(() => {
    getMailboxes()
    getSubscriptions()
  }, [])

  const handleMailboxChange = (event) => {
    console.log(event.target.value)
    setSharedMailbox(event.target.value)
  }

  const consoleLog = () => {
    console.log('console called')
    console.log(sharedMailboxes)
    addNewSharedMailbox('makeme2@test.com')
  }
  const addNewSharedMailbox = async (sharedMailboxToAdd) => {
    if(sharedMailboxes) {
      sharedMailboxes.push(sharedMailboxToAdd)
    }
    else {
      console.log('no shared mailboxes')
    }
    let newEntry = {
      FROM: 'test@removeme.com',
      FOLDER: 'testFolder'
    }
    const appendMe = (obj) => {
      let myData = []
      myData.push(obj)

      return myData
    }
    try {
      const userDoc = doc(db, "clients", client)
      await setDoc(userDoc, {
        [sharedMailboxToAdd]: appendMe(newEntry)
      }, { merge: true })
      Swal.fire({
        title: 'Success',
        text: `${sharedMailboxToAdd} has been successfully added to ${client}!`,
        icon: 'success'
      })
      setMailboxToAdd('')
      onClose()

    } catch (error) {
      console.log(error)
      Swal.fire({
        title: 'error',
        text: `${error}`,
        icon: 'error'
      })
    
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addNewSharedMailbox(mailboxToAdd)
   
  }
  const readData = async () => {
    try {
      const clientDoc = doc(db, "clients", client);
      await getDoc(clientDoc).then((doc) => {
        if (doc.exists() && !entries) {
          console.log(doc.data());
          setCurrentClient(client)
          setEntries(doc.data())
        }
      });

    } catch (error) {
      console.log(error);
    }
  };
  if (entries && sharedMailbox) {
    return (
      <>
        <Table mailboxes={sharedMailboxes} subscriptions={subscriptions} mailbox={sharedMailbox} client={client} clientEntries={entries} />
      </>
    )
  }
  else {
    return (
      <>
      <FadeInWhenVisible>
        <Flex flexDirection="column"
        >
          <Center>
            <Select
              onClick={handleDropDownClick}
              onChange={handleMailboxChange}
              width='80%'
              mb={4}
              placeholder='Shared Mailbox'>
              {sharedMailboxes &&
                sharedMailboxes.map(mailbox => (
                  <option
                    onChange={handleMailboxChange}
                    key={mailbox}
                    value={mailbox}>
                    {mailbox}</option>
                ))}
            </Select>

            <Menu isOpen={isOpen}>
              <MenuButton
                variant="outline"
                mx={1}
                py={[1, 2, 2]}
                px={4}
                mb={4}
                width="10%"
                borderRadius={5}
                _hover={{ bg: "gray.900" }}
                aria-label="Add Shared Mailbox"
                fontWeight="normal"
                onClick={onOpen}
              >
                Add <AddIcon fontSize='xs' />
              </MenuButton>
              <MenuList onMouseEnter={onOpen} >
                <Box display="flex" justifyContent="center" minW="100%">
                  <form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                      <Input
                        onChange={event => setMailboxToAdd(event.target.value)}
                        value={mailboxToAdd}
                        type="email" mx={4} width='80%' placeholder='Shared Mailbox' />
                      <CloseIcon
                        position="absolute"
                        fontSize="lg"
                        rounded="lg"
                        top={-1}
                        right={1}
                        _hover={{ color: "red.900", scale: 1.1 }}
                        onClick={onClose} />
                    </FormControl>
                  </form>

                </Box>
              </MenuList>
            </Menu>
          </Center>
          <Button mt={10} mx="auto" width="50%" onClick={readData}>Get Client Data</Button>
          <Box
            minH={{ base: "100%", md: "100%", lg: "100%" }}
            w={{ md: "calc(100vw - 150px)" }}
            borderRadius={{ md: "15px" }}
            mb={8}
            left='0'
            bgPosition="center"
            backgroundRepeat="no-repeat"
            right='0'
            bgRepeat='no-repeat'
            overflow='hidden'
            zIndex='-1'
            top='10'
            bgSize='contain'
            mx={{ md: "auto" }}
            mt={{ md: "14px" }}>
          </Box>
        </Flex>
        </FadeInWhenVisible>
      </>
    )
  }
}


export default CallTable


