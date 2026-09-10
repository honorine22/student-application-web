import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, sanity_token } from '../env'

const isProduction = process.env.NODE_ENV === 'production';

export const client = createClient({
  projectId,
  dataset,
  token: sanity_token,
  useCdn: false,
  apiVersion
})
