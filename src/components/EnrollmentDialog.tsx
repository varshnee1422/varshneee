import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import { User, signInWithPopup } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  ComboPackage,
  Course,
  ExperienceLevel,
  PaymentPlan,
  ProgramType,
} from '../types/academy';
import { BATCH_OPTIONS, formatINR } from '../data/academyDefaults';
import {
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
} from '../firebase';

export interface EnrollmentInitialSelection {
  programType: ProgramType;
  programId: string;
  programTitle: string;
  totalFee: number;
  paymentPlan: PaymentPlan;
}

interface EnrollmentDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  courses: Course[];
  combos: ComboPackage[];
  initialSelection: EnrollmentInitialSelection | null;
  onSuccess: (message: string) => void;
}

export const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({
  open,
  onClose,
  user,
  courses,
  combos,
  initialSelection,
  onSuccess,
}) => {
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [programKey, setProgramKey] = useState('consultation:studio_tour');
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('emi_3');
  const [preferredBatch, setPreferredBatch] = useState(BATCH_OPTIONS[0]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Beginner');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (user) {
      if (!studentName && user.displayName) setStudentName(user.displayName);
      if (!email && user.email) setEmail(user.email);
    }
  }, [user, studentName, email]);

  useEffect(() => {
    if (open && initialSelection) {
      setProgramKey(`${initialSelection.programType}:${initialSelection.programId}`);
      setPaymentPlan(initialSelection.paymentPlan);
      setErrorText('');
    } else if (open && !initialSelection) {
      if (combos[0]) {
        setProgramKey(`combo:${combos[0].id}`);
        setPaymentPlan('emi_3');
      }
      setErrorText('');
    }
  }, [open, initialSelection, combos]);

  const resolvedProgram = (() => {
    const [type, id] = programKey.split(':');
    if (type === 'combo') {
      const c = combos.find((item) => item.id === id);
      if (c) {
        return {
          programType: 'combo' as ProgramType,
          programId: c.id,
          programTitle: c.title,
          totalFee:
            initialSelection?.programId === c.id
              ? initialSelection.totalFee
              : c.comboFee,
        };
      }
    }
    if (type === 'course') {
      const c = courses.find((item) => item.id === id);
      if (c) {
        return {
          programType: 'course' as ProgramType,
          programId: c.id,
          programTitle: c.title,
          totalFee:
            initialSelection?.programId === c.id
              ? initialSelection.totalFee
              : c.feeAmount,
        };
      }
    }
    return {
      programType: 'consultation' as ProgramType,
      programId: 'studio_tour',
      programTitle: 'Free Studio Walkthrough & Kit Preview',
      totalFee: 0,
    };
  })();

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setErrorText('');
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user.displayName) setStudentName(cred.user.displayName);
      if (cred.user.email) setEmail(cred.user.email);
    } catch (err) {
      setErrorText(
        err instanceof Error ? err.message : 'Google sign-in could not be completed.',
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!user) {
      setErrorText('Please sign in with Google first to save your enrollment to your student record.');
      return;
    }

    const trimmedName = studentName.trim().slice(0, 100);
    const trimmedEmail = email.trim().slice(0, 120);
    const trimmedPhone = phone.trim().slice(0, 25);
    const trimmedNotes = notes.trim().slice(0, 500);

    if (trimmedName.length < 2) {
      setErrorText('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorText('Please enter a valid email address.');
      return;
    }
    if (trimmedPhone.length < 7) {
      setErrorText('Please enter a valid phone or WhatsApp number (at least 7 digits).');
      return;
    }

    setSubmitting(true);
    const enrollmentId = `enr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const targetPath = `enrollments/${enrollmentId}`;

    try {
      await setDoc(doc(db, 'enrollments', enrollmentId), {
        userId: user.uid,
        studentName: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        programType: resolvedProgram.programType,
        programId: resolvedProgram.programId,
        programTitle: resolvedProgram.programTitle.slice(0, 140),
        totalFee: resolvedProgram.totalFee,
        paymentPlan:
          resolvedProgram.programType === 'consultation' ? 'consultation' : paymentPlan,
        preferredBatch: preferredBatch.slice(0, 60),
        experienceLevel,
        notes: trimmedNotes,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      onSuccess(
        `Seat request saved for ${resolvedProgram.programTitle}. Track status anytime in Student Portal.`,
      );
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, targetPath);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 2.5 } } }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: '#7A283B', fontWeight: 600 }}>
            Admissions &amp; Batch Reservation
          </Typography>
          <Typography variant="h4" sx={{ fontSize: '1.65rem', mt: 0.25 }}>
            Enroll or Book Studio Tour
          </Typography>
        </Box>
        <IconButton aria-label="Close enrollment form" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderColor: '#E7E2DA' }}>
          {!user && (
            <Alert
              severity="info"
              sx={{
                mb: 2.5,
                bgcolor: '#FAF8F5',
                color: '#1C1917',
                border: '1px solid #E7E2DA',
              }}
              action={
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  disabled={signingIn}
                >
                  {signingIn ? 'Signing in...' : 'Sign In'}
                </Button>
              }
            >
              Sign in with Google to link your seat reservation and fee plan to your student portal.
            </Alert>
          )}

          {errorText && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {errorText}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="enroll-program-label">Program / Consultation</InputLabel>
                <Select
                  labelId="enroll-program-label"
                  label="Program / Consultation"
                  value={programKey}
                  onChange={(e) => setProgramKey(e.target.value)}
                >
                  <MenuItem value="consultation:studio_tour">
                    Free Studio Walkthrough &amp; Kit Preview (₹0)
                  </MenuItem>
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
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                size="small"
                label="Full Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 100 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                size="small"
                label="Phone / WhatsApp"
                placeholder="+91 98400 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 25 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                size="small"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 120 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="enroll-batch-label">Preferred Batch</InputLabel>
                <Select
                  labelId="enroll-batch-label"
                  label="Preferred Batch"
                  value={preferredBatch}
                  onChange={(e) => setPreferredBatch(e.target.value)}
                >
                  {BATCH_OPTIONS.map((batch) => (
                    <MenuItem key={batch} value={batch}>
                      {batch}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="enroll-exp-label">Experience Level</InputLabel>
                <Select
                  labelId="enroll-exp-label"
                  label="Experience Level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                >
                  <MenuItem value="Beginner">Beginner (Fresh Start)</MenuItem>
                  <MenuItem value="Intermediate">Intermediate (Self-Taught)</MenuItem>
                  <MenuItem value="Working Artist">Working Artist (Upskilling)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {resolvedProgram.programType !== 'consultation' && (
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="enroll-plan-label">Fee Payment Option</InputLabel>
                  <Select
                    labelId="enroll-plan-label"
                    label="Fee Payment Option"
                    value={paymentPlan === 'consultation' ? 'emi_3' : paymentPlan}
                    onChange={(e) => setPaymentPlan(e.target.value as PaymentPlan)}
                  >
                    <MenuItem value="full">Full Payment (5% Merit Waiver)</MenuItem>
                    <MenuItem value="emi_3">3-Month 0% EMI Plan</MenuItem>
                    <MenuItem value="emi_6">6-Month Installment Plan</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                label="Questions or Kit Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                slotProps={{ htmlInput: { maxLength: 500 } }}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 2.5,
              p: 2,
              bgcolor: '#FAF8F5',
              borderRadius: 2,
              border: '1px solid #E7E2DA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" sx={{ color: '#57534E' }}>
              Estimated Fee Total
            </Typography>
            <Typography
              className="tabular-nums"
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#1C1917',
              }}
            >
              {resolvedProgram.totalFee === 0 ? 'Free' : formatINR(resolvedProgram.totalFee)}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ color: '#57534E' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting || !user}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Saving...' : 'Confirm Reservation'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
