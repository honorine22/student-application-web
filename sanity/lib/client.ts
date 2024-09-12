import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, sanity_token } from '../env'

const isProduction = process.env.NODE_ENV === 'production';

export const client = createClient({
  projectId,
  dataset,
  token: sanity_token,
  useCdn: isProduction, // Set to false if statically generating pages, using ISR or tag-based revalidation
  apiVersion
})
