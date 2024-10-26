import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

export default function TeamSelect({ open, onSelectTeam }) {
  return (
    <Dialog 
      open={open} 
      onClose={() => {}}
      PaperProps={{
        style: {
          backgroundColor: '#494034',
          border: '10px solid gold',
          borderRadius: '10px',
          width: '500px',
          height: '175px',
        },
      }}
    >
      {/* Add name to TeamSelect localStorage so that I can track changes to an item, in case of people deleting others items */}
      <DialogTitle sx={{ color: 'white', textAlign: 'center' }}>Select Your Team</DialogTitle>
      <DialogActions sx={{ justifyContent: 'space-evenly', mt: 2 }}>
        <Button 
          onClick={() => onSelectTeam('Cinnamon Toast Crunch')}
          variant="contained"
          sx={{
            backgroundColor: 'orange',
            color: 'black',
            '&:hover': {
              backgroundColor: 'darkorange',
            },
            width: '200px',
          }}
        >
          Cinnamon Toast Crunch
        </Button>
        <Button 
          onClick={() => onSelectTeam('Lucky Charms')}
          variant="contained"
          sx={{
            backgroundColor: 'purple',
            color: 'black',
            '&:hover': {
              backgroundColor: '#6a1b9a',
            },
            width: '200px',
          }}
        >
          Lucky Charms
        </Button>
      </DialogActions>
    </Dialog>
  );
}