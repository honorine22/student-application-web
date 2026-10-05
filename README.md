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

## Secret scanning and email configuration

Set `SITE_MAIL_RECIEVER` and `SMTP_SERVER_PASSWORD` in the Netlify dashboard,
not in source files or exported documents. The document update script reads
`SITE_MAIL_RECIEVER` from its environment and stops if it is missing. JSON
exports do not evaluate `process.env`; the checked-in document has no recipient
email, and local document exports are ignored to prevent accidental additions.
Already tracked exports still require review before committing changes.

Netlify secret scanning remains enabled for source files and deployable output.
Only the internal `.netlify/.next/cache/**` build cache is excluded by path.
The key exclusions cover public Sanity configuration and the scanner's own
`SECRETS_SCAN_OMIT_KEYS` setting, which would otherwise match its literal
configuration value. SMTP credentials and the recipient email remain scanned.

Before redeploying, rotate the exposed SMTP password, update it in Netlify,
and clear the deploy build cache. Removing a value from the current files does
not remove it from repository history or previous build caches.
