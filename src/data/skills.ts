export interface Skill {
  title: string;
  body: string;
}

export const SKILLS: readonly Skill[] = [
  {
    title: 'Web',
    body: 'Next.js, TypeScript, Tailwind CSS, shadcn/ui, full-stack approval workflows, auth with Better Auth, Clerk and OAuth2, Discord bot integrations, Stripe payments.',
  },
  {
    title: 'Data',
    body: 'PostgreSQL, SQL Server (schema mapping, manual investigation, logins and restores), advanced Excel with PivotTables and data modeling.',
  },
  {
    title: 'Infra & Cloud',
    body: 'Linux administration, Docker, Coolify, Cloudflare, Caddy, Open edX via Tutor, AWS (EC2, S3, Lambda, DCV), VPS migrations (Kamatera), systemd services, GUI automation with xdotool.',
  },
  {
    title: 'Network & Security',
    body: 'VLAN tagging (802.1Q), trunking, multi-WAN load balancing and failover, firewall configuration, cybersecurity fundamentals.',
  },
  {
    title: 'Endpoint & Hardware',
    body: 'Windows 10/11 deployment and troubleshooting, custom PC builds, Dell laptop diagnostics, SOLIDWORKS and Crystal Reports XI support.',
  },
];
