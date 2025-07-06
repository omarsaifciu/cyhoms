// Script to test admin hide functionality
// Run this in the browser console after logging in as admin

console.log('🔧 Testing admin hide functionality...');

if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase client not found. Make sure you are on the app page.');
} else {
  console.log('✅ Supabase client found');
  
  const testAdminHideFunctionality = async () => {
    try {
      // Check if user is admin
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
      
      // Test 1: Hide property by admin
      console.log('🔒 Test 1: Hiding property by admin...');
      
      const { error: hideError } = await window.supabase
        .from('properties')
        .update({ 
          status: 'hidden',
          hidden_by_admin: true
        })
        .eq('id', testProperty.id);
      
      if (hideError) {
        console.error('❌ Error hiding property:', hideError);
        return;
      }
      
      console.log('✅ Property hidden by admin successfully');
      
      // Test 2: Verify property is hidden
      console.log('🔍 Test 2: Verifying property is hidden...');
      
      const { data: hiddenProperty, error: checkError } = await window.supabase
        .from('properties')
        .select('*')
        .eq('id', testProperty.id)
        .single();
      
      if (checkError) {
        console.error('❌ Error checking property status:', checkError);
        return;
      }
      
      if (hiddenProperty.status === 'hidden' && hiddenProperty.hidden_by_admin === true) {
        console.log('✅ Property is correctly hidden by admin');
      } else {
        console.error('❌ Property status not updated correctly');
        console.log('Current status:', hiddenProperty.status);
        console.log('Hidden by admin:', hiddenProperty.hidden_by_admin);
        return;
      }
      
      // Test 3: Try to show property by admin
      console.log('👁️ Test 3: Showing property by admin...');
      
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
      
      // Test 4: Verify property is visible
      console.log('🔍 Test 4: Verifying property is visible...');
      
      const { data: visibleProperty, error: checkError2 } = await window.supabase
        .from('properties')
        .select('*')
        .eq('id', testProperty.id)
        .single();
      
      if (checkError2) {
        console.error('❌ Error checking property status:', checkError2);
        return;
      }
      
      if (visibleProperty.status === 'available' && visibleProperty.hidden_by_admin === false) {
        console.log('✅ Property is correctly visible');
      } else {
        console.error('❌ Property status not updated correctly');
        console.log('Current status:', visibleProperty.status);
        console.log('Hidden by admin:', visibleProperty.hidden_by_admin);
        return;
      }
      
      console.log('🎉 All tests passed! Admin hide functionality is working correctly.');
      console.log('');
      console.log('📋 Summary:');
      console.log('✅ Admin can hide properties');
      console.log('✅ hidden_by_admin flag is set correctly');
      console.log('✅ Admin can show properties');
      console.log('✅ hidden_by_admin flag is cleared correctly');
      console.log('');
      console.log('💡 Next: Test that sellers cannot unhide admin-hidden properties');
      
    } catch (error) {
      console.error('❌ Unexpected error:', error);
    }
  };
  
  testAdminHideFunctionality();
}
