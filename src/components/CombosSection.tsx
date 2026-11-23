import React from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { ComboPackage } from '../types/academy';
import { formatINR } from '../data/academyDefaults';

interface CombosSectionProps {
  combos: ComboPackage[];
  onSelectCombo: (combo: ComboPackage) => void;
}

export const CombosSection: React.FC<CombosSectionProps> = ({ combos, onSelectCombo }) => {
  return (
    <Box id="combos" component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: '#FAF8F5' }}>
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 660, mb: 5 }}>
          <Typography variant="body2" sx={{ color: '#7A283B', fontWeight: 600, mb: 1 }}>
            Multi-Discipline Bundles
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.65rem' },
              color: '#1C1917',
              textWrap: 'balance',
              mb: 1.5,
            }}
          >
            Career Combo Packages &amp; Diploma Tracks
          </Typography>
          <Typography variant="body1" sx={{ color: '#57534E', lineHeight: 1.65 }}>
            Combine makeup artistry, hair architecture, and saree draping into one unified track to
            save up to ₹44,000 and unlock assisted real-wedding shadowing.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
          {combos.map((combo) => {
            const savings = Math.max(0, combo.regularFee - combo.comboFee);
            const monthlyEmi = Math.round(combo.comboFee / Math.max(1, combo.installmentMonths));
            const isHighlighted = combo.isFeatured;

            return (
              <Grid key={combo.id} size={{ xs: 12, lg: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3.5,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: 2.5,
                    bgcolor: isHighlighted ? '#1C1917' : '#FFFFFF',
                    color: isHighlighted ? '#FAF8F5' : '#1C1917',
                    borderColor: isHighlighted ? '#1C1917' : '#E7E2DA',
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      className="tabular-nums"
                      sx={{
                        display: 'block',
                        color: isHighlighted ? '#E7D5BA' : '#7A283B',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {isHighlighted ? 'Most Popular Track · ' : ''}
                      {combo.durationWeeks} Weeks · Next Batch {combo.nextBatchDate}
                    </Typography>

                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: '1.75rem',
                        color: isHighlighted ? '#FAF8F5' : '#1C1917',
                        mb: 1,
                      }}
                    >
                      {combo.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: isHighlighted ? 'rgba(250, 248, 245, 0.78)' : '#57534E',
                        mb: 2.5,
                        lineHeight: 1.55,
                      }}
                    >
                      {combo.tagline}
                    </Typography>

                    {/* Pricing Comparison */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: isHighlighted ? 'rgba(255,255,255,0.06)' : '#FAF8F5',
                        border: isHighlighted
                          ? '1px solid rgba(255,255,255,0.14)'
                          : '1px solid #E7E2DA',
                        mb: 2.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 0.5 }}>
                        <Typography
                          className="tabular-nums"
                          sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            color: isHighlighted ? '#FAF8F5' : '#1C1917',
                          }}
                        >
                          {formatINR(combo.comboFee)}
                        </Typography>
                        <Typography
                          className="tabular-nums"
                          sx={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '0.9rem',
                            textDecoration: 'line-through',
                            color: isHighlighted ? 'rgba(250,248,245,0.5)' : '#78716C',
                          }}
                        >
                          {formatINR(combo.regularFee)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        className="tabular-nums"
                        sx={{
                          color: isHighlighted ? '#E7D5BA' : '#7A283B',
                          fontWeight: 600,
                          display: 'block',
                        }}
                      >
                        Save {formatINR(savings)} · From {formatINR(monthlyEmi)}/mo ({combo.installmentMonths}-month 0% EMI)
                      </Typography>
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: isHighlighted ? 'rgba(250,248,245,0.72)' : '#57534E',
                        display: 'block',
                        mb: 1,
                      }}
                    >
                      Included Courses ({combo.includedCourseTitles.length})
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isHighlighted ? '#FAF8F5' : '#1C1917',
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                        mb: 2,
                      }}
                    >
                      {combo.includedCourseTitles.join(' · ')}
                    </Typography>

                    <Divider
                      sx={{
                        my: 2,
                        borderColor: isHighlighted ? 'rgba(255,255,255,0.12)' : '#E7E2DA',
                      }}
                    />

                    <List dense disablePadding sx={{ mb: 3 }}>
                      {combo.perks.map((perk) => (
                        <ListItem key={perk} disableGutters sx={{ py: 0.45, alignItems: 'flex-start' }}>
                          <ListItemIcon sx={{ minWidth: 26, mt: 0.4 }}>
                            <CheckIcon
                              sx={{
                                fontSize: 16,
                                color: isHighlighted ? '#E7D5BA' : '#7A283B',
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={perk}
                            slotProps={{
                              primary: {
                                variant: 'body2',
                                sx: {
                                  fontSize: '0.85rem',
                                  color: isHighlighted ? 'rgba(250,248,245,0.9)' : '#44403C',
                                },
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Button
                    fullWidth
                    variant={isHighlighted ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                    onClick={() => onSelectCombo(combo)}
                    sx={
                      isHighlighted
                        ? {
                            bgcolor: '#FAF8F5',
                            color: '#1C1917',
                            '&:hover': { bgcolor: '#E7D5BA' },
                          }
                        : {
                            borderColor: '#7A283B',
                            color: '#7A283B',
                            '&:hover': { bgcolor: 'rgba(122,40,59,0.06)', borderColor: '#5C1C2B' },
                          }
                    }
                  >
                    Enroll in Combo
                  </Button>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};
