import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { getAllImages } from './imageImports';
const TeamSelect = lazy(() => import('./TeamSelect'));
const SubmitItem = lazy(() => import('./SubmitItem'));
import './App.css';
import './fonts.css';

function App() {
  const [team, setTeam] = useState(null);
  const [images, setImages] = useState([]);
  const [collectedItems, setCollectedItems] = useState({});
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        const collectedMap = {};
        data.forEach(item => {
          collectedMap[item.id] = {
            collected_ctc: item.collected_ctc,
            collected_lc: item.collected_lc,
            ctc_name: item.ctc_name,
            ctc_link: item.ctc_link,
            lc_name: item.lc_name,
            lc_link: item.lc_link
          };
        });
        setCollectedItems(collectedMap);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
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
    setCollectedItems(prev => {
      const currentItem = prev[itemDetails.id] || {};
      return {
        ...prev,
        [itemDetails.id]: {
          ...currentItem,
          collected_ctc: team === 'Cinnamon Toast Crunch' ? true : currentItem.collected_ctc,
          collected_lc: team === 'Lucky Charms' ? true : currentItem.collected_lc,
          ctc_name: team === 'Cinnamon Toast Crunch' ? itemDetails.ctc_name : currentItem.ctc_name,
          ctc_link: team === 'Cinnamon Toast Crunch' ? itemDetails.ctc_image : currentItem.ctc_link,
          lc_name: team === 'Lucky Charms' ? itemDetails.lc_name : currentItem.lc_name,
          lc_link: team === 'Lucky Charms' ? itemDetails.lc_image : currentItem.lc_link
        }
      };
    });
  };

  const handleImageClick = (imageId) => {
    setSelectedItemId(imageId);
    setIsSubmitDialogOpen(true);
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
              overflow: 'hidden',
            }}
          >
            <Grid container spacing={3}>
              {images.map((image) => (
                <Grid xs={2} key={image.id} sx={{ maxWidth: '15%', maxHeight: '160px', mt: 0.35, px: 5,}}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      background: (() => {
                        const item = collectedItems[image.id] || {};
                        if (item.collected_ctc && item.collected_lc) {
                          return 'linear-gradient(to right, rgba(255,165,0,0.75) 50%, rgba(128,0,128,0.75) 50%)';
                        } else if (item.collected_ctc) {
                          return 'linear-gradient(to right, rgba(255,165,0,0.75) 50%, rgba(73, 64, 52, 1) 50%)';
                        } else if (item.collected_lc) {
                          return 'linear-gradient(to right, rgba(73, 64, 52, 1) 50%, rgba(128,0,128,0.75) 50%)';
                        }
                        return 'rgba(73, 64, 52, 1)';
                      })(),
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
                        opacity: (() => {
                          const item = collectedItems[image.id] || {};
                          // Check if current team has collected the item based on full team name
                          const isCollectedByCurrentTeam = team === 'Cinnamon Toast Crunch' 
                            ? item.collected_ctc 
                            : item.collected_lc;
                          return isCollectedByCurrentTeam ? 1 : 0.4;
                        })(),
                        transition: 'opacity 0.3s ease-in-out',
                        cursor: 'pointer',
                        userSelect: 'none',
                        WebkitUserDrag: 'none',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => {
                        const item = collectedItems[image.id] || {};
                        const isCollectedByCurrentTeam = team === 'Cinnamon Toast Crunch' 
                          ? item.collected_ctc 
                          : item.collected_lc;
                        e.currentTarget.style.opacity = isCollectedByCurrentTeam ? '1' : '0.4';
                      }}
                      loading="lazy"
                      onClick={() => handleImageClick(image.id)}
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
          open={isSubmitDialogOpen} 
          onClose={() => setIsSubmitDialogOpen(false)}
          onSubmit={handleItemSubmit}
          itemId={selectedItemId}
          existingData={selectedItemId ? collectedItems[selectedItemId] : null}
          team={team}
        />
      </Suspense>
    </Box>
  );
}

export default App;
