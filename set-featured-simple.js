// Simple script to set properties as featured
// Copy and paste this into browser console on localhost:8084

(async function() {
  console.log('🌟 Setting properties as featured...');
  
  try {
    // Import Supabase
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
    
    const SUPABASE_URL = "https://cuznupufbtipnqluzgbp.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1em51cHVmYnRpcG5xbHV6Z2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDU3MjgsImV4cCI6MjA2NDE4MTcyOH0.tjQR5IMnFWppS4Ny9qiapxsPpAOiLYkjdPgE309YXng";
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Get available properties
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, title_ar, title_en, title_tr, is_featured, status')
      .eq('status', 'available')
      .eq('is_featured', false)
      .limit(3);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    if (!properties || properties.length === 0) {
      console.log('❌ No available properties found to mark as featured');
      return;
    }

    console.log(`📋 Found ${properties.length} properties to mark as featured`);

    // Set them as featured
    for (const property of properties) {
      const title = property.title_ar || property.title_en || property.title_tr || 'No title';
      console.log(`⏳ Setting "${title}" as featured...`);
      
      const { error: updateError } = await supabase
        .from('properties')
        .update({ is_featured: true })
        .eq('id', property.id);

      if (updateError) {
        console.error(`❌ Error updating ${property.id}:`, updateError);
      } else {
        console.log(`✅ "${title}" is now featured!`);
      }
    }

    console.log('🎉 Done! Refresh the page to see changes: location.reload()');

  } catch (error) {
    console.error('💥 Error:', error);
  }
})();
