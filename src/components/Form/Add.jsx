// const Add = () => {

//     return (
//         <Menu isOpen={isOpen}>
//             <MenuButton
//                 variant="outline"
//                 mx={1}
//                 py={[1, 2, 2]}
//                 px={4}
//                 mb={4}
//                 width="10%"
//                 borderRadius={5}
//                 _hover={{ bg: "gray.900" }}
//                 aria-label="Add Shared Mailbox"
//                 fontWeight="normal"
//                 onClick={onOpen}
//             >
//                 Add <AddIcon fontSize='xs' />
//             </MenuButton>
//             <MenuList onMouseEnter={onOpen} >
//                 <Box display="flex" justifyContent="center" minW="100%">
//                     <form onSubmit={handleSubmit}>
//                         <FormControl isRequired>
//                             <Input
//                                 onChange={event => setMailboxToAdd(event.target.value)}
//                                 type="email" mx={4} width='80%' placeholder='Shared Mailbox' />
//                             <CloseIcon
//                                 position="absolute"
//                                 fontSize="lg"
//                                 rounded="lg"
//                                 top={-1}
//                                 right={1}
//                                 _hover={{ color: "red.900", scale: 1.1 }}
//                                 onClick={onClose} />
//                         </FormControl>
//                     </form>
//                 </Box>
//             </MenuList>
//         </Menu>
//     )
// }

// export default Add