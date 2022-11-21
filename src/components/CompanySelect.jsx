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
  import React, { useState, useEffect } from "react";
  import NextImage from "next/image";
  import { initFirebase } from '@/firebase/initFirebase';
  import Table from '@/components/TablePage'
  import { doc, getDoc, getDocs, limit, setDoc, onSnapshot, collection, orderBy, query } from "firebase/firestore"
  import { db } from '@/firebase/initFirebase'
  
  
  initFirebase()
  
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

  // const getClients = () => {
    // fetch('http://10.50.0.127:5000/get-clients')
      // .then((response) => response.json())
      // .then((data) => console.log(data));
  // }
// 
  const readData = async () => {
    try {
      const alertsDoc = db.collection('alertsEnabled')
      await alertsDoc.get().then(doc => {
        if (doc) {
          console.log(doc.data())
        }
      })
    } catch (error) {
      console.log(error)
    }
  }



  const CompanySelect = () => {
    const [client, setClients] = useState()

    const getClients = async () => {
      let clientArray = []
      const theclients = await collection(db, 'accountDetails')
      const docsSnap = await getDocs(theclients)
      docsSnap.forEach(doc => {
       clientArray.push(doc.data().client)
      })
      setClients(clientArray)
    }
  

    const hyphenate = (text) => {
      const newText = text.replaceAll(' ', '-')



      return newText
    }
    return (
      <div>
      <Menu rounded="lg" my={8}>
      <MenuButton 
           onClick={() => getClients()}
      as={Button} rightIcon={<ChevronDownIcon />}>
        Clients
      </MenuButton>
      <MenuList>
        {client && 
        client.map(client => (
          <>
          <Link href={`/clients/${hyphenate(client)}`}>
          <MenuItem 
          rounded="sm"
          key={client}
            _hover={{ bg: "blue.400" }}
            textTransform='uppercase'
          >
           {client}
          </MenuItem>
          </Link>
          </>
        ))}
      </MenuList>
    </Menu>
    </div>
    )
  }


export default CompanySelect

