import React from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AcademyPage } from '../types/academy';

interface SubPageHeaderProps {
  pageLabel: string;
  onNavigate: (page: AcademyPage) => void;
}

export const SubPageHeader: React.FC<SubPageHeaderProps> = ({ pageLabel, onNavigate }) => {
  return (
    <Box
      sx={{
        bgcolor: '#F3EFE9',
        borderBottom: '1px solid #E7E2DA',
        py: 1.75,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Button
          size="small"
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => onNavigate('home')}
          sx={{ color: '#44403C', px: 1, minHeight: 36 }}
        >
          Back to Home
        </Button>

        <Typography
          variant="caption"
          sx={{ color: '#7A283B', fontWeight: 600, whiteSpace: 'nowrap' }}
        >
          Home / {pageLabel}
        </Typography>
      </Container>
    </Box>
  );
};

interface PageStepBarProps {
  prevPage?: { page: AcademyPage; label: string };
  nextPage?: { page: AcademyPage; label: string };
  onNavigate: (page: AcademyPage) => void;
}

export const PageStepBar: React.FC<PageStepBarProps> = ({
  prevPage,
  nextPage,
  onNavigate,
}) => {
  return (
    <Box
      sx={{
        bgcolor: '#FAF8F5',
        borderTop: '1px solid #E7E2DA',
        py: 4,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {prevPage ? (
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => onNavigate(prevPage.page)}
            sx={{
              borderColor: '#D6CFC4',
              color: '#1C1917',
              '&:hover': { borderColor: '#7A283B', bgcolor: 'rgba(122,40,59,0.04)' },
            }}
          >
            {prevPage.label}
          </Button>
        ) : (
          <Box />
        )}

        {nextPage && (
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => onNavigate(nextPage.page)}
          >
            Next: {nextPage.label}
          </Button>
        )}
      </Container>
    </Box>
  );
};

interface FooterProps {
  onNavigate: (page: AcademyPage) => void;
  onOpenPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPortal }) => {
  const footerLinks: { label: string; page: AcademyPage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Features', page: 'features' },
    { label: 'Courses', page: 'courses' },
    { label: 'Combos', page: 'combos' },
    { label: 'Fees & EMI', page: 'fees' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1C1917',
        color: '#FAF8F5',
        py: 6,
        borderTop: '1px solid #292524',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '1.5rem',
                fontWeight: 700,
                mb: 0.75,
              }}
            >
              Aurelia Bridal Academy
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(250, 248, 245, 0.7)' }}>
              Khader Nawaz Khan Road, Chennai · Indiranagar 100ft Road, Bengaluru
            </Typography>
          </Grid>

          <Grid
            size={{ xs: 12, md: 7 }}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              gap: 3,
            }}
          >
            {footerLinks.map((item) => (
              <Box
                key={item.page}
                component="button"
                type="button"
                onClick={() => onNavigate(item.page)}
                sx={{
                  background: 'none',
                  border: 'none',
                  p: 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  color: 'rgba(250,248,245,0.82)',
                  whiteSpace: 'nowrap',
                  '&:hover': { color: '#FFFFFF' },
                }}
              >
                {item.label}
              </Box>
            ))}
            <Box
              component="button"
              type="button"
              onClick={onOpenPortal}
              sx={{
                background: 'none',
                border: 'none',
                p: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                color: '#E7D5BA',
                whiteSpace: 'nowrap',
                '&:hover': { color: '#FFFFFF' },
              }}
            >
              Student &amp; Admin Portal
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
