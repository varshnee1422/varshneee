/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Alert, Box, CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { academyTheme } from './theme/academyTheme';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { CoursesSection } from './components/CoursesSection';
import { CombosSection } from './components/CombosSection';
import { FeesSection } from './components/FeesSection';
import { MentorsAndFaqSection } from './components/MentorsAndFaqSection';
import { Footer, PageStepBar, SubPageHeader } from './components/PageShell';
import {
  EnrollmentDialog,
  EnrollmentInitialSelection,
} from './components/EnrollmentDialog';
import { PortalDrawer } from './components/PortalDrawer';
import { DEFAULT_COMBOS, DEFAULT_COURSES } from './data/academyDefaults';
import { AcademyPage, ComboPackage, Course, Enrollment } from './types/academy';
import {
  OperationType,
  auth,
  db,
  handleFirestoreError,
  isAdminEmail,
} from './firebase';

const VALID_PAGES: AcademyPage[] = ['home', 'features', 'courses', 'combos', 'fees'];

function getPageFromHash(): AcademyPage {
  if (typeof window === 'undefined') return 'home';
  const cleaned = window.location.hash.replace(/^#\/?/, '') as AcademyPage;
  return VALID_PAGES.includes(cleaned) ? cleaned : 'home';
}

function BridalAcademyApp() {
  const [currentPage, setCurrentPage] = useState<AcademyPage>(() => getPageFromHash());
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [combos, setCombos] = useState<ComboPackage[]>(DEFAULT_COMBOS);
  const [dbCoursesCount, setDbCoursesCount] = useState<number | null>(null);
  const [dbCombosCount, setDbCombosCount] = useState<number | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [enrollmentSelection, setEnrollmentSelection] =
    useState<EnrollmentInitialSelection | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // Sync URL hash with multi-page state so browser back/forward works cleanly
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: AcademyPage) => {
    setCurrentPage(page);
    const nextHash = page === 'home' ? '#/' : `#/${page}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  // Track Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Subscribe to public non-PII courses catalog
  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('sortOrder', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setDbCoursesCount(snapshot.size);
        if (!snapshot.empty) {
          const items: Course[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              title: String(d.title || ''),
              category: d.category,
              level: d.level,
              durationWeeks: Number(d.durationWeeks || 4),
              totalHours: Number(d.totalHours || 40),
              feeAmount: Number(d.feeAmount || 0),
              kitIncluded: Boolean(d.kitIncluded),
              kitValue: Number(d.kitValue || 0),
              certification: String(d.certification || ''),
              imageUrl: String(d.imageUrl || ''),
              summary: String(d.summary || ''),
              modules: Array.isArray(d.modules) ? d.modules.map(String) : [],
              nextBatchDate: String(d.nextBatchDate || ''),
              seatsAvailable: Number(d.seatsAvailable || 0),
              sortOrder: Number(d.sortOrder || 0),
              isFromDatabase: true,
            };
          });
          setCourses(items);
        } else {
          setCourses(DEFAULT_COURSES);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'courses');
      },
    );
    return () => unsub();
  }, []);

  // Subscribe to public non-PII combos catalog
  useEffect(() => {
    const q = query(collection(db, 'combos'), orderBy('sortOrder', 'asc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setDbCombosCount(snapshot.size);
        if (!snapshot.empty) {
          const items: ComboPackage[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              id: docSnap.id,
              title: String(d.title || ''),
              tagline: String(d.tagline || ''),
              includedCourseTitles: Array.isArray(d.includedCourseTitles)
                ? d.includedCourseTitles.map(String)
                : [],
              durationWeeks: Number(d.durationWeeks || 8),
              regularFee: Number(d.regularFee || 0),
              comboFee: Number(d.comboFee || 0),
              installmentMonths: Number(d.installmentMonths || 3),
              perks: Array.isArray(d.perks) ? d.perks.map(String) : [],
              isFeatured: Boolean(d.isFeatured),
              nextBatchDate: String(d.nextBatchDate || ''),
              sortOrder: Number(d.sortOrder || 0),
              isFromDatabase: true,
            };
          });
          setCombos(items);
        } else {
          setCombos(DEFAULT_COMBOS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'combos');
      },
    );
    return () => unsub();
  }, []);

  // Auto-seed starter catalog into Firestore once when verified Admin logs in to an empty catalog
  useEffect(() => {
    if (!authReady || !user || !isAdminEmail(user.email, user.emailVerified)) return;
    if (dbCoursesCount !== 0 && dbCombosCount !== 0) return;

    const seedIfEmpty = async () => {
      try {
        if (dbCoursesCount === 0) {
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
        }
        if (dbCombosCount === 0) {
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
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'initial_catalog_seed');
      }
    };

    seedIfEmpty();
  }, [authReady, user, dbCoursesCount, dbCombosCount]);

  // Subscribe to Enrollments ONLY when authenticated & verified (enforcing PII isolation)
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) {
      setEnrollments([]);
      return;
    }

    const adminUser = isAdminEmail(user.email, user.emailVerified);
    const enrollmentsQuery = adminUser
      ? query(collection(db, 'enrollments'), orderBy('createdAt', 'desc'))
      : query(
          collection(db, 'enrollments'),
          where('userId', '==', user.uid),
        );

    const unsub = onSnapshot(
      enrollmentsQuery,
      (snapshot) => {
        const items: Enrollment[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            userId: String(d.userId || ''),
            studentName: String(d.studentName || ''),
            email: String(d.email || ''),
            phone: String(d.phone || ''),
            programType: d.programType,
            programId: String(d.programId || ''),
            programTitle: String(d.programTitle || ''),
            totalFee: Number(d.totalFee || 0),
            paymentPlan: d.paymentPlan,
            preferredBatch: String(d.preferredBatch || ''),
            experienceLevel: d.experienceLevel,
            notes: String(d.notes || ''),
            status: d.status,
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
            updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate() : null,
          };
        });
        items.sort(
          (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0),
        );
        setEnrollments(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'enrollments');
      },
    );

    return () => unsub();
  }, [authReady, user]);

  const openEnrollmentWith = (selection: EnrollmentInitialSelection | null) => {
    setEnrollmentSelection(selection);
    setEnrollmentOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#FAF8F5' }}>
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenEnrollment={() => openEnrollmentWith(null)}
        onOpenPortal={() => setPortalOpen(true)}
        enrollmentCount={enrollments.length}
      />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {currentPage === 'home' && (
          <HeroSection
            onOpenEnrollment={() => openEnrollmentWith(null)}
            onNavigate={navigateTo}
            courseCount={courses.length}
            comboCount={combos.length}
          />
        )}

        {currentPage === 'features' && (
          <>
            <SubPageHeader pageLabel="Features & Mentors" onNavigate={navigateTo} />
            <FeaturesSection />
            <MentorsAndFaqSection
              onOpenConsultation={() =>
                openEnrollmentWith({
                  programType: 'consultation',
                  programId: 'studio_tour',
                  programTitle: 'Free Studio Walkthrough & Kit Preview',
                  totalFee: 0,
                  paymentPlan: 'consultation',
                })
              }
            />
            <PageStepBar
              prevPage={{ page: 'home', label: 'Home Overview' }}
              nextPage={{ page: 'courses', label: 'Specialized Courses' }}
              onNavigate={navigateTo}
            />
          </>
        )}

        {currentPage === 'courses' && (
          <>
            <SubPageHeader pageLabel="Specialized Courses" onNavigate={navigateTo} />
            <CoursesSection
              courses={courses}
              onSelectCourse={(course) =>
                openEnrollmentWith({
                  programType: 'course',
                  programId: course.id,
                  programTitle: course.title,
                  totalFee: course.feeAmount,
                  paymentPlan: 'emi_3',
                })
              }
            />
            <PageStepBar
              prevPage={{ page: 'features', label: 'Studio Features' }}
              nextPage={{ page: 'combos', label: 'Combo Packages' }}
              onNavigate={navigateTo}
            />
          </>
        )}

        {currentPage === 'combos' && (
          <>
            <SubPageHeader pageLabel="Career Combo Packages" onNavigate={navigateTo} />
            <CombosSection
              combos={combos}
              onSelectCombo={(combo) =>
                openEnrollmentWith({
                  programType: 'combo',
                  programId: combo.id,
                  programTitle: combo.title,
                  totalFee: combo.comboFee,
                  paymentPlan: 'emi_3',
                })
              }
            />
            <PageStepBar
              prevPage={{ page: 'courses', label: 'Specialized Courses' }}
              nextPage={{ page: 'fees', label: 'Fees & EMI Estimator' }}
              onNavigate={navigateTo}
            />
          </>
        )}

        {currentPage === 'fees' && (
          <>
            <SubPageHeader pageLabel="Fees & EMI Structure" onNavigate={navigateTo} />
            <FeesSection
              courses={courses}
              combos={combos}
              onEnrollWithPlan={(selection) => openEnrollmentWith(selection)}
            />
            <PageStepBar
              prevPage={{ page: 'combos', label: 'Combo Packages' }}
              nextPage={{ page: 'home', label: 'Back to Home' }}
              onNavigate={navigateTo}
            />
          </>
        )}
      </Box>

      <Footer onNavigate={navigateTo} onOpenPortal={() => setPortalOpen(true)} />

      <EnrollmentDialog
        open={enrollmentOpen}
        onClose={() => setEnrollmentOpen(false)}
        user={user}
        courses={courses}
        combos={combos}
        initialSelection={enrollmentSelection}
        onSuccess={(msg) => setSnackbarMessage(msg)}
      />

      <PortalDrawer
        open={portalOpen}
        onClose={() => setPortalOpen(false)}
        user={user}
        enrollments={enrollments}
        courses={courses}
        combos={combos}
        onNotify={(msg) => setSnackbarMessage(msg)}
      />

      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={5000}
        onClose={() => setSnackbarMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarMessage('')}
          severity="success"
          variant="filled"
          sx={{ bgcolor: '#1C1917', color: '#FAF8F5' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={academyTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <BridalAcademyApp />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
