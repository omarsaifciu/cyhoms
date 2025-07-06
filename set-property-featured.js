// Script to set a specific property as featured
// Run this in browser console on your site

async function setPropertyFeatured() {
  try {
    // Get the Supabase client from window (if available)
    if (!window.supabase) {
      console.error('Supabase client not found. Make sure you are on the site.');
      return;
    }

    const supabase = window.supabase;

    // First, let's see all properties
    console.log('🔍 Fetching all properties...');
    const { data: allProperties, error: fetchError } = await supabase
      .from('properties')
      .select('id, title_ar, title_en, title_tr, is_featured, status, city')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching properties:', fetchError);
      return;
    }

    console.log('📊 Found properties:', allProperties?.length || 0);
    
    if (!allProperties || allProperties.length === 0) {
      console.log('❌ No properties found');
      return;
    }

    // Show first few properties
    console.log('📋 First 5 properties:');
    allProperties.slice(0, 5).forEach((prop, index) => {
      console.log(`${index + 1}. ${prop.title_ar || prop.title_en || prop.title_tr || 'No title'}`);
      console.log(`   - ID: ${prop.id}`);
      console.log(`   - Featured: ${prop.is_featured}`);
      console.log(`   - Status: ${prop.status}`);
      console.log('   ---');
    });

    // Set the first available property as featured
    const availableProperty = allProperties.find(p => p.status === 'available');
    
    if (!availableProperty) {
      console.log('❌ No available properties found');
      return;
    }

    console.log(`🎯 Setting property "${availableProperty.title_ar || availableProperty.title_en || availableProperty.title_tr}" as featured...`);

    const { error: updateError } = await supabase
      .from('properties')
      .update({ is_featured: true })
      .eq('id', availableProperty.id);

    if (updateError) {
      console.error('❌ Error updating property:', updateError);
      return;
    }

    console.log('✅ Property set as featured successfully!');
    console.log('🔄 Refresh the page to see the changes.');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the function
setPropertyFeatured();
