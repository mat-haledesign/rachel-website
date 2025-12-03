import { draftMode } from 'next/headers'
import { client } from './client'

// Define a type for query parameters
type QueryParams = Record<string, string | number | boolean | null | undefined>

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = ['content']
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}) {
  const isDraftMode = (await draftMode()).isEnabled

  try {
    const result = await client.fetch<QueryResponse>(query, params, {
      cache: isDraftMode ? 'no-store' : 'force-cache',
      next: { 
        tags: [...tags, 'sanity.studio'],
        revalidate: isDraftMode ? 0 : 60 
      }
    })

    // Ensure we're returning the data in the expected format
    return { data: result }
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return { data: null }
  }
}