import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, sanity_token } from '../env'

export const client = createClient({
  projectId,
  dataset,
  token: sanity_token,
  useCdn: false,
  apiVersion
})
