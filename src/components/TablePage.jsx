import React, { useState, useEffect, useRef, useReducer } from 'react'
import styled from 'styled-components'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  AddIcon,
  ChevronDownIcon,
  DownloadIcon,
  CloseIcon,
  CopyIcon,
  CheckIcon

} from '@chakra-ui/icons'
import {
  FormControl,
  FormLabel,
  Flex,
  Input,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
import generateJson from '@/lib/generateJson'
import { initFirebase } from '@/firebase/initFirebase';
import ReadDataFromCloudFirestore from '@/firebase/firestore/Read'
import WriteToCloudFirestore from '@/firebase/firestore/Write'
import { motion } from 'framer-motion'
import FadeInWhenVisible from './MicroInteractions/FadeInWhenVisible'
import { db } from '@/firebase/initFirebase'
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useUser } from '@/firebase/useUser'
import { useList } from "react-firebase-hooks/database";
import Swal from 'sweetalert2'

initFirebase()

const MotionButton = motion(Button)

const ButtonDisappear = () => {
  return (
    <MotionButton
      initial={{ opacity: 1, scale: 1.0 }}
      whileTap={{ y: 20 }}
      animate={{
        scale: [1, .8, .8, .4, 0],
        rotate: [0, 0, 270, 270, 0],
        borderRadius: ["20%", "20%", "50%", "50%", "20%"],
      }}
      transition={{ duration: 1.5 }}
      exit={{ opacity: 0 }}
    />
  )
}


const StyledTable = styled.table`
    border: 1px solid black;
    margin-top: 10px;
    margin: auto;
`

const StyledTr = styled.tr`
    color: black;
    margin: 0.5em;
    letter-spacing: 0.1em;
    padding: 8px;
    border: 1px solid white;
`

const StyledTh = styled.th`
    border: 1px solid black;
`

const StyledTbody = styled.tbody`
  border: 1px solid black;
`

const StyledTd = styled.td`
    border: 1px solid black;
    padding: 4px;
`

const columnHelper = createColumnHelper()

const columns = [
  columnHelper.accessor('FROM', {
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.FOLDER, {
    id: 'FOLDER',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>FOLDER</span>,
    footer: info => info.column.id,
  }),

]

const Table = ({ clientEntries, client, mailbox, mailboxes, subscriptions }) => {
  const [from, setFrom] = useState('')
  const [sharedMailboxSelected, setSharedMailboxSelected] = useState(mailbox)
  const [myData, setMyData] = useState(clientEntries[`${sharedMailboxSelected}`])
  const [folder, setFolder] = useState('')
  const [fromJson, setFromJson] = useState('')
  const [folderJson, setFolderJson] = useState('')
  const [deleteIndex, setDeleteIndex] = useState()
  const [subscriptionID, setSubscriptionID] = useState('')
  const [subscriptionSelected, setSubscirptionSelected] = useState(subscriptionID[0])
  const [sharePoint, setSharePoint] = useState()
  const [interval, setInterval] = useState(10)
  const [subscriptionToAdd, setSubscriptionToAdd] = useState()
  const [buttonToShow, setButtonToShow] = useState('')
  const [displayToolTip, setDisplayToolTip] = useState(false)
  const [hasCopied, onCopy] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = React.useState(10)

  const currentDataRef = useRef()
  currentDataRef.current = myData
  const subscriptionRef = useRef()


  const generateMyVariables = () => {
    setButtonToShow('deploy')
    const getSubId = () => {
      if(subscriptionRef.current.value) {
        return subscriptionRef.current.value
      }
      else {
        return subscriptionID[0]
      }
    }
    let theData = clientEntries[`${sharedMailboxSelected}`]
    console.log(theData)
    let emails = theData.map(item => item.FROM)
    let folders = theData.map(item => item.FOLDER)
    let fromjoined = emails.join();
    let folderjoined = folders.join();
    setFromJson(fromjoined)
    setFolderJson(folderjoined)
    let jsonData = `{"FROM": "${fromjoined}","FOLDER": "${folderjoined}", "SUBSCRIPTION": "${getSubId()}", "SHAREDMAILBOX": "${sharedMailboxSelected}", "SHAREPOINT": "${sharePoint}", "INTERVAL": "${value}"}`
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    };
    fetch('http://10.50.0.127:5000/generate-variables', requestOptions)
      .then(response => response.json())
      .then(data => console.log(data));
  }

  const deployMe = () => {
    setButtonToShow('download')
    fetch('http://10.50.0.127:5000/make-json')
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  const getSubscriptions = async () => {
    try {
      const accountDoc = doc(db, "accountDetails", client)
      await getDoc(accountDoc).then((doc) => {
        if (doc.exists()) {
          console.log(doc.data())
          setSubscriptionID(doc.data().subscription)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getSharePoint = async () => {
    try {
      const accountDoc = doc(db, "accountDetails", client)
      await getDoc(accountDoc).then((doc) => {
        if (doc.exists()) {
          console.log(doc.data())
          setSharePoint(doc.data().sharepoint)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getSubscriptions()
    getSharePoint()
  }, [])

  const copyThis = () => {
    navigator.clipboard.writeText('az logic workflow create --resource-group $rsgName --location $regionName --name $nameOfApp --definition workflowSwitch.json')
    onCopy(true)
    setTimeout(() => {
      onCopy(false)
    }, 2000);

  }

  const consoleVariables = () => {
    console.log(clientEntries[`${sharedMailboxSelected}`])
    setData(clientEntries[`${sharedMailboxSelected}`])
    console.log(currentDataRef.current)
    console.log(sharedMailboxSelected)
    console.log(subscriptionID)
  }

  const addSubscription = () => {
    addSubscriptionData()
  }

  const addSubscriptionData = async () => {
    let subscriptions = subscriptionID.push(subscriptionToAdd)
    try {
      const accountDoc = doc(db, "accountDetails", client)
      await setDoc(accountDoc, {
        subscription: subscriptions
      }, { merge: true })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubscriptionSubmit = (event) => {
    event.preventDefault()
    addSubscriptionData()
  }

  const sendData = async () => {
    let newEntry = {
      FROM: from,
      FOLDER: folder
    }
    const appendMe = (obj) => {
      setMyData(clientEntries[`${mailbox}`])
      myData.push(obj)
      return myData
    }
    try {
      const userDoc = doc(db, "clients", client)
      await setDoc(userDoc, {
        [mailbox]: appendMe(newEntry)
      }, { merge: true })
      Swal.fire({
        title: 'Success',
        text: `Entry has been successfully added to ${client}!`,
        icon: 'success',
        timer: 1500
      })
      setFrom('')
      setFolder('')
    } catch (error) {
      console.log(error)
      alert(error)
    }
    // window.location.reload(false);
  }

  const [data, setData] = React.useState(() => [...clientEntries[`${sharedMailboxSelected}`]])
  const rerender = React.useReducer(() => ({}), {})[1]

  const handleClientDetailsSubmit = (event) => {
    event.preventDefault()
    setData(clientEntries[`${sharedMailboxSelected}`])
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    sendData()
    setData(currentDataRef.current)
  }

  const handleFromChange = (event) => {
    console.log(event.target.value)
    setFrom(event.target.value)
  }

  const handleMailboxChange = (event) => {
    console.log(event.target.value)
    setSharedMailboxSelected(event.target.value)
    console.log(data)
  }

  const handleFolderChange = (event) => {
    console.log(event.target.value)
    setFolder(event.target.value)
  }

   const handleIntervalChange = (value) => setValue(value)






  const deleteClick = (index) => {
    setDeleteIndex(index)
    deleteIndex ? deleteData() : console.log('null')
  }

  const deleteData = async () => {

    const deleteThis = () => {
      const item = myData[deleteIndex]
      const index = myData.indexOf(item);
      if (index !== -1) {
        myData.splice(index, 1);
        return myData
      }
    }

    try {
      const userDoc = doc(db, "clients", client)
      await setDoc(userDoc, {
        [sharedMailboxSelected]: deleteThis()
      }, { merge: true })
      Swal.fire({
        title: 'Deleted',
        text: `Entry has been successfully deleted to ${client}! To Update Table, Refresh Page.`,
        icon: 'info',
        timer: 3500
      })
      // window.location.reload(false);

    } catch (error) {
      console.log(error)
      Swal.fire({
        title: 'Error',
        text: `${error}`,
        icon: 'warning',
        timer: 1500
      })
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSubscriptionChange = (event) => {
    console.log(event.target.value)
    setSubscriptionSelected(event.target.value)
  }

  const handleSharePointChange = (event) => {
    console.log(event.target.value)
    setSharePoint(event.target.value)
  }

  const handleTemplateGeneration = () => {
    generateMyVariables()
    deployMe()
    setButtonToShow('deploy')
  }

  return (
    <Box mx="auto" className="p-2">
      <Center>
        <Text mx="auto">{sharedMailboxSelected}</Text>
      </Center>
      <FadeInWhenVisible>
      <Center>
        <StyledTable>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <StyledTr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <StyledTh bgColor="black" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </StyledTh>
                ))}
              </StyledTr>
            ))}
          </thead>
          <StyledTbody>
            {table.getRowModel().rows.map(row => (
              <>
                <IconButton
                  fontSize='10px'
                  variant="ghost"
                  mb={8}
                  position="absolute"
                  marginLeft={578}
                  aria-label="Delete Item"
                  onClick={() => deleteClick(row.id)}
                  icon={<CloseIcon />}>
                </IconButton>
                <StyledTr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <>
                      <StyledTd key={cell.id}>
                        <Box display='flex' justifyContent='center' mx={4} width='250px'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Box>
                      </StyledTd>
                    </>
                  ))}
                </StyledTr>
              </>
            ))}
          </StyledTbody>
        </StyledTable>
      </Center>
      </FadeInWhenVisible>
      <Box py={2} mx="auto" width="100%" />
      <Flex textAlign="center" justify="center" flexWrap="wrap" width="100%" flexDirection="row" mt={8}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <Box mx="auto" width="80%">
              <FormLabel textAlign="center">Add New Entry</FormLabel>
              <Input onChange={handleFromChange} value={from} color="black" bgColor="gray.200" type="email" mx="4" width='40%' placeholder='From' />
              <Input onChange={handleFolderChange} value={folder} color="black" bgColor="gray.200" type="text" width='40%' placeholder='Folder' />
              <Button type="submit" mx="4">
                <AddIcon w={5} h={6} />
              </Button>
            </Box>
          </FormControl>
        </form>
      </Flex>
      <Box bgColor="gray.200" rounded="lg" boxShadow="dark-lg" px={8} mt={8}>
      <form onSubmit={handleClientDetailsSubmit}>
        <Box 
         py={10}>
          <Heading mb={10}>Client Details</Heading>
          <FormControl isRequired>
            <FormLabel>Azure Subscription</FormLabel>
            <Select
              onChange={handleSubscriptionChange}
              width='80%' mb={4}
              placeholder={subscriptionSelected}>
              {subscriptionID &&
                  <option
                    ref={subscriptionRef}
                    onChange={handleSubscriptionChange}
                    key={subscriptionID}
                    value={subscriptionID}>
                    {subscriptionID}</option>
}
            </Select>
          </FormControl>
      
     <FormLabel>SharePoint Site</FormLabel>
     <Select
       onChange={handleSharePointChange}
       width='80%' mb={4}
       placeholder={sharePoint}>
       {sharePoint &&
           <option
             onChange={handleSharePointChange}
             key={sharePoint}
             value={sharePoint}>
             {sharePoint}</option>
}
     </Select>
          <Box mb={4}>
          <FormLabel>Interval in Minutes To Run</FormLabel>
          <NumberInput width='80%' value={value} onChange={handleIntervalChange} defaultValue={10} min={0} max={60}>
  <NumberInputField />
  <NumberInputStepper>
    <NumberIncrementStepper />
    <NumberDecrementStepper />
  </NumberInputStepper>
</NumberInput>
          </Box>
          <FormLabel>Shared Mailbox</FormLabel>
      <Select
        onChange={handleMailboxChange}
        width='80%'
        mb={4}
        placeholder={sharedMailboxSelected}>
        {mailboxes &&
          mailboxes.map(mailbox => (
            <option
              onChange={handleMailboxChange}
              key={mailbox}
              value={mailbox}>
              {mailbox}</option>
          ))}
      </Select>
          <Button bgColor="gray.400" _hover={{ bgColor: "gray.500" }} type="submit">Update Client</Button>
    </Box>
  </form>
  </Box>
      <Box mt={10} mx='auto'>
        {buttonToShow === '' ?
          <Center>
            <Button position="absolute" mx="auto" onClick={handleTemplateGeneration}>Click To Generate Template</Button>
          </Center>
          :
          <ButtonDisappear onClick={handleTemplateGeneration}>Click To Generate Template</ButtonDisappear>
        }
        {buttonToShow === 'deploy' ?
          <a target="_blank" href="http://10.50.0.127:5000/download-template" rel="nooopener noreferrer">
            <Button
              onClick={(() => setDisplayToolTip(true))}
              bgColor="#f59e42"
              color="whitesmoke"
              variant="solid"
              position="absolute"
              mx="auto"
              left="0"
              right="0">
             Click to Download Logic Template
              <IconButton
                fontSize='20px'
                variant="ghost"
                aria-label="Download Item"
                onClick={() => deleteClick(row.id)}
                icon={<DownloadIcon />}>
              </IconButton>
            </Button></a>
          :
          <ButtonDisappear><a target="_blank" href="http://10.50.0.127:5000/download-template" rel="nooopener noreferrer"></a></ButtonDisappear>
        }
        <Center>
          <Box py={8} mx="auto">
            {displayToolTip &&
              <Button onClick={() => copyThis()}>
                <Tooltip
                  label="az logic workflow create --resource-group $rsgName --location $regionName --name $nameOfApp --definition .\workflowSwitch.json"
                  aria-label='A tooltip'>
                  Command To Deploy
                </Tooltip>
                {hasCopied ? <CheckIcon color="green" mx={2} /> : <CopyIcon mx={2} />}

              </Button>
            }
          </Box>
        </Center>
      </Box>
      {/* <Button onClick={consoleVariables}>Console Log</Button> */}
      {/* <ReactJson src={workflow} /> */}

    </Box>
  )
}



export default Table
