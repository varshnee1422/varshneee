# Firestore Security Specification — Aurelia Bridal Academy

## 1. Data Invariants
1. **Catalog Integrity**: Only verified Academy Admins (`varshnee1422@gmail.com` or UID in `/admins/{uid}`) may create, update, or delete `/courses/{courseId}` and `/combos/{comboId}` documents.
2. **Enrollment Ownership**: Every `/enrollments/{enrollmentId}` document must have `userId == request.auth.uid` on creation, and `userId` and `createdAt` are immutable thereafter.
3. **Status State Machine**: Students can only create enrollments with `status == 'pending'`. Students may only transition their own `pending` enrollment to `cancelled` (`affectedKeys().hasOnly(['status', 'updatedAt'])`). Terminal states (`completed`, `cancelled`) cannot be modified by students; only verified Admins may transition enrollments to `confirmed`, `completed`, or correct states.
4. **PII Isolation**: Enrollment documents contain `email`, `phone`, and `studentName`. Unauthenticated reads or cross-user reads/lists on `/enrollments` are strictly denied.
5. **Admin Allowlist Protection**: Users cannot self-assign admin privileges by writing to `/admins/{uid}`.

## 2. The "Dirty Dozen" Attack Payloads (All Must Return `PERMISSION_DENIED`)
1. **Unauthenticated Enrollment Write**: Anonymous request creates `/enrollments/e1` -> Denied (`isVerifiedUser()` fails).
2. **Identity Spoofing**: Signed-in user `alice` submits enrollment with `userId: "bob"` -> Denied (`incoming().userId == request.auth.uid` fails).
3. **Pre-Confirmed Status Injection**: Signed-in user `alice` creates enrollment with `status: "confirmed"` -> Denied (`incoming().status == 'pending'` fails).
4. **Ghost Field / Shadow Update**: Signed-in user `alice` adds `{ discountOverride: 99999 }` to enrollment create -> Denied (`data.keys().hasOnly(...)` fails).
5. **Cross-User PII Read**: Signed-in user `alice` attempts `get` on `bob`'s enrollment -> Denied (`existing().userId == request.auth.uid` fails).
6. **Blanket List Scraping**: Signed-in user `alice` queries `/enrollments` without `where('userId', '==', alice.uid)` -> Denied (`allow list` requires `resource.data.userId == request.auth.uid || isAdmin()`).
7. **ID Poisoning**: Signed-in user `alice` creates `/enrollments/invalid$id/../admin` or >128-char ID -> Denied (`isValidId(enrollmentId)` fails).
8. **Timestamp Forgery**: User submits `createdAt: Timestamp(2020-01-01)` -> Denied (`incoming().createdAt == request.time` fails).
9. **Immutable Owner Tampering**: Student updates `userId` or `totalFee` on existing pending enrollment -> Denied (`affectedKeys().hasOnly(['status', 'updatedAt'])` fails).
10. **Terminal State Bypass**: Student updates a `cancelled` or `completed` enrollment back to `pending` -> Denied (`existing().status == 'pending' && incoming().status == 'cancelled'` fails).
11. **Unverified Admin Email Spoof**: User token has `email: "varshnee1422@gmail.com"` with `email_verified: false` -> Denied (`request.auth.token.email_verified == true` fails).
12. **Catalog Tampering & Self-Admin Escalation**: Non-admin user attempts to create `/courses/c1` or `/admins/alice` -> Denied (`isAdmin()` fails).
