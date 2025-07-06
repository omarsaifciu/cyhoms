// Copy and paste this entire script into the browser console on localhost:8084

(async function() {
  console.log('🔍 Setting up featured properties...');

  try {
    // Import Supabase client
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');

    // Use the same credentials as the app
    const SUPABASE_URL = "https://cuznupufbtipnqluzgbp.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1em51cHVmYnRpcG5xbHV6Z2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDU3MjgsImV4cCI6MjA2NDE4MTcyOH0.tjQR5IMnFWppS4Ny9qiapxsPpAOiLYkjdPgE309YXng";

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase client created');

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
      console.log('✅ Featured properties already exist! The issue might be in the display logic.');
      console.log('🔄 Try refreshing the page: location.reload()');
      return;
    }

    // Get available properties that are not featured
    const availableNotFeatured = allProperties.filter(p =>
      p.status === 'available' && !p.is_featured
    );

    console.log(`🎯 Available properties not featured: ${availableNotFeatured.length}`);

    if (availableNotFeatured.length === 0) {
      console.log('❌ No available properties found to mark as featured');
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
    console.log('🔄 Refresh command: location.reload()');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    console.log('💡 Make sure you are on the site (localhost:8084) and have internet connection');
  }
})();
