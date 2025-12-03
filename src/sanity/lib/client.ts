import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, // your Sanity project ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,     // your dataset, e.g. "production"
  apiVersion: '2025-12-01',                              // use today's date or any valid date
  useCdn: true,                                          // `true` for faster, cached responses
});
