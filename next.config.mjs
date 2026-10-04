/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sanity project IDs and dataset names are public configuration. Supporting
  // the server-side names keeps deployments working without a public token.
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID:
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET:
      process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET,
  },
};

export default nextConfig;
