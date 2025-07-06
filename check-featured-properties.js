// Script to check featured properties in the database
import { createClient } from '@supabase/supabase-js';

// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFeaturedProperties() {
  try {
    console.log('🔍 Checking featured properties...');
    
    // Get all properties with their featured status
    const { data: allProperties, error: allError } = await supabase
      .from('properties')
      .select('id, title_ar, title_en, title_tr, is_featured, status, city')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Error fetching all properties:', allError);
      return;
    }

    console.log('📊 Total properties:', allProperties?.length || 0);
    
    // Filter featured properties
    const featuredProperties = allProperties?.filter(p => p.is_featured) || [];
    console.log('⭐ Featured properties:', featuredProperties.length);
    
    // Filter available featured properties
    const availableFeaturedProperties = featuredProperties.filter(p => p.status === 'available');
    console.log('✅ Available featured properties:', availableFeaturedProperties.length);
    
    if (featuredProperties.length > 0) {
      console.log('📋 Featured properties details:');
      featuredProperties.forEach((prop, index) => {
        console.log(`${index + 1}. ${prop.title_ar || prop.title_en || prop.title_tr || 'No title'}`);
        console.log(`   - ID: ${prop.id}`);
        console.log(`   - Featured: ${prop.is_featured}`);
        console.log(`   - Status: ${prop.status}`);
        console.log(`   - City: ${prop.city}`);
        console.log('   ---');
      });
    } else {
      console.log('❌ No featured properties found in database');
    }

    // Check if there are any properties at all
    if (!allProperties || allProperties.length === 0) {
      console.log('❌ No properties found in database at all');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the check
checkFeaturedProperties();
