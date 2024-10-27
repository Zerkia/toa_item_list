import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { getAllImages } from './imageImports';
const TeamSelect = lazy(() => import('./TeamSelect'));
const SubmitItem = lazy(() => import('./SubmitItem'));
import './App.css';
import './fonts.css';

function App() {
  const [collectedItems, setCollectedItems] = useState({});
  const [team, setTeam] = useState(null);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const storedTeam = localStorage.getItem('selectedTeam');
    if (storedTeam) {
      setTeam(storedTeam);
    } else {
      setOpenTeamDialog(true);
    }
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await getAllImages();
      setImages(loadedImages);
    };
    loadImages();
  }, []);

  const handleTeamSelection = (selectedTeam) => {
    setTeam(selectedTeam);
    localStorage.setItem('selectedTeam', selectedTeam);
    setOpenTeamDialog(false);
  };

  const toggleCollected = (id) => {
    setSelectedItemId(id);
    setOpenItemDialog(true);
  };

  const handleItemSubmit = (itemDetails) => {
    console.log('Item details submitted:', itemDetails);
    // Here you would typically update your state or send data to an API
    setCollectedItems(prev => ({
      ...prev,
      [selectedItemId]: true
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Team Select Dialog */}
        <TeamSelect open={openTeamDialog} onSelectTeam={handleTeamSelection} />

        {/* Collection Log */}
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100%',
            border: '15px solid gold',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '15vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderBottom: '15px solid gold',
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
              flexGrow: 1,
              width: '100%',
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

                      // TODO: Add team-specific gradient via conditional rendering, either purple, orange or both, depending on condition
                      // background: collectedItems[image.id]
                      //   ? 'linear-gradient(to right, rgba(128,0,128,0.75) 50%, rgba(73, 64, 52, 1) 50%)'
                      //   : 'linear-gradient(to right, rgba(73, 64, 52, 1) 50%, rgba(255,165,0,0.75) 50%)',
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

        {/* Item Details Dialog */}
        <SubmitItem 
          open={openItemDialog} 
          onClose={() => setOpenItemDialog(false)}
          onSubmit={handleItemSubmit}
        />
      </Suspense>
    </Box>
  );
}

export default App;
