import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FAQS, MENTORS } from '../data/academyDefaults';

interface MentorsAndFaqSectionProps {
  onOpenConsultation: () => void;
}

export const MentorsAndFaqSection: React.FC<MentorsAndFaqSectionProps> = ({
  onOpenConsultation,
}) => {
  return (
    <Box
      id="mentors"
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: '#FFFFFF',
        borderTop: '1px solid #E7E2DA',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 620, mb: 5 }}>
          <Typography variant="body2" sx={{ color: '#7A283B', fontWeight: 600, mb: 1 }}>
            Lead Faculty
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.65rem' },
              color: '#1C1917',
              textWrap: 'balance',
            }}
          >
            Learn directly from working bridal directors
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 9 }}>
          {MENTORS.map((mentor) => (
            <Grid key={mentor.name} size={{ xs: 12, md: 4 }}>
              <Paper
                variant="outlined"
                sx={{ p: 3.5, height: '100%', borderRadius: 2.5, bgcolor: '#FAF8F5' }}
              >
                <Typography variant="caption" sx={{ color: '#7A283B', fontWeight: 600 }}>
                  {mentor.role}
                </Typography>
                <Typography variant="h4" sx={{ fontSize: '1.55rem', mt: 0.75, mb: 0.5 }}>
                  {mentor.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#78716C', display: 'block', mb: 2 }}>
                  {mentor.experience}
                </Typography>
                <Divider sx={{ my: 1.75 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1C1917', mb: 1 }}>
                  {mentor.specialty}
                </Typography>
                <Typography variant="body2" sx={{ color: '#57534E', lineHeight: 1.6 }}>
                  {mentor.outcome}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Admissions FAQ + Consultation Callout */}
        <Grid container spacing={5} sx={{ alignItems: 'flex-start' }}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Typography variant="body2" sx={{ color: '#7A283B', fontWeight: 600, mb: 1 }}>
              Admissions &amp; Studio Visit
            </Typography>
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: '1.85rem', md: '2.25rem' }, mb: 2, textWrap: 'balance' }}
            >
              Questions before choosing your batch?
            </Typography>
            <Typography variant="body2" sx={{ color: '#57534E', lineHeight: 1.65, mb: 3 }}>
              Book a free 30-minute studio walkthrough and kit preview with our admissions head in
              Chennai or Bengaluru, or message us directly via your student portal.
            </Typography>
            <Button variant="contained" color="primary" onClick={onOpenConsultation}>
              Book Free Studio Consultation
            </Button>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {FAQS.map((faq) => (
                <Accordion
                  key={faq.question}
                  disableGutters
                  elevation={0}
                  sx={{
                    border: '1px solid #E7E2DA',
                    borderRadius: '10px !important',
                    bgcolor: '#FAF8F5',
                    '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#7A283B' }} />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1C1917' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                    <Typography variant="body2" sx={{ color: '#57534E', lineHeight: 1.65 }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
