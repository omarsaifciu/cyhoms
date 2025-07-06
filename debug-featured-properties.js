// Complete diagnostic script for featured properties issue
// Run this in browser console on localhost:8084

(async function debugFeaturedProperties() {
  console.log('🔍 COMPREHENSIVE FEATURED PROPERTIES DIAGNOSTIC');
  console.log('================================================');
  
  try {
    // Step 1: Check if we're on the right page
    console.log('📍 Step 1: Page Check');
    console.log('Current URL:', window.location.href);
    console.log('React app loaded:', !!document.querySelector('#root'));
    
    // Step 2: Check database directly
    console.log('\n📊 Step 2: Database Check');
    
    // Import Supabase
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js');
    const SUPABASE_URL = "https://cuznupufbtipnqluzgbp.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1em51cHVmYnRpcG5xbHV6Z2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDU3MjgsImV4cCI6MjA2NDE4MTcyOH0.tjQR5IMnFWppS4Ny9qiapxsPpAOiLYkjdPgE309YXng";
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Fetch properties from database
    const { data: dbProperties, error: dbError } = await supabase
      .from('properties')
      .select('id, title_ar, title_en, title_tr, is_featured, status, city')
      .order('created_at', { ascending: false });
    
    if (dbError) {
      console.error('❌ Database error:', dbError);
    } else {
      console.log(`✅ Database connection successful`);
      console.log(`📋 Total properties in DB: ${dbProperties?.length || 0}`);
      
      const featuredInDB = dbProperties?.filter(p => p.is_featured === true) || [];
      const availableFeatured = dbProperties?.filter(p => p.is_featured === true && p.status === 'available') || [];
      
      console.log(`⭐ Properties with is_featured=true: ${featuredInDB.length}`);
      console.log(`🟢 Available featured properties: ${availableFeatured.length}`);
      
      if (featuredInDB.length > 0) {
        console.log('Featured properties in DB:');
        featuredInDB.forEach((prop, i) => {
          console.log(`  ${i+1}. ${prop.title_ar || prop.title_en || prop.title_tr || 'No title'} (${prop.status})`);
        });
      }
      
      if (featuredInDB.length === 0) {
        console.log('🚨 NO FEATURED PROPERTIES FOUND IN DATABASE!');
        console.log('💡 This is the main issue. Let me set some properties as featured...');
        
        // Set first available property as featured
        const availableProps = dbProperties?.filter(p => p.status === 'available') || [];
        if (availableProps.length > 0) {
          const propToFeature = availableProps[0];
          console.log(`🌟 Setting "${propToFeature.title_ar || propToFeature.title_en || propToFeature.title_tr || 'No title'}" as featured...`);
          
          const { error: updateError } = await supabase
            .from('properties')
            .update({ is_featured: true })
            .eq('id', propToFeature.id);
          
          if (updateError) {
            console.error('❌ Error setting property as featured:', updateError);
          } else {
            console.log('✅ Property set as featured! Refresh the page to see changes.');
            console.log('🔄 Run: location.reload()');
          }
        }
      }
    }
    
    // Step 3: Check console logs for app data
    console.log('\n🔍 Step 3: App State Check');
    console.log('Look for these logs in the console:');
    console.log('- "FeaturedPropertiesSection RENDERED"');
    console.log('- "FeaturedPropertiesSection Debug"');
    console.log('- "Featured Properties Section Debug"');
    console.log('- "Properties with is_featured=true in fetched data"');
    
    // Step 4: Check DOM elements
    console.log('\n🎯 Step 4: DOM Check');
    const featuredSection = document.querySelector('[data-section="featured-properties"]');
    console.log('Featured section in DOM:', !!featuredSection);
    
    if (featuredSection) {
      console.log('✅ Featured section found in DOM');
      console.log('Section visible:', featuredSection.offsetHeight > 0);
      console.log('Section content:', featuredSection.textContent?.substring(0, 100) + '...');
    } else {
      console.log('❌ Featured section NOT found in DOM');
      console.log('💡 This means the section is not being rendered at all');
    }
    
    // Step 5: Check for property cards
    const propertyCards = document.querySelectorAll('[class*="property-card"], [class*="PropertyCard"]');
    console.log(`🏠 Property cards found: ${propertyCards.length}`);
    
    // Step 6: Check for star buttons (featured toggles)
    const starButtons = document.querySelectorAll('button[title*="featured"], button[title*="مميز"], button:has(svg)');
    console.log(`⭐ Star/featured buttons found: ${starButtons.length}`);
    
    // Step 7: Final recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. Check the console logs above for "FeaturedPropertiesSection" messages');
    console.log('2. If no featured properties in DB, run the script again to set some');
    console.log('3. If featured section not in DOM, check the filter conditions');
    console.log('4. Refresh the page after making changes: location.reload()');
    
  } catch (error) {
    console.error('💥 Diagnostic error:', error);
  }
})();
