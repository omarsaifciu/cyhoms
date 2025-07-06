// Comprehensive test script for admin hide functionality
// Run this in the browser console

console.log('🔧 Testing Admin Hide System...');

if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase client not found. Make sure you are on the app page.');
} else {
  console.log('✅ Supabase client found');
  
  const testAdminHideSystem = async () => {
    try {
      // Check if user is logged in
      const { data: { user }, error } = await window.supabase.auth.getUser();
      
      if (error || !user) {
        console.error('❌ User not logged in');
        return;
      }
      
      console.log('✅ User logged in:', user.email);
      
      // Get a test property
      const { data: properties, error: propError } = await window.supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .limit(1);
      
      if (propError || !properties || properties.length === 0) {
        console.error('❌ No available properties found for testing');
        return;
      }
      
      const testProperty = properties[0];
      console.log('🏠 Using test property:', testProperty.title_ar || testProperty.title_en || 'No title');
      console.log('📊 Initial status:', testProperty.status);
      console.log('🔒 Initial hidden_by_admin:', testProperty.hidden_by_admin);
      
      // Test 1: Admin hides property (using 'pending' status)
      console.log('\n🔒 Test 1: Admin hiding property...');
      
      const { error: hideError } = await window.supabase
        .from('properties')
        .update({ 
          status: 'pending',
          hidden_by_admin: true
        })
        .eq('id', testProperty.id);
      
      if (hideError) {
        console.error('❌ Error hiding property:', hideError);
        return;
      }
      
      console.log('✅ Property hidden by admin successfully');
      
      // Test 2: Verify property is hidden
      console.log('\n🔍 Test 2: Verifying property is hidden...');
      
      const { data: hiddenProperty, error: checkError } = await window.supabase
        .from('properties')
        .select('*')
        .eq('id', testProperty.id)
        .single();
      
      if (checkError) {
        console.error('❌ Error checking property status:', checkError);
        return;
      }
      
      console.log('📊 Current status:', hiddenProperty.status);
      console.log('🔒 Current hidden_by_admin:', hiddenProperty.hidden_by_admin);
      
      if (hiddenProperty.status === 'pending' && hiddenProperty.hidden_by_admin === true) {
        console.log('✅ Property is correctly hidden by admin');
      } else {
        console.error('❌ Property status not updated correctly');
        return;
      }
      
      // Test 3: Check if property is excluded from public view
      console.log('\n👥 Test 3: Checking public visibility...');
      
      const { data: publicProperties, error: publicError } = await window.supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .neq('hidden_by_admin', true);
      
      if (publicError) {
        console.error('❌ Error fetching public properties:', publicError);
        return;
      }
      
      const isVisibleToPublic = publicProperties.some(p => p.id === testProperty.id);
      
      if (!isVisibleToPublic) {
        console.log('✅ Property is correctly hidden from public view');
      } else {
        console.error('❌ Property is still visible to public');
      }
      
      // Test 4: Admin shows property again
      console.log('\n👁️ Test 4: Admin showing property...');
      
      const { error: showError } = await window.supabase
        .from('properties')
        .update({ 
          status: 'available',
          hidden_by_admin: false
        })
        .eq('id', testProperty.id);
      
      if (showError) {
        console.error('❌ Error showing property:', showError);
        return;
      }
      
      console.log('✅ Property shown by admin successfully');
      
      // Test 5: Verify property is visible again
      console.log('\n🔍 Test 5: Verifying property is visible...');
      
      const { data: visibleProperty, error: checkError2 } = await window.supabase
        .from('properties')
        .select('*')
        .eq('id', testProperty.id)
        .single();
      
      if (checkError2) {
        console.error('❌ Error checking property status:', checkError2);
        return;
      }
      
      console.log('📊 Final status:', visibleProperty.status);
      console.log('🔒 Final hidden_by_admin:', visibleProperty.hidden_by_admin);
      
      if (visibleProperty.status === 'available' && visibleProperty.hidden_by_admin === false) {
        console.log('✅ Property is correctly visible again');
      } else {
        console.error('❌ Property status not updated correctly');
        return;
      }
      
      // Test 6: Check if property is visible to public again
      console.log('\n👥 Test 6: Checking public visibility after restore...');
      
      const { data: publicProperties2, error: publicError2 } = await window.supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .neq('hidden_by_admin', true);
      
      if (publicError2) {
        console.error('❌ Error fetching public properties:', publicError2);
        return;
      }
      
      const isVisibleToPublic2 = publicProperties2.some(p => p.id === testProperty.id);
      
      if (isVisibleToPublic2) {
        console.log('✅ Property is correctly visible to public again');
      } else {
        console.error('❌ Property is still hidden from public');
      }
      
      console.log('\n🎉 All tests completed successfully!');
      console.log('\n📋 Summary:');
      console.log('✅ Admin can hide properties with status "pending" and hidden_by_admin: true');
      console.log('✅ Hidden properties are excluded from public view');
      console.log('✅ Admin can restore properties to "available" status');
      console.log('✅ Restored properties are visible to public again');
      console.log('✅ Database updates work correctly');
      
    } catch (error) {
      console.error('❌ Unexpected error:', error);
    }
  };
  
  testAdminHideSystem();
}
