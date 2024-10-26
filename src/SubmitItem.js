import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export default function SubmitItem({ open, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [imageLink, setImageLink] = useState('');

  const selectedTeam = localStorage.getItem('selectedTeam');

  const handleSubmit = () => {
    onSubmit({ name, imageLink });
    setName('');
    setImageLink('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: '#494034',
          border: '10px solid ' + (selectedTeam === 'Lucky Charms' ? 'purple' : 'orange'),
          borderRadius: '10px',
          width: '400px',
        },
      }}
    >
      <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>Item Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Item Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiInputLabel-root': { 
              color: 'white',
              '&.Mui-focused': { color: 'white' }
            },
            '& .MuiOutlinedInput-root': { 
              '& fieldset': { borderColor: selectedTeam === 'Lucky Charms' ? 'purple' : 'orange' },
              '&:hover fieldset': { borderColor: selectedTeam === 'Lucky Charms' ? 'purple' : 'orange' },
              '&.Mui-focused fieldset': { borderColor: selectedTeam === 'Lucky Charms' ? 'purple' : 'orange' },
            }
          }}
        />
        <TextField
          margin="dense"
          label="Image Link"
          type="text"
          fullWidth
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
          sx={{ 
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiInputLabel-root': { 
              color: 'white',
              '&.Mui-focused': { color: 'white' }
            },
            '& .MuiOutlinedInput-root': { 
              '& fieldset': { borderColor: selectedTeam === 'Lucky Charms' ? 'purple' : 'orange' },
              '&:hover fieldset': { borderColor: selectedTeam === 'Lucky Charms' ? 'purple' : 'orange' },
              '&.Mui-focused fieldset': { borderColor: selectedTeam === 'Lucky Charms' ? 'purple' : 'orange' },
            }
          }}
        />
      </DialogContent>

      {/* TODO: Make submit button conditional between Submit and Delete button depending on if state is empty or not */}
      {/* OPTIONAL: Add name to TeamSelect localStorage so that I can track changes to an item, in case of people deleting others items */}
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: selectedTeam === 'Lucky Charms' ? 'purple' : 'orange',
            color: selectedTeam === 'Lucky Charms' ? 'white' : 'black',
            '&:hover': {
              backgroundColor: selectedTeam === 'Lucky Charms' ? '#6a1b9a' : 'darkorange',
            },
            width: '120px',
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
