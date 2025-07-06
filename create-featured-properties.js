// Script to create featured properties for testing
// Run this in the browser console

console.log('🏠 Creating featured properties for testing...');

if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase client not found. Make sure you are on the app page.');
} else {
  console.log('✅ Supabase client found');
  
  const createFeaturedProperties = async () => {
    try {
      console.log('📝 Fetching available properties...');
      
      // Get available properties
      const { data: properties, error } = await window.supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .limit(5);
      
      if (error) {
        console.error('❌ Error fetching properties:', error);
        return;
      }
      
      if (!properties || properties.length === 0) {
        console.log('❌ No available properties found');
        return;
      }
      
      console.log(`✅ Found ${properties.length} available properties`);
      
      // Set first 3 properties as featured
      const toFeature = properties.slice(0, 3);
      console.log(`🌟 Setting ${toFeature.length} properties as featured...`);
      
      for (const property of toFeature) {
        console.log(`⏳ Setting "${property.title_ar || property.title_en || property.title_tr || 'No title'}" as featured...`);
        
        const { error: updateError } = await window.supabase
          .from('properties')
          .update({ is_featured: true })
          .eq('id', property.id);
        
        if (updateError) {
          console.error(`❌ Error updating property ${property.id}:`, updateError);
        } else {
          console.log(`✅ Successfully set property as featured`);
        }
      }
      
      console.log('🎉 Done! Featured properties created.');
      console.log('🔄 Refresh the page to see the changes.');
      console.log('💡 You can run: location.reload()');
      
    } catch (error) {
      console.error('❌ Unexpected error:', error);
    }
  };
  
  createFeaturedProperties();
}
