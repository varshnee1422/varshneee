import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { Course, CourseCategory } from '../types/academy';
import { formatINR } from '../data/academyDefaults';

interface CoursesSectionProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

const CATEGORY_TABS: { value: 'all' | CourseCategory; label: string }[] = [
  { value: 'all', label: 'All Programs' },
  { value: 'makeup', label: 'Makeup Artistry' },
  { value: 'hair', label: 'Bridal Hair' },
  { value: 'draping', label: 'Saree & Veil Draping' },
  { value: 'nails', label: 'Nails & Skin Prep' },
];

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onSelectCourse }) => {
  const [selectedTab, setSelectedTab] = useState<'all' | CourseCategory>('all');
  const [syllabusCourse, setSyllabusCourse] = useState<Course | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filteredCourses = courses.filter((course) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'nails') {
      return course.category === 'nails' || course.category === 'skincare';
    }
    return course.category === selectedTab;
  });

  return (
    <Box
      id="courses"
      component="section"
      sx={{
        py: { xs: 8, md: 11 },
        bgcolor: '#FFFFFF',
        borderTop: '1px solid #E7E2DA',
        borderBottom: '1px solid #E7E2DA',
      }}
    >
      <Container maxWidth="lg">
        {/* Header + Interactive Category Tabs */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            justifyContent: 'space-between',
            gap: 3,
            mb: 5,
          }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Typography variant="body2" sx={{ color: '#7A283B', fontWeight: 600, mb: 1 }}>
              Certified Curriculum
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '2rem', md: '2.65rem' }, color: '#1C1917', textWrap: 'balance' }}
            >
              Specialized Bridal Courses
            </Typography>
          </Box>

          <Tabs
            value={selectedTab}
            onChange={(_e, val) => setSelectedTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Course category filter"
            sx={{
              bgcolor: '#F3EFE9',
              borderRadius: 2,
              p: 0.5,
              minHeight: 44,
              '& .MuiTabs-indicator': {
                display: 'none',
              },
              '& .MuiTab-root': {
                borderRadius: 1.5,
                minHeight: 36,
                px: 2,
                color: '#57534E',
                '&.Mui-selected': {
                  bgcolor: '#FFFFFF',
                  color: '#1C1917',
                  border: '1px solid #E7E2DA',
                },
              },
            }}
          >
            {CATEGORY_TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {/* Courses Grid */}
        <Grid container spacing={3}>
          {filteredCourses.map((course) => {
            const hasBrokenImg = brokenImages[course.id];
            return (
              <Grid key={course.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2.5,
                    overflow: 'hidden',
                    transition: 'border-color 180ms ease',
                    '&:hover': {
                      borderColor: '#7A283B',
                    },
                  }}
                >
                  {/* 4:3 Course Photograph with Fallback Container */}
                  <Box sx={{ position: 'relative', aspectRatio: '4 / 3', bgcolor: '#F3EFE9', overflow: 'hidden' }}>
                    {!hasBrokenImg && course.imageUrl ? (
                      <Box
                        component="img"
                        src={course.imageUrl}
                        alt={course.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setBrokenImages((prev) => ({ ...prev, [course.id]: true }))
                        }
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
                          background: 'linear-gradient(135deg, #EFE9DF 0%, #E0D5C5 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 3,
                          textAlign: 'center',
                        }}
                      >
                        <MenuBookOutlinedIcon sx={{ fontSize: 36, color: '#7A283B', mb: 1 }} />
                        <Typography variant="subtitle2" sx={{ color: '#1C1917' }}>
                          {course.title}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 2.5,
                    }}
                  >
                    <Box>
                      {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
                      <Typography
                        variant="caption"
                        className="tabular-nums"
                        sx={{
                          display: 'block',
                          color: '#78716C',
                          fontSize: '0.8rem',
                          mb: 1,
                        }}
                      >
                        {course.level} · {course.durationWeeks} Weeks · {course.totalHours} Hours
                      </Typography>

                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: '1.5rem',
                          color: '#1C1917',
                          mb: 1.25,
                          lineHeight: 1.2,
                        }}
                      >
                        {course.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#57534E', lineHeight: 1.62, mb: 2 }}>
                        {course.summary}
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          gap: 1,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: '#57534E' }}>
                          {course.kitIncluded
                            ? `Kit included (worth ${formatINR(course.kitValue)})`
                            : 'Studio consumables included'}
                        </Typography>
                        <Typography
                          variant="caption"
                          className="tabular-nums"
                          sx={{ color: '#7A283B', fontWeight: 600 }}
                        >
                          {course.seatsAvailable} seats · {course.nextBatchDate}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Footer Pricing & Actions */}
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="caption" sx={{ color: '#78716C', display: 'block' }}>
                            Course Tuition
                          </Typography>
                          <Typography
                            className="tabular-nums"
                            sx={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: '1.25rem',
                              fontWeight: 500,
                              color: '#1C1917',
                            }}
                          >
                            {formatINR(course.feeAmount)}
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          variant="text"
                          onClick={() => setSyllabusCourse(course)}
                          sx={{ color: '#57534E', px: 1.5 }}
                        >
                          View Syllabus ({course.modules.length})
                        </Button>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => onSelectCourse(course)}
                      >
                        Reserve Seat
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Course Syllabus Dialog */}
        <Dialog
          open={Boolean(syllabusCourse)}
          onClose={() => setSyllabusCourse(null)}
          maxWidth="sm"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: 2.5 } } }}
        >
          {syllabusCourse && (
            <>
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
                    {syllabusCourse.level} · {syllabusCourse.durationWeeks} Weeks ({syllabusCourse.totalHours} Hours)
                  </Typography>
                  <Typography variant="h4" sx={{ fontSize: '1.65rem', mt: 0.5 }}>
                    {syllabusCourse.title}
                  </Typography>
                </Box>
                <IconButton aria-label="Close syllabus" onClick={() => setSyllabusCourse(null)}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ borderColor: '#E7E2DA' }}>
                <Typography variant="body2" sx={{ color: '#57534E', mb: 2.5, lineHeight: 1.65 }}>
                  {syllabusCourse.summary}
                </Typography>

                <Typography variant="subtitle2" sx={{ mb: 1, color: '#1C1917' }}>
                  Modules Covered
                </Typography>
                <List dense disablePadding>
                  {syllabusCourse.modules.map((mod) => (
                    <ListItem key={mod} disableGutters sx={{ py: 0.6 }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <CheckIcon sx={{ fontSize: 18, color: '#7A283B' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={mod}
                        slotProps={{ primary: { variant: 'body2', color: '#1C1917' } }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box
                  sx={{
                    mt: 2.5,
                    p: 2,
                    bgcolor: '#FAF8F5',
                    borderRadius: 2,
                    border: '1px solid #E7E2DA',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#78716C', display: 'block' }}>
                    Certification Awarded
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1C1917', mb: 1 }}>
                    {syllabusCourse.certification}
                  </Typography>
                  <Typography variant="caption" className="tabular-nums" sx={{ color: '#57534E' }}>
                    Next Batch: {syllabusCourse.nextBatchDate} · Tuition: {formatINR(syllabusCourse.feeAmount)}
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={() => setSyllabusCourse(null)} sx={{ color: '#57534E' }}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const target = syllabusCourse;
                    setSyllabusCourse(null);
                    onSelectCourse(target);
                  }}
                >
                  Enroll in Course
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};
