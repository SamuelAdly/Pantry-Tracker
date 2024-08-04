'use client'
import * as React from 'react';
import {useState, useEffect} from 'react'
import {firestore} from '@/firebase'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {Box, Typography, Stack, Button, Modal, TextField, Grid} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import {collection, query, getDocs, doc, setDoc, deleteDoc, getDoc} from 'firebase/firestore'

export default function Home() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    borderRadius: 2,
  }

  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      }) 
  })
  setInventory(inventoryList)
}

const addItem = async (item, quantity) => {
  const docRef = doc(collection(firestore, 'pantry'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
   const {quantity: existingQuantity} = docSnap.data()
    await setDoc(docRef, {quantity: parseInt(existingQuantity) + 1})
  } else {
    await setDoc(docRef, {quantity: quantity})
  }
  await updateInventory()
 }

const removeItem = async (item) => {
 const docRef = doc(collection(firestore, 'pantry'), item)
 const docSnap = await getDoc(docRef)
 if (docSnap.exists()) {
  const {quantity} = docSnap.data()
  if (quantity === 1) {
    await deleteDoc(docRef)
  } else {
    await setDoc(docRef, {quantity: quantity - 1})
  }
 }

 await updateInventory()
}

const removeFullItem = async (item) => {
  const docRef = doc(collection(firestore, 'pantry'), item)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
   await deleteDoc(docRef)
  }
  await updateInventory()
 }

const handleUpdateItem = async (oldName, newName, newQuantity) => {
  const oldDocRef = doc(collection(firestore, 'pantry'), oldName)
  const newDocRef = doc(collection(firestore, 'pantry'), newName)
  const oldDocSnap = await getDoc(oldDocRef)
  
  if (oldDocSnap.exists()) {
    const {quantity} = oldDocSnap.data()
    await deleteDoc(oldDocRef)
    await setDoc(newDocRef, {quantity: newQuantity})
  }

  await updateInventory()
}

useEffect(() => {
  updateInventory()
}, [])

const handleSearch = (e) => {
  setSearchQuery(e.target.value);
};

const filteredInventory = inventory.filter((item) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
);

const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)
const handleUpdateOpen = (item) => {
  setCurrentItem(item)
  setItemName(item.name)
  setItemQuantity(item.quantity)
  setUpdateOpen(true)
}
const handleUpdateClose = () => setUpdateOpen(false)

  return (
    <>
    <Fab 
    style = {{
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    }}
      color="primary" 
      aria-label="add"
      onClick={() => {
        handleOpen()}}>
      <AddIcon />
    </Fab>
    
    <Box 
    bgcolor={'#4f5b66'}
    width="100vw"
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
    >
      <Typography variant="h3" component="h2">Pantry Inventory</Typography>
      <TextField
          label="Search Items"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: '20px', width: '80%' }}
        />
      <Modal 
        open={open} 
        onClose={handleClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Count"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              type="number"
              InputProps={{
                inputProps: { min: 1 }
              }}
              
            />
            <Button
              variant="contained"
              onClick={() => {
                  addItem(itemName, itemQuantity);
                  setItemName('');
                  setItemQuantity(1);
                  handleClose();
              }}
            >
              ADD
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal 
        open={updateOpen} 
        onClose={handleUpdateClose} 
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Count"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              type="number"
              InputProps={{
                inputProps: { min: 1 }
              }}
              
            />
            <Button
              variant="contained"
              onClick={() => {
                  handleUpdateItem(currentItem.name, itemName, itemQuantity);
                  setItemName('');
                  setItemQuantity(1);
                  handleUpdateClose();
              }}
            >
              UPDATE
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box 
      borderRadius={2}
      border={'1px solid #333'}
      width="90%"
      maxWidth="800px"
      >
        <Box
        borderRadius={2}
        width="100%"
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        paddingX={5}
        paddingY={2}
        >
          <Typography variant={'h6'} color={'#333'} width="30%">Name</Typography>
          <Typography variant={'h6'} color={'#333'} width="20%">Quantity</Typography>
          <Typography variant={'h6'} color={'#333'} width="50%">Operations</Typography>
        </Box>
        <Stack width="100%" spacing={2} overflow={'auto'} padding={2}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                borderRadius={2}
                key={name}
                width="100%"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={5}
                paddingY={2}
              >
              <Typography variant={'h6'} color={'#333'} width="30%">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h6'} color={'#333'} width="20%" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2} width="50%">
              <Button
              variant="contained" 
              onClick={() => {
                addItem(name)
              }}
              >
                <AddCircleRoundedIcon/>
              </Button>
              <Button
                variant="contained" 
                onClick={() => {
                removeItem(name)
              }}
              >
                <RemoveCircleIcon/>
              </Button>
              <Button
                startIcon={<EditIcon />}
                variant="contained"
                onClick={() => handleUpdateOpen({name, quantity})}
                ></Button>
              <Button
                startIcon={<DeleteIcon />}
                variant="contained" 
                onClick={() => {
                removeFullItem(name)
              }}
              >
              </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
    </>
  )
}
