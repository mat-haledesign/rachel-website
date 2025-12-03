import { defineLocations, PresentationPluginOptions } from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    work: defineLocations({
      select: {
        title: 'workTitle',
        category: 'workCategory',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled Work',
            href: '/',
          }
        ],
      }),
    }),

    behindTheLens: defineLocations({
      select: {
        title: 'title',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Behind The Lens',
            href: '/behind-the-lens',
          }
        ],
      }),
    }),

    director: defineLocations({
      select: {
        name: 'name',
        slug: 'slug.current',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.name || 'Untitled Director',
            href: `/director/${doc?.slug}`,
          },
          { title: 'Directors', href: '/directors' }
        ],
      }),
    }),

    textBlock: defineLocations({
      select: {
        identifier: 'identifier',
        title: 'title',
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Text Block',
            href: '/',
          }
        ],
      }),
    }),
  },
}