import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import {
  ComboPackage,
  Course,
  CourseCategory,
  CourseLevel,
  Enrollment,
  EnrollmentStatus,
} from '../types/academy';
import {
  COURSE_IMAGES,
  DEFAULT_COMBOS,
  DEFAULT_COURSES,
  formatINR,
} from '../data/academyDefaults';
import {
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  isAdminEmail,
} from '../firebase';

interface PortalDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  enrollments: Enrollment[];
  courses: Course[];
  combos: ComboPackage[];
  onNotify: (message: string) => void;
}

const STATUS_LABELS: Record<EnrollmentStatus, string> = {
  pending: 'Pending Review',
  confirmed: 'Seat Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const PortalDrawer: React.FC<PortalDrawerProps> = ({
  open,
  onClose,
  user,
  enrollments,
  courses,
  combos,
  onNotify,
}) => {
  const isAdmin = isAdminEmail(user?.email, user?.emailVerified);
  const [portalTab, setPortalTab] = useState<'enrollments' | 'catalog'>('enrollments');
  const [busyAction, setBusyAction] = useState(false);

  // Course editor modal state
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [cTitle, setCTitle] = useState('');
  const [cCategory, setCCategory] = useState<CourseCategory>('makeup');
  const [cLevel, setCLevel] = useState<CourseLevel>('Pro Mastery');
  const [cWeeks, setCWeeks] = useState(6);
  const [cHours, setCHours] = useState(120);
  const [cFee, setCFee] = useState(55000);
  const [cKitValue, setCKitValue] = useState(20000);
  const [cBatch, setCBatch] = useState('Jan 12, 2027');
  const [cSeats, setCSeats] = useState(8);
  const [cSummary, setCSummary] = useState('');
  const [cModulesText, setCModulesText] = useState('');

  // Combo editor modal state
  const [comboDialogOpen, setComboDialogOpen] = useState(false);
  const [editingComboId, setEditingComboId] = useState<string | null>(null);
  const [cbTitle, setCbTitle] = useState('');
  const [cbTagline, setCbTagline] = useState('');
  const [cbWeeks, setCbWeeks] = useState(12);
  const [cbRegularFee, setCbRegularFee] = useState(135000);
  const [cbComboFee, setCbComboFee] = useState(98000);
  const [cbMonths, setCbMonths] = useState(6);
  const [cbBatch, setCbBatch] = useState('Jan 12, 2027');
  const [cbCoursesText, setCbCoursesText] = useState('');
  const [cbPerksText, setCbPerksText] = useState('');

  const handleSignIn = async () => {
    setBusyAction(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onNotify('Signed in to Aurelia Portal.');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusyAction(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    onNotify('Signed out.');
  };

  const handleCancelEnrollment = async (enrollmentId: string) => {
    setBusyAction(true);
    try {
      await updateDoc(doc(db, 'enrollments', enrollmentId), {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
      onNotify('Enrollment request cancelled.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `enrollments/${enrollmentId}`);
    } finally {
      setBusyAction(false);
    }
  };

  const handleAdminStatusChange = async (enrollmentId: string, status: EnrollmentStatus) => {
    setBusyAction(true);
    try {
      await updateDoc(doc(db, 'enrollments', enrollmentId), {
        status,
        updatedAt: serverTimestamp(),
      });
      onNotify(`Enrollment marked ${STATUS_LABELS[status]}.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `enrollments/${enrollmentId}`);
    } finally {
      setBusyAction(false);
    }
  };

  const handleSeedCatalog = async () => {
    setBusyAction(true);
    try {
      for (const course of DEFAULT_COURSES) {
        await setDoc(doc(db, 'courses', course.id), {
          title: course.title,
          category: course.category,
          level: course.level,
          durationWeeks: course.durationWeeks,
          totalHours: course.totalHours,
          feeAmount: course.feeAmount,
          kitIncluded: course.kitIncluded,
          kitValue: course.kitValue,
          certification: course.certification,
          imageUrl: course.imageUrl,
          summary: course.summary,
          modules: course.modules,
          nextBatchDate: course.nextBatchDate,
          seatsAvailable: course.seatsAvailable,
          sortOrder: course.sortOrder,
          updatedAt: serverTimestamp(),
        });
      }
      for (const combo of DEFAULT_COMBOS) {
        await setDoc(doc(db, 'combos', combo.id), {
          title: combo.title,
          tagline: combo.tagline,
          includedCourseTitles: combo.includedCourseTitles,
          durationWeeks: combo.durationWeeks,
          regularFee: combo.regularFee,
          comboFee: combo.comboFee,
          installmentMonths: combo.installmentMonths,
          perks: combo.perks,
          isFeatured: combo.isFeatured,
          nextBatchDate: combo.nextBatchDate,
          sortOrder: combo.sortOrder,
          updatedAt: serverTimestamp(),
        });
      }
      onNotify('Starter courses and combo packages synced to Firestore.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'courses_and_combos_seed');
    } finally {
      setBusyAction(false);
    }
  };

  const openCourseEditor = (course?: Course) => {
    if (course) {
      setEditingCourseId(course.id);
      setCTitle(course.title);
      setCCategory(course.category);
      setCLevel(course.level);
      setCWeeks(course.durationWeeks);
      setCHours(course.totalHours);
      setCFee(course.feeAmount);
      setCKitValue(course.kitValue);
      setCBatch(course.nextBatchDate);
      setCSeats(course.seatsAvailable);
      setCSummary(course.summary);
      setCModulesText(course.modules.join('\n'));
    } else {
      setEditingCourseId(null);
      setCTitle('');
      setCCategory('makeup');
      setCLevel('Pro Mastery');
      setCWeeks(6);
      setCHours(100);
      setCFee(48000);
      setCKitValue(18000);
      setCBatch('Jan 12, 2027');
      setCSeats(8);
      setCSummary('Hands-on studio bridal artistry module with live model assessments.');
      setCModulesText('Colorimetry & skin prep\nBridal eye sculpting\nLive model critique');
    }
    setCourseDialogOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingCourseId || `course_${Date.now()}`;
    const modulesList = cModulesText
      .split('\n')
      .map((s) => s.trim().slice(0, 120))
      .filter(Boolean)
      .slice(0, 12);
    const imageMap: Record<CourseCategory, string> = {
      makeup: COURSE_IMAGES.makeup,
      hair: COURSE_IMAGES.hair,
      draping: COURSE_IMAGES.draping,
      nails: COURSE_IMAGES.atelier,
      skincare: COURSE_IMAGES.masterclass,
    };

    setBusyAction(true);
    try {
      await setDoc(doc(db, 'courses', id), {
        title: cTitle.trim().slice(0, 120),
        category: cCategory,
        level: cLevel,
        durationWeeks: Number(cWeeks),
        totalHours: Number(cHours),
        feeAmount: Number(cFee),
        kitIncluded: Number(cKitValue) > 0,
        kitValue: Number(cKitValue),
        certification: 'Aurelia Bridal Academy Certified',
        imageUrl: imageMap[cCategory],
        summary: cSummary.trim().slice(0, 400),
        modules: modulesList.length ? modulesList : ['Core Bridal Practicals'],
        nextBatchDate: cBatch.trim().slice(0, 40),
        seatsAvailable: Number(cSeats),
        sortOrder: courses.length + 1,
        updatedAt: serverTimestamp(),
      });
      setCourseDialogOpen(false);
      onNotify(`Saved course "${cTitle.trim()}" to Firestore.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `courses/${id}`);
    } finally {
      setBusyAction(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    setBusyAction(true);
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      onNotify('Course removed from Firestore.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `courses/${courseId}`);
    } finally {
      setBusyAction(false);
    }
  };

  const openComboEditor = (combo?: ComboPackage) => {
    if (combo) {
      setEditingComboId(combo.id);
      setCbTitle(combo.title);
      setCbTagline(combo.tagline);
      setCbWeeks(combo.durationWeeks);
      setCbRegularFee(combo.regularFee);
      setCbComboFee(combo.comboFee);
      setCbMonths(combo.installmentMonths);
      setCbBatch(combo.nextBatchDate);
      setCbCoursesText(combo.includedCourseTitles.join('\n'));
      setCbPerksText(combo.perks.join('\n'));
    } else {
      setEditingComboId(null);
      setCbTitle('');
      setCbTagline('Integrated Bridal Artistry & Styling Combo Track');
      setCbWeeks(10);
      setCbRegularFee(120000);
      setCbComboFee(92000);
      setCbMonths(4);
      setCbBatch('Jan 12, 2027');
      setCbCoursesText('Pro HD & Airbrush Bridal Artistry\nSculpted Bridal Hair & Floral Architecture');
      setCbPerksText('Pro Vanity Kit Included\n2 Editorial Portfolio Shoots');
    }
    setComboDialogOpen(true);
  };

  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingComboId || `combo_${Date.now()}`;
    const included = cbCoursesText
      .split('\n')
      .map((s) => s.trim().slice(0, 120))
      .filter(Boolean)
      .slice(0, 8);
    const perks = cbPerksText
      .split('\n')
      .map((s) => s.trim().slice(0, 160))
      .filter(Boolean)
      .slice(0, 10);

    setBusyAction(true);
    try {
      await setDoc(doc(db, 'combos', id), {
        title: cbTitle.trim().slice(0, 120),
        tagline: cbTagline.trim().slice(0, 160),
        includedCourseTitles: included.length ? included : ['Bridal Core Program'],
        durationWeeks: Number(cbWeeks),
        regularFee: Number(cbRegularFee),
        comboFee: Math.min(Number(cbComboFee), Number(cbRegularFee)),
        installmentMonths: Number(cbMonths),
        perks: perks.length ? perks : ['Studio Kit & Portfolio Included'],
        isFeatured: false,
        nextBatchDate: cbBatch.trim().slice(0, 40),
        sortOrder: combos.length + 1,
        updatedAt: serverTimestamp(),
      });
      setComboDialogOpen(false);
      onNotify(`Saved combo "${cbTitle.trim()}" to Firestore.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `combos/${id}`);
    } finally {
      setBusyAction(false);
    }
  };

  const handleDeleteCombo = async (comboId: string) => {
    setBusyAction(true);
    try {
      await deleteDoc(doc(db, 'combos', comboId));
      onNotify('Combo package removed from Firestore.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `combos/${comboId}`);
    } finally {
      setBusyAction(false);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{ paper: { sx: { width: { xs: '100%', sm: 520 }, bgcolor: '#FAF8F5' } } }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            bgcolor: '#FFFFFF',
            borderBottom: '1px solid #E7E2DA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#7A283B', fontWeight: 600 }}>
              {isAdmin ? 'Academy Director Console' : 'Student Admissions Portal'}
            </Typography>
            <Typography variant="h4" sx={{ fontSize: '1.55rem' }}>
              {user ? user.displayName || user.email : 'Sign In to Portal'}
            </Typography>
          </Box>
          <IconButton aria-label="Close portal" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
          {!user ? (
            <Paper variant="outlined" sx={{ p: 3.5, borderRadius: 2.5, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Access Your Seat Reservations
              </Typography>
              <Typography variant="body2" sx={{ color: '#57534E', mb: 3, lineHeight: 1.6 }}>
                Sign in with Google to view your submitted course enrollments, installment plans,
                and batch confirmation status in real time.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<GoogleIcon />}
                onClick={handleSignIn}
                disabled={busyAction}
              >
                {busyAction ? 'Connecting...' : 'Continue with Google'}
              </Button>
            </Paper>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2.5,
                }}
              >
                <Typography variant="caption" sx={{ color: '#57534E' }}>
                  Signed in as {user.email}
                </Typography>
                <Button size="small" onClick={handleSignOut} sx={{ color: '#7A283B' }}>
                  Sign Out
                </Button>
              </Box>

              {isAdmin && (
                <Tabs
                  value={portalTab}
                  onChange={(_e, val) => setPortalTab(val)}
                  sx={{ mb: 3, borderBottom: '1px solid #E7E2DA' }}
                >
                  <Tab value="enrollments" label={`Enrollments (${enrollments.length})`} />
                  <Tab value="catalog" label="Manage Courses & Combos" />
                </Tabs>
              )}

              {/* Enrollments Tab */}
              {(portalTab === 'enrollments' || !isAdmin) && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {enrollments.length === 0 ? (
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#57534E' }}>
                        No enrollments or consultation bookings found yet.
                      </Typography>
                    </Paper>
                  ) : (
                    enrollments.map((enr) => (
                      <Paper key={enr.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {enr.programTitle}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color:
                                enr.status === 'confirmed'
                                  ? '#166534'
                                  : enr.status === 'cancelled'
                                    ? '#991B1B'
                                    : '#7A283B',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {STATUS_LABELS[enr.status]}
                          </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ color: '#57534E', mb: 1 }}>
                          {enr.studentName} · {enr.phone} · {enr.experienceLevel}
                        </Typography>

                        <Typography
                          variant="caption"
                          className="tabular-nums"
                          sx={{ color: '#78716C', display: 'block', mb: 1.5 }}
                        >
                          Batch: {enr.preferredBatch} · Fee:{' '}
                          {enr.totalFee === 0 ? 'Free' : formatINR(enr.totalFee)} · Plan:{' '}
                          {enr.paymentPlan.toUpperCase()}
                        </Typography>

                        {enr.notes && (
                          <Typography variant="body2" sx={{ color: '#44403C', fontStyle: 'italic', mb: 1.5 }}>
                            “{enr.notes}”
                          </Typography>
                        )}

                        {isAdmin ? (
                          <FormControl size="small" fullWidth>
                            <InputLabel>Update Status</InputLabel>
                            <Select
                              label="Update Status"
                              value={enr.status}
                              disabled={busyAction}
                              onChange={(e) =>
                                handleAdminStatusChange(enr.id, e.target.value as EnrollmentStatus)
                              }
                            >
                              <MenuItem value="pending">Pending Review</MenuItem>
                              <MenuItem value="confirmed">Seat Confirmed</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          enr.status === 'pending' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              disabled={busyAction}
                              onClick={() => handleCancelEnrollment(enr.id)}
                            >
                              Cancel Request
                            </Button>
                          )
                        )}
                      </Paper>
                    ))
                  )}
                </Box>
              )}

              {/* Admin Catalog Management Tab */}
              {isAdmin && portalTab === 'catalog' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Alert
                    severity="info"
                    sx={{ bgcolor: '#FFFFFF', border: '1px solid #E7E2DA', color: '#1C1917' }}
                    action={
                      <Button
                        size="small"
                        startIcon={
                          busyAction ? <CircularProgress size={14} /> : <CloudUploadOutlinedIcon />
                        }
                        onClick={handleSeedCatalog}
                        disabled={busyAction}
                      >
                        Sync Defaults
                      </Button>
                    }
                  >
                    Populate or reset starter Bridal Courses &amp; Combos in Firestore.
                  </Alert>

                  {/* Courses Admin List */}
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Courses ({courses.length})
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => openCourseEditor()}
                      >
                        Add Course
                      </Button>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {courses.map((course) => (
                        <Paper
                          key={course.id}
                          variant="outlined"
                          sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {course.title}
                            </Typography>
                            <Typography variant="caption" className="tabular-nums" sx={{ color: '#57534E' }}>
                              {formatINR(course.feeAmount)} · {course.durationWeeks} Wks ·{' '}
                              {course.isFromDatabase ? 'Live DB' : 'Starter Seed'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              aria-label={`Edit ${course.title}`}
                              onClick={() => openCourseEditor(course)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                            {course.isFromDatabase && (
                              <IconButton
                                size="small"
                                aria-label={`Delete ${course.title}`}
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>

                  <Divider />

                  {/* Combos Admin List */}
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Combo Packages ({combos.length})
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => openComboEditor()}
                      >
                        Add Combo
                      </Button>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {combos.map((combo) => (
                        <Paper
                          key={combo.id}
                          variant="outlined"
                          sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {combo.title}
                            </Typography>
                            <Typography variant="caption" className="tabular-nums" sx={{ color: '#57534E' }}>
                              {formatINR(combo.comboFee)} (Reg. {formatINR(combo.regularFee)}) ·{' '}
                              {combo.isFromDatabase ? 'Live DB' : 'Starter Seed'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              aria-label={`Edit ${combo.title}`}
                              onClick={() => openComboEditor(combo)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                            {combo.isFromDatabase && (
                              <IconButton
                                size="small"
                                aria-label={`Delete ${combo.title}`}
                                onClick={() => handleDeleteCombo(combo.id)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Drawer>

      {/* Course Editor Dialog */}
      <Dialog open={courseDialogOpen} onClose={() => setCourseDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCourseId ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <Box component="form" onSubmit={handleSaveCourse}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Course Title"
                  value={cTitle}
                  onChange={(e) => setCTitle(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={cCategory}
                    onChange={(e) => setCCategory(e.target.value as CourseCategory)}
                  >
                    <MenuItem value="makeup">Makeup</MenuItem>
                    <MenuItem value="hair">Hair</MenuItem>
                    <MenuItem value="draping">Draping</MenuItem>
                    <MenuItem value="nails">Nails</MenuItem>
                    <MenuItem value="skincare">Skincare</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Level</InputLabel>
                  <Select
                    label="Level"
                    value={cLevel}
                    onChange={(e) => setCLevel(e.target.value as CourseLevel)}
                  >
                    <MenuItem value="Foundation">Foundation</MenuItem>
                    <MenuItem value="Pro Mastery">Pro Mastery</MenuItem>
                    <MenuItem value="Masterclass">Masterclass</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  size="small"
                  label="Weeks"
                  value={cWeeks}
                  onChange={(e) => setCWeeks(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  size="small"
                  label="Hours"
                  value={cHours}
                  onChange={(e) => setCHours(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  size="small"
                  label="Seats"
                  value={cSeats}
                  onChange={(e) => setCSeats(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  size="small"
                  label="Tuition Fee (INR)"
                  value={cFee}
                  onChange={(e) => setCFee(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  size="small"
                  label="Kit Value (INR)"
                  value={cKitValue}
                  onChange={(e) => setCKitValue(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Next Batch Date"
                  value={cBatch}
                  onChange={(e) => setCBatch(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={2}
                  size="small"
                  label="Summary"
                  value={cSummary}
                  onChange={(e) => setCSummary(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  size="small"
                  label="Modules (one per line)"
                  value={cModulesText}
                  onChange={(e) => setCModulesText(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCourseDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={busyAction}>
              Save Course
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Combo Editor Dialog */}
      <Dialog open={comboDialogOpen} onClose={() => setComboDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingComboId ? 'Edit Combo Package' : 'Add Combo Package'}</DialogTitle>
        <Box component="form" onSubmit={handleSaveCombo}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Combo Title"
                  value={cbTitle}
                  onChange={(e) => setCbTitle(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Tagline"
                  value={cbTagline}
                  onChange={(e) => setCbTagline(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  size="small"
                  label="Weeks"
                  value={cbWeeks}
                  onChange={(e) => setCbWeeks(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  size="small"
                  label="Regular Fee"
                  value={cbRegularFee}
                  onChange={(e) => setCbRegularFee(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  size="small"
                  label="Combo Fee"
                  value={cbComboFee}
                  onChange={(e) => setCbComboFee(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  size="small"
                  label="0% EMI Months"
                  value={cbMonths}
                  onChange={(e) => setCbMonths(Number(e.target.value))}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Next Batch Date"
                  value={cbBatch}
                  onChange={(e) => setCbBatch(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={2}
                  size="small"
                  label="Included Courses (one per line)"
                  value={cbCoursesText}
                  onChange={(e) => setCbCoursesText(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  size="small"
                  label="Perks & Kits (one per line)"
                  value={cbPerksText}
                  onChange={(e) => setCbPerksText(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setComboDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={busyAction}>
              Save Combo
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};
