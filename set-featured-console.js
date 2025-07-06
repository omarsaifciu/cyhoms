// Copy and paste this code into browser console at localhost:8087
// This will set a property as featured

(async function() {
  console.log('🌟 Setting property as featured...');
  
  try {
    // Check if we're on the right page
    if (!window.location.href.includes('localhost:8087')) {
      console.log('❌ Please run this on localhost:8087');
      return;
    }
    
    // Import Supabase from CDN
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
    
    const SUPABASE_URL = "https://cuznupufbtipnqluzgbp.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1em51cHVmYnRpcG5xbHV6Z2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDU3MjgsImV4cCI6MjA2NDE4MTcyOH0.tjQR5IMnFWppS4Ny9qiapxsPpAOiLYkjdPgE309YXng";
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // First, check current featured properties
    console.log('🔍 Checking current featured properties...');
    const { data: currentFeatured, error: checkError } = await supabase
      .from('properties')
      .select('id, title_ar, title_en, title_tr, is_featured, status')
      .eq('is_featured', true);
    
    if (checkError) {
      console.error('❌ Error checking featured properties:', checkError);
      return;
    }
    
    console.log(`📊 Currently featured properties: ${currentFeatured?.length || 0}`);
    if (currentFeatured && currentFeatured.length > 0) {
      currentFeatured.forEach(p => {
        const title = p.title_ar || p.title_en || p.title_tr || 'No title';
        console.log(`  - ${title} (${p.status})`);
      });
    }
    
    // Get available properties that are not featured
    const { data: availableProps, error: availableError } = await supabase
      .from('properties')
      .select('id, title_ar, title_en, title_tr, is_featured, status, city')
      .eq('status', 'available')
      .eq('is_featured', false)
      .limit(1);
    
    if (availableError) {
      console.error('❌ Error fetching available properties:', availableError);
      return;
    }
    
    if (!availableProps || availableProps.length === 0) {
      console.log('❌ No available non-featured properties found');
      return;
    }
    
    const propertyToFeature = availableProps[0];
    const title = propertyToFeature.title_ar || propertyToFeature.title_en || propertyToFeature.title_tr || 'No title';
    
    console.log(`🎯 Setting "${title}" as featured...`);
    
    // Set the property as featured
    const { error: updateError } = await supabase
      .from('properties')
      .update({ is_featured: true })
      .eq('id', propertyToFeature.id);
    
    if (updateError) {
      console.error('❌ Error updating property:', updateError);
      return;
    }
    
    console.log(`✅ Successfully set "${title}" as featured!`);
    console.log('🔄 Refreshing page to see changes...');
    
    // Refresh the page
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
})();
