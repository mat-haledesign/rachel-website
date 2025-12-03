import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'overview',
  title: 'Overview',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // Allows cropping/focal point
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hasVideo',
      title: 'Video',
      type: 'boolean',
      description: 'Enable this to add a video',
    }),
    defineField({
      name: 'video',
      title: 'Video Upload',
      type: 'file',
      hidden: ({parent}) => !parent?.hasVideo, // Only show if hasVideo is true
      options: {
        accept: 'video/*', // Accept only video files
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})
