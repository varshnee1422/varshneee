import React, { useState } from 'react';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { HERO_ATELIER_IMAGE } from '../data/academyDefaults';
import { AcademyPage } from '../types/academy';

interface HeroSectionProps {
  onOpenEnrollment: () => void;
  onNavigate: (page: AcademyPage) => void;
  courseCount: number;
  comboCount: number;
}

const STUDIO_METRICS = [
  { value: '420+', label: 'Certified Alumni Artists' },
  { value: '1 : 6', label: 'Mentor-to-Vanity Ratio' },
  { value: '₹45,000', label: 'Pro Vanity Kit Value' },
  { value: '0% EMI', label: 'Up to 6 Monthly Plans' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenEnrollment,
  onNavigate,
  courseCount,
  comboCount,
}) => {
  const [imgError, setImgError] = useState(false);

  const directoryPages: {
    index: string;
    page: AcademyPage;
    title: string;
    subtitle: string;
    cta: string;
  }[] = [
    {
      index: '01.',
      page: 'features',
      title: 'Studio Features & Mentors',
      subtitle:
        'Explore our 1:6 vanity stations, live model practicals, faculty directors, and admissions FAQs.',
      cta: 'Open Features Page',
    },
    {
      index: '02.',
      page: 'courses',
      title: `Specialized Courses (${courseCount})`,
      subtitle:
        'Browse HD & Airbrush Makeup, Floral Bridal Hair, Couture Saree Draping, and Nail Art syllabi.',
      cta: 'Open Courses Page',
    },
    {
      index: '03.',
      page: 'combos',
      title: `Career Combo Packages (${comboCount})`,
      subtitle:
        'Compare multi-discipline bridal diploma tracks with up to ₹44,000 savings and real wedding shadowing.',
      cta: 'Open Combos Page',
    },
    {
      index: '04.',
      page: 'fees',
      title: 'Fees & EMI Estimator',
      subtitle:
        'Calculate your exact deposit, 5% full-pay merit waiver, or 3-to-6 month zero-interest EMI plan.',
      cta: 'Open Fees Page',
    },
  ];

  return (
    <Box id="top" component="section" sx={{ position: 'relative', bgcolor: '#FAF8F5' }}>
      {/* Full-Bleed Bridal Atelier Background Image with Measured Contrast Scrim */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 520, md: 600 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          bgcolor: '#1C1917',
        }}
      >
        {!imgError ? (
          <Box
            component="img"
            src={HERO_ATELIER_IMAGE}
            alt="Sunlit travertine bridal makeup studio atelier with illuminated mirrors and brass brush sets"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #2D1A1F 0%, #1C1917 60%, #3B2B23 100%)',
            }}
          />
        )}

        {/* Measured Gradient Scrim ensuring >= 4.5:1 text contrast */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(95deg, rgba(22, 17, 16, 0.90) 0%, rgba(22, 17, 16, 0.72) 52%, rgba(22, 17, 16, 0.36) 100%)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 8, md: 11 } }}>
          <Box sx={{ maxWidth: 640 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#E7D5BA',
                fontWeight: 500,
                letterSpacing: '0.04em',
                mb: 2,
              }}
            >
              Chennai &amp; Bengaluru Studio Cohorts · Admissions Open Dec 2026
            </Typography>

            <Typography
              variant="h1"
              sx={{
                color: '#FAF8F5',
                fontSize: 'clamp(2.35rem, 4.4vw, 3.85rem)',
                textWrap: 'balance',
                mb: 2.5,
              }}
            >
              Master Pro Bridal Makeup, Sculpted Hair &amp; Couture Draping
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(250, 248, 245, 0.88)',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.65,
                maxWidth: 560,
                mb: 4,
              }}
            >
              Intensive hands-on certification with live bridal models, international airbrush kits,
              transparent fee combos, and real wedding shadowing.
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.5 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => onNavigate('courses')}
                sx={{ px: 3.5, py: 1.5, fontSize: '0.95rem' }}
              >
                Explore Courses
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={onOpenEnrollment}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: '0.95rem',
                  color: '#FAF8F5',
                  borderColor: 'rgba(250, 248, 245, 0.45)',
                  '&:hover': {
                    borderColor: '#FAF8F5',
                    bgcolor: 'rgba(250, 248, 245, 0.08)',
                  },
                }}
              >
                Reserve Batch Seat
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Full-Width 4-Column Proof Strip */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          borderTop: '1px solid #E7E2DA',
          borderBottom: '1px solid #E7E2DA',
        }}
      >
        <Container maxWidth="lg">
          <Grid container>
            {STUDIO_METRICS.map((item, idx) => (
              <Grid
                key={item.label}
                size={{ xs: 6, md: 3 }}
                sx={{
                  py: 3,
                  px: { xs: 2, md: 3 },
                  borderRight: {
                    xs: idx % 2 === 0 ? '1px solid #E7E2DA' : 'none',
                    md: idx < 3 ? '1px solid #E7E2DA' : 'none',
                  },
                  borderBottom: {
                    xs: idx < 2 ? '1px solid #E7E2DA' : 'none',
                    md: 'none',
                  },
                }}
              >
                <Typography
                  className="tabular-nums"
                  sx={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: { xs: '1.65rem', md: '2rem' },
                    fontWeight: 700,
                    color: '#1C1917',
                    lineHeight: 1.1,
                    mb: 0.5,
                  }}
                >
                  {item.value}
                </Typography>
                <Typography variant="body2" sx={{ color: '#57534E', fontSize: '0.84rem' }}>
                  {item.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Explore Academy Pages Directory */}
      <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: '#FAF8F5' }}>
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 600, mb: 4.5 }}>
            <Typography variant="body2" sx={{ color: '#7A283B', fontWeight: 600, mb: 1 }}>
              Academy Guide
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.9rem', md: '2.5rem' },
                color: '#1C1917',
                textWrap: 'balance',
              }}
            >
              Navigate every program, combo, and fee plan
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            {directoryPages.map((item) => (
              <Grid key={item.page} size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 2.5,
                    transition: 'border-color 180ms ease',
                    '&:hover': {
                      borderColor: '#7A283B',
                    },
                  }}
                >
                  <Box>
                    <Typography
                      className="tabular-nums"
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.8rem',
                        color: '#7A283B',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {item.index}
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: '1.6rem', mb: 1, color: '#1C1917' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#57534E', lineHeight: 1.65 }}>
                      {item.subtitle}
                    </Typography>
                  </Box>

                  <Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => onNavigate(item.page)}
                    >
                      {item.cta}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
