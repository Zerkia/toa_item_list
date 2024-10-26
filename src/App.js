import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import images from './imageImports';
import './App.css';
import './fonts.css';

function App() {
  const [collectedItems, setCollectedItems] = useState({});

  const toggleCollected = (id) => {
    setCollectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        sx={{
          height: '15vh',
          width: '100%',
          borderLeft: '15px solid gold',
          borderRight: '15px solid gold',
          borderTop: '15px solid gold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          color="gold"
          sx={{
            textDecoration: 'underline',
            textUnderlineOffset: '0.1em',
            textDecorationThickness: '0.15em',
          }}
        >
          ToA Collection Log
        </Typography>
      </Box>
      <Box
        sx={{
          height: '85vh',
          width: '100%',
          border: '15px solid gold',
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <Grid container spacing={4}>
          {images.map((image) => (
            <Grid xs={2} key={image.id} sx={{ maxWidth: '15%', maxHeight: '160px', mt: 0.5, px: 5 }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'linear-gradient(to right, rgba(128,0,128,0.75) 50%, rgba(255,165,0,0.75) 50%)',
                  overflow: 'hidden',
                }}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    objectFit: 'contain',
                    opacity: collectedItems[image.id] ? 1 : 0.4,
                    transition: 'opacity 0.3s ease-in-out',
                    cursor: 'pointer',
                    userSelect: 'none',
                    WebkitUserDrag: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = collectedItems[image.id] ? '1' : '0.4'}
                  loading="lazy"
                  onClick={() => toggleCollected(image.id)}
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
