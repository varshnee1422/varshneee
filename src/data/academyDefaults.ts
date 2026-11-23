import {
  AcademyFeature,
  ComboPackage,
  Course,
  FaqItem,
  MentorProfile,
} from '../types/academy';

export const HERO_ATELIER_IMAGE = '/src/assets/images/hero_bridal_atelier_1795442437463.jpg';
export const STUDIO_MASTERCLASS_IMAGE = '/src/assets/images/combo_masterclass_studio_1795442437498.jpg';

export const COURSE_IMAGES = {
  makeup: '/src/assets/images/course_hd_airbrush_1795442437864.jpg',
  hair: '/src/assets/images/course_bridal_hair_floral_1795442437667.jpg',
  draping: '/src/assets/images/course_saree_draping_1795442437940.jpg',
  masterclass: '/src/assets/images/combo_masterclass_studio_1795442437498.jpg',
  atelier: '/src/assets/images/hero_bridal_atelier_1795442437463.jpg',
};

export const BATCH_OPTIONS = [
  'Dec 08, 2026 — Morning (10 AM)',
  'Dec 15, 2026 — Afternoon (2 PM)',
  'Jan 05, 2027 — Weekday Intensive',
  'Jan 09, 2027 — Weekend Batch',
];

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'course_hd_airbrush_bridal',
    title: 'Pro HD & Airbrush Bridal Artistry',
    category: 'makeup',
    level: 'Pro Mastery',
    durationWeeks: 8,
    totalHours: 160,
    feeAmount: 68000,
    kitIncluded: true,
    kitValue: 28000,
    certification: 'International Bridal Guild & Aurelia Diploma',
    imageUrl: COURSE_IMAGES.makeup,
    summary:
      'Master skin-true South Asian & contemporary bridal complexion work, waterproof HD layering, and Temptu silicone airbrush techniques.',
    modules: [
      'Skin prep & undertone colorimetry for Indian skin tones',
      'Sweat-resistant HD base & flashback-free setting',
      'Silicone & water-based airbrush machine mastery',
      'Kundan-ready smokey, halo & cut-crease bridal eyes',
      'Muhurtham, Reception & Sangeet look transformations',
      'Live bridal model portfolio shoot (2 edited looks)',
    ],
    nextBatchDate: 'Dec 08, 2026',
    seatsAvailable: 6,
    sortOrder: 1,
  },
  {
    id: 'course_bridal_hair_floral',
    title: 'Sculpted Bridal Hair & Floral Architecture',
    category: 'hair',
    level: 'Pro Mastery',
    durationWeeks: 5,
    totalHours: 90,
    feeAmount: 42000,
    kitIncluded: true,
    kitValue: 14500,
    certification: 'Aurelia Certified Bridal Hair Specialist',
    imageUrl: COURSE_IMAGES.hair,
    summary:
      'Build long-wear bridal buns, South Indian jadai braids, textured reception waves, and fresh jasmine gajra & matha patti anchoring.',
    modules: [
      'Heat styling, crimping & invisible volume padding',
      'Traditional South Indian poola jadai & temple ornament pinning',
      'Russian textured low chignons & messy floral buns',
      'Real & faux hair extension blending & weight balancing',
      'Dupatta & veil pinning over delicate crowns',
    ],
    nextBatchDate: 'Dec 15, 2026',
    seatsAvailable: 8,
    sortOrder: 2,
  },
  {
    id: 'course_saree_couture_draping',
    title: 'Couture Saree & Bridal Veil Draping',
    category: 'draping',
    level: 'Foundation',
    durationWeeks: 3,
    totalHours: 48,
    feeAmount: 24000,
    kitIncluded: true,
    kitValue: 4500,
    certification: 'Aurelia Draping & Styling Certificate',
    imageUrl: COURSE_IMAGES.draping,
    summary:
      'Precision box-folding, micro-pleating, and rapid 12-minute draping across Kanjeevaram, Banarasi, Nauvari, Madisar, and double-dupatta lehengas.',
    modules: [
      'Steam-ironed pre-pleating & compact bridal suitcase folding',
      'Kanjeevaram & Banarasi silk silhouette sculpting',
      'Double-dupatta lehenga & Christian tulle veil anchoring',
      '9-yard Madisar, Nauvari & Bengali Atpoure drapes',
      'Zero-pin-mark safety techniques for heirloom weaves',
    ],
    nextBatchDate: 'Dec 08, 2026',
    seatsAvailable: 10,
    sortOrder: 3,
  },
  {
    id: 'course_editorial_glam_self',
    title: 'Contemporary Soft-Glam & Reception Artistry',
    category: 'makeup',
    level: 'Foundation',
    durationWeeks: 4,
    totalHours: 72,
    feeAmount: 36000,
    kitIncluded: true,
    kitValue: 12000,
    certification: 'Aurelia Foundation Makeup Certificate',
    imageUrl: COURSE_IMAGES.atelier,
    summary:
      'Designed for aspiring artists building clean editorial glass skin, monochrome cocktail looks, and camera-ready lighting adaptation.',
    modules: [
      'Brush hygiene, kit curation & client skin consultation',
      'Luminous glass-skin foundation & cream sculpting',
      'Graphic liner, soft winged shimmer & lash customization',
      'Lighting calibration for indoor & outdoor venues',
    ],
    nextBatchDate: 'Jan 05, 2027',
    seatsAvailable: 9,
    sortOrder: 4,
  },
  {
    id: 'course_bridal_skincare_prep',
    title: 'Pre-Bridal Skin Prep & Glass-Skin Therapy',
    category: 'skincare',
    level: 'Masterclass',
    durationWeeks: 2,
    totalHours: 32,
    feeAmount: 22000,
    kitIncluded: false,
    kitValue: 0,
    certification: 'Aurelia Dermal Prep Credential',
    imageUrl: COURSE_IMAGES.masterclass,
    summary:
      'Bridge esthetician-grade hydration protocols with bridal makeup longevity so textured, dry, or acne-prone skin stays seamless for 14 hours.',
    modules: [
      'Barrier repair & lymphatic sculpting facial massage',
      'Active ingredient compatibility before makeup application',
      'Calming redness, textured pores & under-eye creasing',
      '30-day bride skin-prep consultation blueprints',
    ],
    nextBatchDate: 'Jan 09, 2027',
    seatsAvailable: 12,
    sortOrder: 5,
  },
  {
    id: 'course_luxury_bridal_nails',
    title: 'Bridal Nail Extensions & Jewel Art',
    category: 'nails',
    level: 'Foundation',
    durationWeeks: 3,
    totalHours: 54,
    feeAmount: 28000,
    kitIncluded: true,
    kitValue: 11000,
    certification: 'Aurelia Nail Atelier Certificate',
    imageUrl: COURSE_IMAGES.atelier,
    summary:
      'Create chip-free gel-X, builder-gel overlays, French micro-tips, and 3D pearl & gold-leaf bridal nail sets for high-ticket add-on revenue.',
    modules: [
      'E-file cuticle prep & nail plate safety',
      'Soft-gel extensions, BIAB & sculpted almond shapes',
      'Sheer glazed pearls, chrome & bridal gold-foil art',
      'Press-on custom bridal sizing & removal care',
    ],
    nextBatchDate: 'Jan 05, 2027',
    seatsAvailable: 8,
    sortOrder: 6,
  },
];

export const DEFAULT_COMBOS: ComboPackage[] = [
  {
    id: 'combo_complete_bridal_couture',
    title: 'The Complete Bridal Couture Diploma',
    tagline: 'HD & Airbrush Makeup + Sculpted Hair + Couture Saree Draping + Nail Art',
    includedCourseTitles: [
      'Pro HD & Airbrush Bridal Artistry',
      'Sculpted Bridal Hair & Floral Architecture',
      'Couture Saree & Bridal Veil Draping',
      'Bridal Nail Extensions & Jewel Art',
    ],
    durationWeeks: 14,
    regularFee: 162000,
    comboFee: 118000,
    installmentMonths: 6,
    perks: [
      'Pro Vanity & Airbrush Starter Kit worth ₹45,000 included',
      '3 Full Bridal Portfolio Shoots with Couture Lehengas & Jewelry',
      '1-Month Assisted Real Wedding Shadowing Guarantee',
      'Business Pricing, Client Contracts & Instagram Launch Workshop',
    ],
    isFeatured: true,
    nextBatchDate: 'Dec 08, 2026',
    sortOrder: 1,
  },
  {
    id: 'combo_makeup_hair_duo',
    title: 'Signature Makeup & Hair Pro Duo',
    tagline: 'End-to-end Bridal Makeup, Airbrush & Floral Hairstyling Mastery',
    includedCourseTitles: [
      'Pro HD & Airbrush Bridal Artistry',
      'Sculpted Bridal Hair & Floral Architecture',
    ],
    durationWeeks: 10,
    regularFee: 110000,
    comboFee: 88000,
    installmentMonths: 4,
    perks: [
      'Curated Brush Roll, Hair Tools & Pro Base Palette worth ₹34,000',
      '2 Editorial Bridal Lookbook Shoots with High-Res Retouched Reels',
      'Live Model Practical Assessments Every Friday',
      'Zero-Interest 4-Month Installment Plan',
    ],
    isFeatured: false,
    nextBatchDate: 'Dec 08, 2026',
    sortOrder: 2,
  },
  {
    id: 'combo_south_indian_bridal',
    title: 'South Indian Muhurtham & Draping Intensive',
    tagline: 'Makeup + Temple Hair Jadai + Kanjeevaram & Madisar Precision Draping',
    includedCourseTitles: [
      'Contemporary Soft-Glam & Reception Artistry',
      'Sculpted Bridal Hair & Floral Architecture',
      'Couture Saree & Bridal Veil Draping',
    ],
    durationWeeks: 8,
    regularFee: 102000,
    comboFee: 79500,
    installmentMonths: 3,
    perks: [
      'Complete Hair Pinning, Saree Steam-Pleating & Makeup Starter Kit',
      'Hands-on Kanjeevaram, Poola Jadai & Temple Jewelry Setting Labs',
      '1 Full Traditional South Indian Bridal Shoot Included',
      'Guaranteed Salon & Bridal Team Audition Referrals',
    ],
    isFeatured: false,
    nextBatchDate: 'Dec 15, 2026',
    sortOrder: 3,
  },
];

export const ACADEMY_FEATURES: AcademyFeature[] = [
  {
    index: '01.',
    title: '1:6 Mentor-to-Student Vanity Ratio',
    detail:
      'Every practical session is supervised at dedicated travertine vanity stations with calibrated daylight mirrors so no technique goes uncorrected.',
    metric: 'Max 6 seats per studio batch',
  },
  {
    index: '02.',
    title: 'Live Bridal Model Practicals',
    detail:
      'Practice beyond mannequins on diverse skin undertones, hooded eyes, textured skin, and real Kanjeevaram silk weaves every single week.',
    metric: '18+ guided live model hours',
  },
  {
    index: '03.',
    title: 'International Pro Vanity Kit Included',
    detail:
      'Diploma and Pro students take home curated luxury foundations, Temptu airbrush tools, sable brushes, and precision hair irons ready for paid bookings.',
    metric: 'Up to ₹45,000 kit value',
  },
  {
    index: '04.',
    title: 'Editorial Portfolio & Reel Production',
    detail:
      'Graduate with studio-lit before-and-after portraits and vertical bridal reels styled with real couture lehengas and heirloom jewelry.',
    metric: 'Up to 3 studio shoots',
  },
  {
    index: '05.',
    title: 'Zero-Interest Installment Plans',
    detail:
      'Transparent tuition with zero hidden exam fees, 5% merit discount on single-pay enrollment, and 3-to-6 month flexible EMI options.',
    metric: '0% EMI across combos',
  },
  {
    index: '06.',
    title: 'Assisted Wedding Placement Track',
    detail:
      'Top graduates join our senior bridal artists on real destination and city weddings for hands-on backstage speed and client management.',
    metric: '94% active artist launch rate',
  },
];

export const MENTORS: MentorProfile[] = [
  {
    name: 'Ananya Sundaram',
    role: 'Founder & Lead Bridal Director',
    specialty: 'South Asian HD Complexion & Muhurtham Styling',
    experience: '14 Years · 900+ Brides Styled',
    outcome: 'Mentored 420+ independent studio founders across India, Dubai, and Singapore.',
  },
  {
    name: 'Meera Krishnan',
    role: 'Head of Bridal Hair & Floral Craft',
    specialty: 'Sculpted Chignons, Poola Jadai & Veil Engineering',
    experience: '11 Years · Couture Runway & Bridal',
    outcome: 'Developed the 12-minute weight-balanced floral bun pinning framework taught across all cohorts.',
  },
  {
    name: 'Rhea Deshmukh',
    role: 'Senior Draping & Airbrush Faculty',
    specialty: 'Silicone Airbrush & Heritage Silk Draping',
    experience: '9 Years · Destination Wedding Specialist',
    outcome: 'Led backstage teams for 180+ multi-day palace weddings with zero touch-up failures.',
  },
];

export const FAQS: FaqItem[] = [
  {
    question: 'Do I need prior makeup or salon experience before joining a Combo or Pro course?',
    answer:
      'No prior experience is required. All Pro Mastery and Combo Diploma tracks begin with foundational skin science, color theory, hygiene, and brush control before advancing into airbrush, bridal hair architecture, and live model shoots.',
  },
  {
    question: 'Are international makeup products and tools provided during class?',
    answer:
      'Yes. Our studio vanity bar stocks luxury foundations, concealers, airbrush compressors, and heated hair tools for daily classroom practice, and Pro/Combo enrollments include a personal take-home kit valued between ₹14,500 and ₹45,000.',
  },
  {
    question: 'How does the fee installment (EMI) and seat reservation work?',
    answer:
      'You can lock your batch seat with a 25% booking deposit and split the remaining balance across 3 to 6 monthly zero-interest installments. Single-payment enrollments receive an automatic 5% merit fee reduction.',
  },
  {
    question: 'What happens after I submit an enrollment or consultation request?',
    answer:
      'Your reservation is recorded instantly in your student portal. Our admissions coordinator verifies your chosen batch availability within 24 hours and shares your official fee schedule and studio orientation checklist.',
  },
];

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
