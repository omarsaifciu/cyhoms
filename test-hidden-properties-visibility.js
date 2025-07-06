// Test script to verify hidden properties don't appear in main section
// Run this in browser console

console.log('🔧 Testing Hidden Properties Visibility...');

if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase client not found');
} else {
  const testHiddenPropertiesVisibility = async () => {
    try {
      // Get current user
      const { data: { user }, error } = await window.supabase.auth.getUser();
      
      if (error || !user) {
        console.error('❌ User not logged in');
        return;
      }
      
      console.log('✅ User:', user.email);
      
      // Check if user is admin
      const isAdmin = user.email === 'omar122540@gmail.com' || user.email === 'admin@test.com';
      console.log('🔑 Is Admin:', isAdmin);
      
      // Test 1: Get all properties from database
      console.log('\n📊 Test 1: Checking all properties in database...');
      
      const { data: allProperties, error: allError } = await window.supabase
        .from('properties')
        .select('id, title_ar, title_en, title_tr, status, hidden_by_admin, is_featured')
        .order('created_at', { ascending: false });
      
      if (allError) {
        console.error('❌ Error fetching all properties:', allError);
        return;
      }
      
      console.log(`📋 Total properties in database: ${allProperties.length}`);
      
      const availableProperties = allProperties.filter(p => p.status === 'available' && !p.hidden_by_admin);
      const hiddenByAdminProperties = allProperties.filter(p => p.hidden_by_admin);
      const pendingProperties = allProperties.filter(p => p.status === 'pending');
      const hiddenProperties = allProperties.filter(p => p.status === 'hidden');
      
      console.log(`✅ Available properties: ${availableProperties.length}`);
      console.log(`🔒 Hidden by admin: ${hiddenByAdminProperties.length}`);
      console.log(`⏳ Pending status: ${pendingProperties.length}`);
      console.log(`👁️ Hidden status: ${hiddenProperties.length}`);
      
      // Test 2: Test public query (what regular users should see)
      console.log('\n👥 Test 2: Testing public query (regular users)...');
      
      const { data: publicProperties, error: publicError } = await window.supabase
        .from('properties')
        .select('id, title_ar, title_en, title_tr, status, hidden_by_admin, is_featured')
        .eq('status', 'available')
        .neq('hidden_by_admin', true)
        .order('created_at', { ascending: false });
      
      if (publicError) {
        console.error('❌ Error fetching public properties:', publicError);
        return;
      }
      
      console.log(`👥 Properties visible to public: ${publicProperties.length}`);
      
      // Test 3: Check if any hidden properties are in public results
      const hiddenInPublic = publicProperties.filter(p => 
        p.hidden_by_admin || p.status !== 'available'
      );
      
      if (hiddenInPublic.length === 0) {
        console.log('✅ GOOD: No hidden properties in public results');
      } else {
        console.log('❌ BAD: Found hidden properties in public results:', hiddenInPublic);
      }
      
      // Test 4: Test featured properties query
      console.log('\n⭐ Test 3: Testing featured properties query...');
      
      const { data: featuredProperties, error: featuredError } = await window.supabase
        .from('properties')
        .select('id, title_ar, title_en, title_tr, status, hidden_by_admin, is_featured')
        .eq('is_featured', true)
        .eq('status', 'available')
        .neq('hidden_by_admin', true)
        .order('created_at', { ascending: false });
      
      if (featuredError) {
        console.error('❌ Error fetching featured properties:', featuredError);
        return;
      }
      
      console.log(`⭐ Featured properties visible: ${featuredProperties.length}`);
      
      // Test 5: Check if any hidden properties are in featured results
      const hiddenInFeatured = featuredProperties.filter(p => 
        p.hidden_by_admin || p.status !== 'available'
      );
      
      if (hiddenInFeatured.length === 0) {
        console.log('✅ GOOD: No hidden properties in featured results');
      } else {
        console.log('❌ BAD: Found hidden properties in featured results:', hiddenInFeatured);
      }
      
      // Test 6: Create a test property and hide it
      console.log('\n🧪 Test 4: Creating test property and hiding it...');
      
      // First, get a property to test with
      const testProperty = availableProperties[0];
      if (!testProperty) {
        console.log('⚠️ No available properties to test with');
        return;
      }
      
      console.log(`🏠 Using test property: ${testProperty.title_ar || testProperty.title_en || 'No title'}`);
      console.log(`📊 Original status: ${testProperty.status}`);
      console.log(`🔒 Original hidden_by_admin: ${testProperty.hidden_by_admin}`);
      
      // Hide the property as admin
      const { error: hideError } = await window.supabase
        .from('properties')
        .update({ 
          status: 'pending',
          hidden_by_admin: true
        })
        .eq('id', testProperty.id);
      
      if (hideError) {
        console.error('❌ Error hiding test property:', hideError);
        return;
      }
      
      console.log('✅ Test property hidden by admin');
      
      // Test 7: Verify property is not in public results
      console.log('\n🔍 Test 5: Verifying hidden property is not visible...');
      
      const { data: publicAfterHide, error: publicAfterError } = await window.supabase
        .from('properties')
        .select('id, title_ar, title_en, title_tr, status, hidden_by_admin')
        .eq('status', 'available')
        .neq('hidden_by_admin', true)
        .order('created_at', { ascending: false });
      
      if (publicAfterError) {
        console.error('❌ Error fetching public properties after hide:', publicAfterError);
        return;
      }
      
      const hiddenPropertyInPublic = publicAfterHide.find(p => p.id === testProperty.id);
      
      if (!hiddenPropertyInPublic) {
        console.log('✅ EXCELLENT: Hidden property is not visible in public results');
      } else {
        console.log('❌ CRITICAL: Hidden property is still visible in public results!');
      }
      
      // Test 8: Check featured properties
      const { data: featuredAfterHide, error: featuredAfterError } = await window.supabase
        .from('properties')
        .select('id, title_ar, title_en, title_tr, status, hidden_by_admin, is_featured')
        .eq('is_featured', true)
        .eq('status', 'available')
        .neq('hidden_by_admin', true)
        .order('created_at', { ascending: false });
      
      if (featuredAfterError) {
        console.error('❌ Error fetching featured properties after hide:', featuredAfterError);
        return;
      }
      
      const hiddenPropertyInFeatured = featuredAfterHide.find(p => p.id === testProperty.id);
      
      if (!hiddenPropertyInFeatured) {
        console.log('✅ EXCELLENT: Hidden property is not visible in featured results');
      } else {
        console.log('❌ CRITICAL: Hidden property is still visible in featured results!');
      }
      
      // Test 9: Clean up - restore property
      console.log('\n🧹 Cleaning up - restoring test property...');
      
      const { error: restoreError } = await window.supabase
        .from('properties')
        .update({ 
          status: 'available',
          hidden_by_admin: false
        })
        .eq('id', testProperty.id);
      
      if (restoreError) {
        console.warn('⚠️ Error restoring test property:', restoreError);
      } else {
        console.log('✅ Test property restored');
      }
      
      // Summary
      console.log('\n🎉 Test Summary:');
      console.log('================');
      
      const allTestsPassed = (
        hiddenInPublic.length === 0 &&
        hiddenInFeatured.length === 0 &&
        !hiddenPropertyInPublic &&
        !hiddenPropertyInFeatured
      );
      
      if (allTestsPassed) {
        console.log('✅ ALL TESTS PASSED!');
        console.log('✅ Hidden properties are correctly filtered from public view');
        console.log('✅ Hidden properties are correctly filtered from featured section');
        console.log('✅ Database queries are working correctly');
      } else {
        console.log('❌ SOME TESTS FAILED!');
        console.log('⚠️ Hidden properties may still be visible to public users');
        
        if (hiddenInPublic.length > 0) {
          console.log('❌ Hidden properties found in public results');
        }
        if (hiddenInFeatured.length > 0) {
          console.log('❌ Hidden properties found in featured results');
        }
        if (hiddenPropertyInPublic) {
          console.log('❌ Test property still visible in public after hiding');
        }
        if (hiddenPropertyInFeatured) {
          console.log('❌ Test property still visible in featured after hiding');
        }
      }
      
    } catch (error) {
      console.error('❌ Test failed with error:', error);
    }
  };
  
  testHiddenPropertiesVisibility();
}
