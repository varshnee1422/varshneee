import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { AcademyPage } from '../types/academy';

interface NavbarProps {
  currentPage: AcademyPage;
  onNavigate: (page: AcademyPage) => void;
  onOpenEnrollment: () => void;
  onOpenPortal: () => void;
  enrollmentCount: number;
}

const NAV_LINKS: { label: string; page: AcademyPage }[] = [
  { label: 'Features', page: 'features' },
  { label: 'Courses', page: 'courses' },
  { label: 'Combos', page: 'combos' },
  { label: 'Fees', page: 'fees' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenEnrollment,
  onOpenPortal,
  enrollmentCount,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(250, 248, 245, 0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #E7E2DA',
          color: '#1C1917',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 60, md: 68 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: 2, md: 4 },
            }}
          >
            {/* Zone 1: Single-line Brand Wordmark */}
            <Box
              component="button"
              type="button"
              onClick={() => onNavigate('home')}
              sx={{
                background: 'none',
                border: 'none',
                p: 0,
                cursor: 'pointer',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: '1.35rem', md: '1.55rem' },
                letterSpacing: '-0.015em',
                color: '#1C1917',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Aurelia Bridal Academy
            </Box>

            {/* Zone 2: 5 Single-Line Navigation Links */}
            <Box
              component="nav"
              aria-label="Primary navigation"
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 4,
              }}
            >
              {NAV_LINKS.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <Box
                    key={item.page}
                    component="button"
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => onNavigate(item.page)}
                    sx={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      p: 0,
                      py: 0.5,
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#7A283B' : '#44403C',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      borderBottom: isActive ? '2px solid #7A283B' : '2px solid transparent',
                      transition: 'color 150ms ease, border-color 150ms ease',
                      '&:hover': {
                        color: '#7A283B',
                        borderBottomColor: '#7A283B',
                      },
                    }}
                  >
                    {item.label}
                  </Box>
                );
              })}
              <Box
                component="button"
                type="button"
                onClick={onOpenPortal}
                sx={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  p: 0,
                  py: 0.5,
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#44403C',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  borderBottom: '2px solid transparent',
                  transition: 'color 150ms ease, border-color 150ms ease',
                  '&:hover': {
                    color: '#7A283B',
                    borderBottomColor: '#7A283B',
                  },
                }}
              >
                {enrollmentCount > 0 ? `Portal (${enrollmentCount})` : 'Portal'}
              </Box>
            </Box>

            {/* Zone 3: 1 Primary Action + Mobile Drawer Toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={onOpenEnrollment}
                sx={{
                  px: 2.5,
                  py: 1,
                  fontSize: '0.85rem',
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              >
                Enroll Now
              </Button>
              <IconButton
                aria-label="Open navigation menu"
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#1C1917' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{ paper: { sx: { width: 280, bgcolor: '#FAF8F5', p: 2 } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            Menu
          </Typography>
          <IconButton aria-label="Close navigation menu" onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItemButton
            selected={currentPage === 'home'}
            onClick={() => {
              setMobileOpen(false);
              onNavigate('home');
            }}
          >
            <ListItemText primary="Home" />
          </ListItemButton>
          {NAV_LINKS.map((item) => (
            <ListItemButton
              key={item.page}
              selected={currentPage === item.page}
              onClick={() => {
                setMobileOpen(false);
                onNavigate(item.page);
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
          <ListItemButton
            onClick={() => {
              setMobileOpen(false);
              onOpenPortal();
            }}
          >
            <ListItemText
              primary={enrollmentCount > 0 ? `Student Portal (${enrollmentCount})` : 'Student Portal'}
            />
          </ListItemButton>
        </List>
        <Box sx={{ mt: 2, px: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              setMobileOpen(false);
              onOpenEnrollment();
            }}
          >
            Enroll Now
          </Button>
        </Box>
      </Drawer>
    </>
  );
};
