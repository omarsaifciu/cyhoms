// Script to set some properties as featured for testing
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixqjqjqjqjqjqjqjqjqj.supabase.co';
const supabaseKey = 'your-anon-key-here';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setFeaturedProperties() {
  try {
    // Get first 3 available properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, title, title_ar, city')
      .eq('status', 'available')
      .limit(3);

    if (error) {
      console.error('Error fetching properties:', error);
      return;
    }

    if (!properties || properties.length === 0) {
      console.log('No properties found');
      return;
    }

    console.log('Found properties:', properties);

    // Set these properties as featured
    for (const property of properties) {
      const { error: updateError } = await supabase
        .from('properties')
        .update({ is_featured: true })
        .eq('id', property.id);

      if (updateError) {
        console.error(`Error updating property ${property.id}:`, updateError);
      } else {
        console.log(`✅ Set property "${property.title || property.title_ar}" as featured`);
      }
    }

    console.log('✅ Done! Featured properties have been set.');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

setFeaturedProperties();
