import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { ACADEMY_FEATURES, STUDIO_MASTERCLASS_IMAGE } from '../data/academyDefaults';

export const FeaturesSection: React.FC = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <Box id="features" component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: '#FAF8F5' }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: 'stretch' }}>
          {/* Left Column: Editorial Intro + Studio Masterclass Photography */}
          <Grid size={{ xs: 12, lg: 5 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#7A283B', fontWeight: 600, mb: 1 }}>
                Academy Architecture
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.65rem' },
                  color: '#1C1917',
                  textWrap: 'balance',
                  mb: 2,
                }}
              >
                Built like a working couture atelier, not a lecture hall
              </Typography>
              <Typography variant="body1" sx={{ color: '#57534E', lineHeight: 1.68 }}>
                Every curriculum hour balances skin chemistry, camera-lighting calibration, and timed
                bridal transformations so graduates step straight into paid wedding bookings.
              </Typography>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                position: 'relative',
                flexGrow: 1,
                minHeight: { xs: 280, lg: 360 },
                overflow: 'hidden',
                borderRadius: 2.5,
              }}
            >
              {!imgError ? (
                <Box
                  component="img"
                  src={STUDIO_MASTERCLASS_IMAGE}
                  alt="Bridal makeup academy students observing a live bridal demonstration in a sunlit marble studio"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #EAE3D8 0%, #D9CFC0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                  }}
                >
                  <Typography variant="h4" sx={{ color: '#57534E' }}>
                    Live Atelier Masterclasses
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 'auto 0 0 0',
                  p: 2.5,
                  background: 'linear-gradient(to top, rgba(22,17,16,0.86) 0%, rgba(22,17,16,0) 100%)',
                }}
              >
                <Typography variant="body2" sx={{ color: '#FAF8F5', fontWeight: 500 }}>
                  Live Friday Critique Labs · Real Couture Lehengas &amp; Kundan Styling
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Editorial Numbered 01-06 Bento Grid */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Grid container spacing={2.5} sx={{ height: '100%' }}>
              {ACADEMY_FEATURES.map((feat) => (
                <Grid key={feat.index} size={{ xs: 12, sm: 6 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      bgcolor: '#FFFFFF',
                      borderRadius: 2.5,
                      transition: 'border-color 180ms ease',
                      '&:hover': {
                        borderColor: '#9A7B4F',
                      },
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <Typography
                          className="tabular-nums"
                          sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '0.8rem',
                            color: '#7A283B',
                            fontWeight: 500,
                          }}
                        >
                          {feat.index}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="tabular-nums"
                          sx={{ color: '#78716C', fontSize: '0.78rem' }}
                        >
                          {feat.metric}
                        </Typography>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{ fontSize: '1.05rem', color: '#1C1917', mb: 1, lineHeight: 1.35 }}
                      >
                        {feat.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#57534E', lineHeight: 1.62 }}>
                        {feat.detail}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
