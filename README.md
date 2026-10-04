This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# student-application-web

## Deployment configuration

Student applications are stored in Sanity. Configure these environment variables
in Netlify before deploying:

```text
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=your-server-only-write-token
```

`SANITY_API_WRITE_TOKEN` must have permission to create documents and upload
assets in the configured dataset. Keep it server-only: do not use a
`NEXT_PUBLIC_` prefix and do not commit it to the repository.

## Email configuration and secrets scanning

Configure `SMTP_SERVER_HOST`, `SMTP_SERVER_USERNAME`, and
`SMTP_SERVER_PASSWORD` in Netlify with the Functions scope so they are available
to the server at runtime. Keep their values out of source files and never use
the `NEXT_PUBLIC_` prefix for email configuration. If the Netlify plan does not
offer individual scopes, leave them available to all scopes; the build command
removes email configuration from the build subprocess without changing the
site's runtime environment.

The standalone `updateDocument.ts` maintenance script requires
`SITE_MAIL_RECIEVER` in its environment. The spelling matches the existing
Netlify variable. The sample `document.json` uses a non-deliverable placeholder,
not the configured recipient. JSON fixtures do not resolve environment variables.

The Netlify build command clears restored Turbopack caches and excludes email
configuration from the build process. The mail helper reads SMTP credentials
only when sending mail, not when its module is loaded during a build. Secrets
scanning remains enabled; no email keys or cache paths are exempted.

After applying these changes, retry deployment with a cleared build cache.
Rotate any SMTP password that appeared in a repository or build artifact and
update its value in Netlify before redeploying. Removing a value from current
files does not remove it from Git history or previously generated artifacts.
