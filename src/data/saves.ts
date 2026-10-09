/** One row in the data panel's <dl>. With `href`, the value renders as an external link. */
export interface MetaRow {
  label: string;
  value: string;
  href?: string;
}

/** A titled bullet list in the data panel. */
export interface Group {
  title: string;
  items: readonly string[];
}

export interface Save {
  /** Used for the slot's DOM id (`slot-<id>`). */
  id: string;
  /** Slot label under the cube. */
  name: string;
  /** Letters on the cube's front and back faces. */
  glyph: string;
  /** Cube front/back/top/bottom colour. */
  c1: string;
  /** Cube side colour, glyph glow, and the background's cap accent while selected. */
  c2: string;
  /** Small line under the slot name. */
  size: string;
  title: string;
  meta: readonly MetaRow[];
  /** Summary paragraph; an empty string shows the "SAVE DATA NOT YET WRITTEN" placeholder. */
  sum: string;
  groups: readonly Group[];
  /** Optional link buttons under the groups. */
  links?: readonly { label: string; href: string }[];
  stack: readonly string[];
}

const PRECISE_ORG: MetaRow = {
  label: 'ORG',
  value: 'Precise Electric Manufacturing Co., Ltd.',
  href: 'http://preciseproducts.industry.in.th',
};

export const SAVES: readonly Save[] = [
  {
    id: 'tpa',
    name: 'THE POKER ADDICT',
    glyph: 'PA',
    c1: '#3a2f9a',
    c2: '#8a7dff',
    size: 'OWN PRODUCT',
    title: 'The Poker Addict',
    meta: [
      { label: 'ROLE', value: 'Founder · Full-stack + Infra' },
      { label: 'SITE', value: 'thepokeraddict.com', href: 'https://thepokeraddict.com' },
      { label: 'STATUS', value: 'Coming-soon page live' },
    ],
    sum: 'A Duolingo-style platform for learning poker strategy: short lessons, video content and paid access, built and hosted end to end.',
    groups: [
      {
        title: 'Product',
        items: [
          'Lesson-based poker strategy curriculum with streamed video',
          'Accounts via Better Auth with Google sign-in',
          'Payments through Stripe',
        ],
      },
      {
        title: 'Infrastructure',
        items: [
          'Self-hosted on a VPS, managed with Coolify',
          'PostgreSQL provisioned through Coolify, Cloudflare in front',
          'Bunny Stream with token authentication for protected video',
          'Diagnosed a Docker/ufw bypass (docker-proxy DNAT) and hardened the admin panel',
        ],
      },
    ],
    stack: [
      'Next.js',
      'TypeScript',
      'Tailwind',
      'shadcn/ui',
      'PostgreSQL',
      'Better Auth',
      'Stripe',
      'Bunny Stream',
      'Coolify',
      'Cloudflare',
    ],
  },
  {
    id: 'deeprun',
    name: 'DEEPRUN',
    glyph: 'DR',
    c1: '#7a0d12',
    c2: '#ff3b3b',
    size: 'MAR–AUG 2026',
    title: 'DeepRun Academy · Developer (Full-stack, Infra & QA)',
    meta: [
      { label: 'ORG', value: 'DeepRun Academy, online poker academy' },
      { label: 'PERIOD', value: 'Mar – Aug 2026' },
    ],
    sum: 'Worked across the whole stack of a poker e-learning platform built on Next.js and Open edX: shipping features, debugging production problems, planning infrastructure, and automating a large solver batch on AWS.',
    groups: [
      {
        title: 'Features shipped',
        items: [
          'Discord membership verification: members link Discord from their profile through OAuth2 and a bot grants the Verified role, with one-to-one account binding, single-use CSRF state and strings in 6 languages (merged, +1,046 lines across 20 files)',
          'Fixed OAuth redirects that resolved to the internal bind address behind the reverse proxy by deriving the public origin from forwarded headers',
        ],
      },
      {
        title: 'Infrastructure',
        items: [
          'Served the frontend on a second domain for dev and UAT via the Tutor/Caddy config and Cloudflare DNS, and resolved the resulting TLS 525 by issuing certificates through HTTP-01 before re-enabling the proxy',
          'Wrote the production migration plan from Google Cloud to AWS Singapore: EC2, EBS, Route 53, S3, pre-synced media, a 45–60 minute cutover and a 5-minute DNS rollback',
          'Researched moving every service to organization-owned accounts to remove the single-person dependency, and built an AWS Lambda POC (API-triggered, writes to S3)',
        ],
      },
      {
        title: 'Root-cause analysis',
        items: [
          'Traced iPhone video stalls on lessons of 5+ minutes to 1.14 GB untranscoded masters served straight from S3 without a CDN, after ruling out range requests, status codes, URL expiry and content type',
          'Recommended transcoding the library (about 90% smaller files) and moving to HLS behind CloudFront, which also cuts egress cost',
        ],
      },
      {
        title: 'Solver automation (HRC)',
        items: [
          "Built a JavaScript hand-config generator for poker Nash equilibrium solves, with ICM and chip-EV modes and stack distributions tuned with the vendor's support team",
          "Automated a GUI-only solver unattended: AutoHotkey prototype, then xdotool on Linux, waiting on the app's own progress window instead of fixed delays",
          "Ran ~4,000 hands on 10 AWS c6a.8xlarge instances with remote desktops (Amazon DCV), diagnosed an out-of-memory failure from accumulated tabs, and added a systemd watchdog that reports each box's state to Discord",
        ],
      },
      {
        title: 'QA & security',
        items: [
          'Filed reproducible bug reports for the Open edX platform and frontend: device-specific CSRF failures, Studio errors, video ID reuse across courses, Stripe portal status and mobile language selector issues',
          'Took part in remediation follow-up on findings from an external penetration test',
        ],
      },
    ],
    stack: [
      'Next.js',
      'TypeScript',
      'Open edX',
      'Tutor',
      'Caddy',
      'Cloudflare',
      'AWS EC2',
      'S3',
      'Lambda',
      'Discord API',
      'OAuth2',
      'Stripe',
      'xdotool',
      'systemd',
    ],
  },
  {
    id: 'zsop',
    name: 'ZSOP',
    glyph: 'Z',
    c1: '#14306e',
    c2: '#5aa8ff',
    size: 'CURRENT',
    title: 'Zodiac Affairs (ZSOP) · Infrastructure & Deployment',
    meta: [
      { label: 'ROLE', value: 'Infrastructure, deployment, dev coordination' },
      { label: 'DOMAIN', value: 'Live poker tournament systems' },
    ],
    sum: 'Building and running the systems behind live poker tournaments: the PKO table display players see at the venue, and the infrastructure and data underneath it.',
    groups: [
      {
        title: 'PKO system · table display',
        items: [
          'Built Poker Live, a touchscreen tournament display for PKO (progressive knockout) events: tournament select, table select and a live table view with seats, stacks and bounties',
          'Ported a static HTML prototype into a real Vite + Preact + TypeScript app on a fixed 1920×1080 stage scaled to any screen',
          'One API interface with swappable adapters: the HTTP client, an in-app mock, and a zero-dependency stand-in server that speaks the real tournament API contract and simulates a live event',
          'Resilient polling that keeps the last good data and shows a reconnecting state on failure, plus a table grid that scales to 50-table fields',
          'Kiosk hardening: touch-only feedback, 44px+ tap targets, double-tap guards, wake lock, fullscreen, no zoom or overscroll; unit tests for seat geometry, formatting and polling',
        ],
      },
      {
        title: 'Migration',
        items: [
          'Moved the tournament system from AWS to a Kamatera Singapore VPS on a deadline set by a live event in Taipei',
          'Resolved post-migration SQL login orphans and firewall configuration',
        ],
      },
      {
        title: 'Debugging',
        items: [
          'Traced a knockout bounty bug where an elimination was credited to the wrong player, by mapping the SQL Server schema and querying hand history directly',
        ],
      },
    ],
    stack: ['Preact', 'TypeScript', 'Vite', 'Vitest', 'SQL Server', 'AWS', 'Kamatera', 'Linux'],
  },
  {
    id: 'pem-it',
    name: 'PRECISE · IT',
    glyph: 'IT',
    c1: '#1d4a3a',
    c2: '#4fe0a8',
    size: 'IT / SYSADMIN',
    title: 'Precise Electric Manufacturing · IT Specialist / System Administrator',
    meta: [PRECISE_ORG, { label: 'ROLE', value: 'IT Specialist / System Administrator' }],
    sum: 'Ran the day-to-day IT for a manufacturing company, from servers and network down to engineering workstations.',
    groups: [
      {
        title: 'Infrastructure & hardware',
        items: [
          'Server maintenance',
          'Custom PC architecture',
          'Dell laptop hardware diagnostics',
          'Peripheral optimization',
        ],
      },
      {
        title: 'Operating systems & software',
        items: [
          'Windows 10/11 deployment and troubleshooting',
          'Linux system administration',
          'Enterprise software support: SOLIDWORKS, Crystal Reports XI',
        ],
      },
      {
        title: 'Network & security',
        items: [
          'Network troubleshooting and firewall basics',
          'VLAN tagging (802.1Q) and trunking',
          'Multi-WAN load balancing and failover',
        ],
      },
      {
        title: 'Data analysis',
        items: [
          'Advanced Excel with PivotTables and data modeling for system reporting and asset management',
        ],
      },
    ],
    stack: [
      'Windows',
      'Linux',
      '802.1Q VLAN',
      'Multi-WAN',
      'SOLIDWORKS',
      'Crystal Reports XI',
      'Excel',
    ],
  },
  {
    id: 'pem-dev',
    name: 'PRECISE · DEV',
    glyph: 'AR',
    c1: '#5a2a4a',
    c2: '#ff7ab8',
    size: 'INTERNSHIP',
    title: 'Precise Electric Manufacturing · Full-stack Developer Intern',
    meta: [PRECISE_ORG, { label: 'ROLE', value: 'Full-stack Developer Intern' }],
    sum: 'Built a full-stack enterprise application for Accounts Receivable Credit Note Requests.',
    groups: [
      {
        title: 'What it does',
        items: [
          'Routes each credit note request through a multi-step approval workflow',
          'Improves financial efficiency by replacing manual hand-offs',
          'Supports compliance with a clear approval trail',
        ],
      },
    ],
    stack: ['Full-stack', 'Approval workflow', 'Finance / AR'],
  },
];
