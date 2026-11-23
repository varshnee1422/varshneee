/**
 * Security Rule Verification Spec for Aurelia Bridal Academy
 * Verifies all 12 "Dirty Dozen" adversarial payloads are rejected with PERMISSION_DENIED.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  collection: 'courses' | 'combos' | 'enrollments' | 'admins';
  operation: 'create' | 'get' | 'list' | 'update' | 'delete';
  actor: 'anonymous' | 'student_alice' | 'unverified_admin_spoof' | 'verified_admin';
  expected: 'PERMISSION_DENIED' | 'ALLOW';
}

export const DIRTY_DOZEN_CASES: DirtyDozenCase[] = [
  { id: 1, name: 'Unauthenticated enrollment create', collection: 'enrollments', operation: 'create', actor: 'anonymous', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Identity spoofing userId != auth.uid', collection: 'enrollments', operation: 'create', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Pre-confirmed status injection', collection: 'enrollments', operation: 'create', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Ghost field shadow update on create', collection: 'enrollments', operation: 'create', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Cross-user PII get on Bob enrollment', collection: 'enrollments', operation: 'get', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Unfiltered list query on enrollments', collection: 'enrollments', operation: 'list', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Path variable ID poisoning', collection: 'enrollments', operation: 'create', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Client-forged createdAt timestamp', collection: 'enrollments', operation: 'create', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Student mutating totalFee field', collection: 'enrollments', operation: 'update', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Student resurrecting cancelled enrollment', collection: 'enrollments', operation: 'update', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Unverified admin email spoof', collection: 'courses', operation: 'create', actor: 'unverified_admin_spoof', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Student self-escalation in /admins', collection: 'admins', operation: 'create', actor: 'student_alice', expected: 'PERMISSION_DENIED' },
];
