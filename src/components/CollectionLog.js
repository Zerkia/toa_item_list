import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';

export default function CollectionLog({ images, collectedItems, team, onImageClick }) {
  return (
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
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    {(() => {
                      const item = collectedItems[image.id] || {};
                      return (
                        <>
                          {item.collected_ctc ? (
                            <Typography sx={{ color: 'white' }}>
                              CTC: {item.ctc_name}
                            </Typography>
                          ) : 
                            <Typography sx={{ color: 'white' }}>
                              CTC: Not Collected
                            </Typography>}
                          {item.collected_lc ? (
                            <Typography sx={{ color: 'white' }}>
                              LC: {item.lc_name}
                            </Typography>
                          ) : 
                          <Typography sx={{ color: 'white' }}>
                              LC: Not Collected
                            </Typography>}
                        </>
                      );
                    })()}
                  </Box>
                }
                arrow
                placement="top"
                enterDelay={200}
                leaveDelay={0}
                PopperProps={{
                  sx: {
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: '#494034',
                      border: '2px solid gold',
                      borderRadius: '8px',
                      maxWidth: 'none',
                    },
                    '& .MuiTooltip-arrow': {
                      color: '#494034',
                      '&::before': {
                        border: '2px solid gold'
                      }
                    }
                  }
                }}
              >
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
                    onClick={() => onImageClick(image.id)}
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                  />
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
} 