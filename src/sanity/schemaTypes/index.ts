import { type SchemaTypeDefinition } from 'sanity'
import overview from './overview';
import corporate from './corporate';
import student from './student';
import nature from './nature';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [overview, corporate, student, nature],
}
