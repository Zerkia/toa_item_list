import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export default function SubmitItem({ open, onClose, onSubmit, itemId, existingData, team }) {
  const [name, setName] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [errors, setErrors] = useState({ name: false, imageLink: false });
  
  const selectedTeam = localStorage.getItem('selectedTeam');

  useEffect(() => {
    if (existingData && open) {
      if (team === 'Cinnamon Toast Crunch' && existingData.collected_ctc) {
        setName(existingData.ctc_name || '');
        setImageLink(existingData.ctc_link || '');
      } else if (team === 'Lucky Charms' && existingData.collected_lc) {
        setName(existingData.lc_name || '');
        setImageLink(existingData.lc_link || '');
      } else {
        setName('');
        setImageLink('');
      }
    } else {
      setName('');
      setImageLink('');
    }
  }, [existingData, open, team]);

  const validateForm = () => {
    const newErrors = {
      name: !name.trim(),
      imageLink: !imageLink.trim()
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      if (!itemId) {
        throw new Error('No item ID provided');
      }

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: itemId,
          name,
          imageLink,
          team: selectedTeam
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Failed to submit item: ${data.error || response.statusText}`);
      }

      onSubmit(data);
      setName('');
      setImageLink('');
      setErrors({ name: false, imageLink: false });
      onClose();
    } catch (error) {
      console.log("Error submitting item");
    }
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
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>Item Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            required
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: false }));
            }}
            error={errors.name}
            helperText={errors.name ? 'Username is required' : ''}
            sx={{ 
              mb: 2,
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { 
                color: errors.name ? 'error' : 'white',
                '&.Mui-focused': { color: errors.name ? 'error' : 'white' }
              },
              '& .MuiFormHelperText-root': {
                color: 'error'
              },
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { 
                  borderColor: errors.name ? 'error' : (selectedTeam === 'Lucky Charms' ? 'purple' : 'orange')
                },
                '&:hover fieldset': { 
                  borderColor: errors.name ? 'error' : (selectedTeam === 'Lucky Charms' ? 'purple' : 'orange')
                },
                '&.Mui-focused fieldset': { 
                  borderColor: errors.name ? 'error' : (selectedTeam === 'Lucky Charms' ? 'purple' : 'orange')
                },
              }
            }}
          />
          <TextField
            margin="dense"
            label="Image Link"
            type="text"
            required
            fullWidth
            value={imageLink}
            onChange={(e) => {
              setImageLink(e.target.value);
              setErrors(prev => ({ ...prev, imageLink: false }));
            }}
            error={errors.imageLink}
            helperText={errors.imageLink ? 'Image link is required' : ''}
            sx={{ 
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { 
                color: errors.imageLink ? 'error' : 'white',
                '&.Mui-focused': { color: errors.imageLink ? 'error' : 'white' }
              },
              '& .MuiFormHelperText-root': {
                color: 'error'
              },
              '& .MuiOutlinedInput-root': { 
                '& fieldset': { 
                  borderColor: errors.imageLink ? 'error' : (selectedTeam === 'Lucky Charms' ? 'purple' : 'orange')
                },
                '&:hover fieldset': { 
                  borderColor: errors.imageLink ? 'error' : (selectedTeam === 'Lucky Charms' ? 'purple' : 'orange')
                },
                '&.Mui-focused fieldset': { 
                  borderColor: errors.imageLink ? 'error' : (selectedTeam === 'Lucky Charms' ? 'purple' : 'orange')
                },
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            type="submit"
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
      </form>
    </Dialog>
  );
}
