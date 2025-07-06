// Script to set properties as featured - Run this in browser console
// Make sure you're on the site (localhost:8084) when running this

async function setPropertiesAsFeatured() {
  try {
    console.log('🔍 Starting featured properties setup...');
    
    // Check if we have access to the Supabase client
    if (typeof window === 'undefined') {
      console.error('❌ This script must be run in the browser console');
      return;
    }

    // Try to get Supabase from the global scope or import it
    let supabase;
    
    // Method 1: Try to get from window
    if (window.supabase) {
      supabase = window.supabase;
      console.log('✅ Found Supabase client in window');
    } else {
      // Method 2: Try to import it
      try {
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
        // You'll need to replace these with your actual Supabase credentials
        const supabaseUrl = 'YOUR_SUPABASE_URL';
        const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Created Supabase client');
      } catch (importError) {
        console.error('❌ Could not import Supabase:', importError);
        console.log('💡 Please run this script on the site where Supabase is already loaded');
        return;
      }
    }

    // Fetch all properties
    console.log('📊 Fetching all properties...');
    const { data: allProperties, error: fetchError } = await supabase
      .from('properties')
      .select('id, title_ar, title_en, title_tr, is_featured, status, city, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching properties:', fetchError);
      return;
    }

    console.log(`📋 Found ${allProperties?.length || 0} properties`);
    
    if (!allProperties || allProperties.length === 0) {
      console.log('❌ No properties found in database');
      return;
    }

    // Show current featured status
    const currentFeatured = allProperties.filter(p => p.is_featured);
    console.log(`⭐ Currently featured properties: ${currentFeatured.length}`);
    
    if (currentFeatured.length > 0) {
      console.log('📋 Current featured properties:');
      currentFeatured.forEach((prop, index) => {
        console.log(`${index + 1}. ${prop.title_ar || prop.title_en || prop.title_tr || 'No title'} (${prop.status})`);
      });
    }

    // Get available properties that are not featured
    const availableNotFeatured = allProperties.filter(p => 
      p.status === 'available' && !p.is_featured
    );

    console.log(`🎯 Available properties not featured: ${availableNotFeatured.length}`);

    if (availableNotFeatured.length === 0) {
      console.log('✅ All available properties are already featured or no available properties found');
      return;
    }

    // Set first 3 available properties as featured
    const toFeature = availableNotFeatured.slice(0, 3);
    console.log(`🌟 Setting ${toFeature.length} properties as featured...`);

    for (const property of toFeature) {
      console.log(`⏳ Setting "${property.title_ar || property.title_en || property.title_tr || 'No title'}" as featured...`);
      
      const { error: updateError } = await supabase
        .from('properties')
        .update({ is_featured: true })
        .eq('id', property.id);

      if (updateError) {
        console.error(`❌ Error updating property ${property.id}:`, updateError);
      } else {
        console.log(`✅ Successfully set property as featured`);
      }
    }

    console.log('🎉 Done! Please refresh the page to see the changes.');
    console.log('🔄 You can run this command to refresh: location.reload()');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the function
setPropertiesAsFeatured();
