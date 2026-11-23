import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { ComboPackage, Course, PaymentPlan, ProgramType } from '../types/academy';
import { formatINR } from '../data/academyDefaults';

interface FeesSectionProps {
  courses: Course[];
  combos: ComboPackage[];
  onEnrollWithPlan: (selection: {
    programType: ProgramType;
    programId: string;
    programTitle: string;
    totalFee: number;
    paymentPlan: PaymentPlan;
  }) => void;
}

export const FeesSection: React.FC<FeesSectionProps> = ({
  courses,
  combos,
  onEnrollWithPlan,
}) => {
  const defaultProgramKey = combos[0]
    ? `combo:${combos[0].id}`
    : courses[0]
      ? `course:${courses[0].id}`
      : '';

  const [selectedKey, setSelectedKey] = useState<string>(defaultProgramKey);
  const [addAirbrushUpgrade, setAddAirbrushUpgrade] = useState(false);
  const [addPortfolioShoot, setAddPortfolioShoot] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('emi_3');

  const resolvedProgram = useMemo(() => {
    const activeKey = selectedKey || defaultProgramKey;
    const [type, id] = activeKey.split(':');
    if (type === 'combo') {
      const found = combos.find((c) => c.id === id) || combos[0];
      if (found) {
        return {
          programType: 'combo' as ProgramType,
          programId: found.id,
          programTitle: found.title,
          baseFee: found.comboFee,
          durationLabel: `${found.durationWeeks} Weeks`,
        };
      }
    }
    const foundCourse = courses.find((c) => c.id === id) || courses[0];
    if (foundCourse) {
      return {
        programType: 'course' as ProgramType,
        programId: foundCourse.id,
        programTitle: foundCourse.title,
        baseFee: foundCourse.feeAmount,
        durationLabel: `${foundCourse.durationWeeks} Weeks`,
      };
    }
    return {
      programType: 'combo' as ProgramType,
      programId: 'combo_complete_bridal_couture',
      programTitle: 'The Complete Bridal Couture Diploma',
      baseFee: 118000,
      durationLabel: '14 Weeks',
    };
  }, [selectedKey, defaultProgramKey, combos, courses]);

  const breakdown = useMemo(() => {
    const addons = (addAirbrushUpgrade ? 14000 : 0) + (addPortfolioShoot ? 8500 : 0);
    const gross = resolvedProgram.baseFee + addons;
    const meritDiscount = paymentPlan === 'full' ? Math.round(gross * 0.05) : 0;
    const finalTotal = gross - meritDiscount;
    const bookingDeposit = Math.round(finalTotal * 0.25);
    const remainingBalance = finalTotal - bookingDeposit;
    const months = paymentPlan === 'emi_6' ? 6 : paymentPlan === 'emi_3' ? 3 : 1;
    const monthlyInstallment =
      paymentPlan === 'full' ? 0 : Math.round(remainingBalance / months);

    return {
      addons,
      gross,
      meritDiscount,
      finalTotal,
      bookingDeposit,
      remainingBalance,
      months,
      monthlyInstallment,
    };
  }, [resolvedProgram.baseFee, addAirbrushUpgrade, addPortfolioShoot, paymentPlan]);

  return (
    <Box
      id="fees"
      component="section"
      sx={{
        py: { xs: 8, md: 11 },
        bgcolor: '#FFFFFF',
        borderTop: '1px solid #E7E2DA',
        borderBottom: '1px solid #E7E2DA',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 660, mb: 5 }}>
          <Typography variant="body2" sx={{ color: '#7A283B', fontWeight: 600, mb: 1 }}>
            Transparent Tuition &amp; Installments
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
            Fees Structure &amp; Interactive EMI Estimator
          </Typography>
          <Typography variant="body1" sx={{ color: '#57534E', lineHeight: 1.65 }}>
            All studio materials, model fees, and certifications are included in the published fee.
            Calculate your exact deposit and zero-interest installment schedule below.
          </Typography>
        </Box>

        {/* Interactive Calculator Grid */}
        <Grid container spacing={3} sx={{ mb: 7, alignItems: 'stretch' }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 2.5, height: '100%' }}>
              <Typography variant="h4" sx={{ fontSize: '1.55rem', mb: 3 }}>
                Customize Your Program &amp; Plan
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="fee-program-select-label">Select Course or Combo Track</InputLabel>
                <Select
                  labelId="fee-program-select-label"
                  value={selectedKey || defaultProgramKey}
                  label="Select Course or Combo Track"
                  onChange={(e) => setSelectedKey(e.target.value)}
                >
                  {combos.map((combo) => (
                    <MenuItem key={`combo:${combo.id}`} value={`combo:${combo.id}`}>
                      Combo · {combo.title} ({formatINR(combo.comboFee)})
                    </MenuItem>
                  ))}
                  {courses.map((course) => (
                    <MenuItem key={`course:${course.id}`} value={`course:${course.id}`}>
                      Course · {course.title} ({formatINR(course.feeAmount)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="subtitle2" sx={{ color: '#1C1917', mb: 1.25 }}>
                Payment Schedule
              </Typography>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={paymentPlan}
                onChange={(_e, val) => {
                  if (val) setPaymentPlan(val);
                }}
                aria-label="Select payment schedule"
                sx={{
                  mb: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.25,
                    borderColor: '#E7E2DA',
                    color: '#57534E',
                    '&.Mui-selected': {
                      bgcolor: '#7A283B',
                      color: '#FFFFFF',
                      '&:hover': { bgcolor: '#5C1C2B' },
                    },
                  },
                }}
              >
                <ToggleButton value="full">Full Pay (5% Waiver)</ToggleButton>
                <ToggleButton value="emi_3">3-Month 0% EMI</ToggleButton>
                <ToggleButton value="emi_6">6-Month Installment</ToggleButton>
              </ToggleButtonGroup>

              <Divider sx={{ my: 2.5 }} />

              <Typography variant="subtitle2" sx={{ color: '#1C1917', mb: 1 }}>
                Optional Studio Enhancements
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={addAirbrushUpgrade}
                      onChange={(e) => setAddAirbrushUpgrade(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#44403C' }}>
                      Personal Temptu Airbrush Compressor &amp; Gun Kit (+₹14,000)
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={addPortfolioShoot}
                      onChange={(e) => setAddPortfolioShoot(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#44403C' }}>
                      Additional Couture Editorial Lookbook Shoot &amp; Reel (+₹8,500)
                    </Typography>
                  }
                />
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 2.5,
                bgcolor: '#FAF8F5',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: '#7A283B', fontWeight: 600 }}>
                  Estimated Tuition Summary · {resolvedProgram.durationLabel}
                </Typography>
                <Typography variant="h4" sx={{ fontSize: '1.5rem', mt: 0.5, mb: 2.5 }}>
                  {resolvedProgram.programTitle}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#57534E' }}>
                      Base Program Tuition
                    </Typography>
                    <Typography
                      className="tabular-nums"
                      sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem' }}
                    >
                      {formatINR(resolvedProgram.baseFee)}
                    </Typography>
                  </Box>

                  {breakdown.addons > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#57534E' }}>
                        Studio Add-Ons
                      </Typography>
                      <Typography
                        className="tabular-nums"
                        sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.9rem' }}
                      >
                        +{formatINR(breakdown.addons)}
                      </Typography>
                    </Box>
                  )}

                  {breakdown.meritDiscount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#166534', fontWeight: 600 }}>
                        5% Full-Pay Merit Waiver
                      </Typography>
                      <Typography
                        className="tabular-nums"
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '0.9rem',
                          color: '#166534',
                          fontWeight: 600,
                        }}
                      >
                        -{formatINR(breakdown.meritDiscount)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Total Payable Fee
                  </Typography>
                  <Typography
                    className="tabular-nums"
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '1.65rem',
                      fontWeight: 600,
                      color: '#1C1917',
                    }}
                  >
                    {formatINR(breakdown.finalTotal)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E7E2DA',
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="caption" sx={{ color: '#57534E' }}>
                      Seat Booking Deposit (25%)
                    </Typography>
                    <Typography
                      variant="caption"
                      className="tabular-nums"
                      sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}
                    >
                      {formatINR(breakdown.bookingDeposit)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" sx={{ color: '#57534E' }}>
                      {paymentPlan === 'full'
                        ? 'Remaining on Orientation Day'
                        : `Monthly Installment (${breakdown.months} mos)`}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="tabular-nums"
                      sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, color: '#7A283B' }}
                    >
                      {paymentPlan === 'full'
                        ? formatINR(breakdown.finalTotal - breakdown.bookingDeposit)
                        : `${formatINR(breakdown.monthlyInstallment)} / mo`}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={() =>
                  onEnrollWithPlan({
                    programType: resolvedProgram.programType,
                    programId: resolvedProgram.programId,
                    programTitle: resolvedProgram.programTitle,
                    totalFee: breakdown.finalTotal,
                    paymentPlan,
                  })
                }
              >
                Lock This Fee Plan
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Full Comparison Table */}
        <Typography variant="h4" sx={{ fontSize: '1.6rem', mb: 2 }}>
          Complete Academy Fee Schedule
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2.5 }}>
          <Table aria-label="Bridal academy complete fee schedule">
            <TableHead>
              <TableRow>
                <TableCell>Program</TableCell>
                <TableCell>Track</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell align="right">Kit Value</TableCell>
                <TableCell align="right">Total Fee</TableCell>
                <TableCell align="right">25% Deposit</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {combos.map((combo) => (
                <TableRow key={combo.id} hover>
                  <TableCell sx={{ fontWeight: 600, color: '#1C1917' }}>
                    {combo.title}
                  </TableCell>
                  <TableCell sx={{ color: '#7A283B', fontWeight: 500 }}>Combo Diploma</TableCell>
                  <TableCell align="right" className="tabular-nums" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {combo.durationWeeks} Wks
                  </TableCell>
                  <TableCell align="right" className="tabular-nums" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    Included
                  </TableCell>
                  <TableCell align="right" className="tabular-nums" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>
                    {formatINR(combo.comboFee)}
                  </TableCell>
                  <TableCell align="right" className="tabular-nums" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {formatINR(Math.round(combo.comboFee * 0.25))}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        onEnrollWithPlan({
                          programType: 'combo',
                          programId: combo.id,
                          programTitle: combo.title,
                          totalFee: combo.comboFee,
                          paymentPlan: 'emi_3',
                        })
                      }
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {courses.map((course) => (
                <TableRow key={course.id} hover>
                  <TableCell sx={{ fontWeight: 500, color: '#1C1917' }}>{course.title}</TableCell>
                  <TableCell sx={{ color: '#57534E' }}>{course.level}</TableCell>
                  <TableCell align="right" className="tabular-nums" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {course.durationWeeks} Wks
                  </TableCell>
                  <TableCell align="right" className="tabular-nums" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {course.kitIncluded ? formatINR(course.kitValue) : 'Studio Use'}
                  </TableCell>
                  <TableCell align="right" className="tabular-nums" sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 }}>
                    {formatINR(course.feeAmount)}
                  </TableCell>
                  <TableCell align="right" className="tabular-nums" sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {formatINR(Math.round(course.feeAmount * 0.25))}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="text"
                      onClick={() =>
                        onEnrollWithPlan({
                          programType: 'course',
                          programId: course.id,
                          programTitle: course.title,
                          totalFee: course.feeAmount,
                          paymentPlan: 'emi_3',
                        })
                      }
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};
