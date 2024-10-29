import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Box } from '@mui/material';
import { getAllImages } from './imageImports';
const TeamSelect = lazy(() => import('./components/TeamSelect'));
const SubmitItem = lazy(() => import('./components/SubmitItem'));
const CollectionLog = lazy(() => import('./components/CollectionLog'));
import './App.css';
import './fonts.css';

function App() {
  const [team, setTeam] = useState(null);
  const [images, setImages] = useState([]);
  const [collectedItems, setCollectedItems] = useState({});
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
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
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/items`);
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
          ctc_link: team === 'Cinnamon Toast Crunch' ? itemDetails.ctc_link : currentItem.ctc_link,
          lc_name: team === 'Lucky Charms' ? itemDetails.lc_name : currentItem.lc_name,
          lc_link: team === 'Lucky Charms' ? itemDetails.lc_link : currentItem.lc_link
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
        <TeamSelect 
          open={openTeamDialog} 
          onSelectTeam={handleTeamSelection} 
        />

        <CollectionLog
          images={images}
          collectedItems={collectedItems}
          team={team}
          onImageClick={handleImageClick}
        />

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
