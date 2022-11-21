import React, { useState, useEffect, useReducer } from 'react'
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
  CloseIcon
} from '@chakra-ui/icons'
import {
  FormControl,
  FormLabel,
  Flex,
  Input,
  Box,
  Form,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Text,
  Heading,
  Center,
  IconButton,
  Button,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

import { initFirebase } from '@/firebase/initFirebase';
import ReadDataFromCloudFirestore from '@/firebase/firestore/Read'
import WriteToCloudFirestore from '@/firebase/firestore/Write'
import generateJson from '@/lib/generateJson'
import { db } from '@/firebase/initFirebase'
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useUser } from '@/firebase/useUser'

import { useList } from "react-firebase-hooks/database";

initFirebase()

const StyledTable = styled.table`
    border: 1px solid whitesmoke;
    margin-top: 10px;
    margin: auto;
`

const StyledTr = styled.tr`
    color: whitesmoke;
    margin: 0.5em;
    letter-spacing: 0.1em;
    padding: 8px;
    border: 1px solid white;

`

const StyledTh = styled.th`
    border: 1px solid white;
`

const StyledTbody = styled.tbody`
  border: 1px solid white;

`

const StyledTd = styled.td`
    border: 1px solid white;
    padding: 4px;
`


const MakeTable = () => {
  const [client, setClient] = useState()
  const [entries, setEntries] = useState()

  const clients = ['vivify', 'twin orchard', 'gam', 'bsg', 'fisher cohen']


  const readData = async (client) => {
    try {
      const clientDoc = doc(db, "clients", client);
      await getDoc(clientDoc).then((doc) => {
        if (doc.exists() && !entries) {
          console.log(doc.data());
          setClient(client)
          setEntries(doc.data())
        }
      });

    } catch (error) {
      console.log(error);
    }
  };
  if (entries) {
    return (
      <>
        <Table client={client} clientEntries={entries} />
      </>
    )
  }
  else {
    return (
      <>
        <Center>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Clients
            </MenuButton>
            <MenuList>
              {clients.map(client => (
                <MenuItem key={client}
                  textTransform='uppercase'
                  _hover={{ bg: "teal.600" }}
                  onClick={() => readData(client)}
                >
                  {client}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

        </Center>
        <Box
          minH={{ base: "50vh", md: "80vh", lg: "80vh" }}
          w={{ md: "calc(100vw - 150px)" }}
          borderRadius={{ md: "15px" }}
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
      </>
    )
  }
}


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

const Table = ({ clientEntries, client }) => {
  const [myData, setMyData] = useState(clientEntries.ENTRY)
  const [from, setFrom] = useState('')
  const [folder, setFolder] = useState('')
  const [deleteIndex, setDeleteIndex] = useState()

  console.log(myData.FROM)



  const sendData = async () => {
    let newEntry = {
      FROM: from,
      FOLDER: folder
    }
    const appendMe = (obj) => {
      setMyData(clientEntries.ENTRY)
      myData.push(obj)
      return myData
    }
    try {
      const userDoc = doc(db, "clients", client)
      await setDoc(userDoc, {
        ENTRY: appendMe(newEntry)
      })
      alert(`Entry has been successfully added to ${client} `)
    } catch (error) {
      console.log(error)
      alert(error)
    }
    window.location.reload(false);
  }

  const [data, setData] = React.useState(() => [...clientEntries.ENTRY])
  const rerender = React.useReducer(() => ({}), {})[1]

  const handleThisClick = () => {
    console.log(myData)
    console.log(deleteIndex)

  }

  const handleFromChange = (event) => {
    console.log(event.target.value)
    setFrom(event.target.value)
  }

  const handleFolderChange = (event) => {
    console.log(event.target.value)
    setFolder(event.target.value)
  }

  const handleSubmit = (event) => {
    sendData()
    event.preventDefault()
  }

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
        ENTRY: deleteThis()
      })
      window.location.reload(false);

      alert(`Entry has been successfully deleted from ${client} `)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Box mx="auto" className="p-2">
      <Text
        fontSize={40}
        letterSpacing={1}
        textTransform='uppercase'
        pb={2}
      >{client}</Text>
      <Center>
        <StyledTable>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <StyledTr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <StyledTh key={header.id}>
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
                  marginLeft={96}
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
      <Box mx="auto" width="100%" />
      <Flex textAlign="center" justify="center" flexWrap="wrap" width="100%" flexDirection="row" mt={8}>
        {/* <Form onSubmit={handleSubmit} > */}
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <Box mx="auto" width="80%">
              <FormLabel textAlign="center">Add New Entry</FormLabel>
              <Input onChange={handleFromChange} type="email" mx="4" width='40%' placeholder='From' />
              <Input onChange={handleFolderChange} type="text" width='40%' placeholder='Folder' />
              <Button type="submit" mx="4">
                <AddIcon w={5} h={6} />
              </Button>
            </Box>
          </FormControl>
        </form>
        {/* <Button onClick={handleThisClick}></Button> */}
      </Flex>
    </Box>
  )
}



export default MakeTable