// Check featured properties in database
// Run this in browser console at localhost:8087

console.log('🔍 Checking featured properties...');

// Check if we have access to supabase
if (typeof window !== 'undefined' && window.supabase) {
  console.log('✅ Supabase client found');
  
  window.supabase
    .from('properties')
    .select('id, title_ar, title_en, title_tr, is_featured, status, city')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error('❌ Error fetching properties:', error);
        return;
      }
      
      console.log(`📊 Total properties: ${data?.length || 0}`);
      
      const featured = data?.filter(p => p.is_featured === true) || [];
      const available = data?.filter(p => p.status === 'available') || [];
      const featuredAvailable = data?.filter(p => p.is_featured === true && p.status === 'available') || [];
      
      console.log(`🌟 Featured properties: ${featured.length}`);
      console.log(`✅ Available properties: ${available.length}`);
      console.log(`🎯 Featured + Available: ${featuredAvailable.length}`);
      
      if (featured.length > 0) {
        console.log('Featured properties details:');
        featured.forEach(p => {
          const title = p.title_ar || p.title_en || p.title_tr || 'No title';
          console.log(`  - ${title} (${p.status}) - Featured: ${p.is_featured}`);
        });
      }
      
      if (featuredAvailable.length === 0 && available.length > 0) {
        console.log('🔧 No featured+available properties found. Setting first available property as featured...');
        const firstAvailable = available[0];
        const title = firstAvailable.title_ar || firstAvailable.title_en || firstAvailable.title_tr || 'No title';
        
        window.supabase
          .from('properties')
          .update({ is_featured: true })
          .eq('id', firstAvailable.id)
          .then(({ error: updateError }) => {
            if (updateError) {
              console.error('❌ Error setting featured:', updateError);
            } else {
              console.log(`✅ Set "${title}" as featured! Refresh page to see changes.`);
              console.log('🔄 Run: location.reload()');
            }
          });
      }
    });
} else {
  console.log('❌ Supabase client not found. Make sure you are on the app page.');
}
