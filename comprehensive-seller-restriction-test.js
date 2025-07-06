// Comprehensive test for seller restriction on admin-hidden properties
// Run this in browser console

console.log('🔧 Comprehensive Seller Restriction Test');

if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase client not found');
} else {
  const comprehensiveTest = async () => {
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
      
      // Get user's properties (check both created_by and user_id)
      const { data: properties, error: propError } = await window.supabase
        .from('properties')
        .select('*')
        .or(`created_by.eq.${user.id},user_id.eq.${user.id}`)
        .limit(1);
      
      if (propError || !properties || properties.length === 0) {
        console.error('❌ No properties found for this user');
        console.log('💡 Create a property first or login as a property owner');
        return;
      }
      
      const testProperty = properties[0];
      console.log('🏠 Test property:', testProperty.title_ar || testProperty.title_en || 'No title');
      console.log('📊 Initial status:', testProperty.status);
      console.log('🔒 Initial hidden_by_admin:', testProperty.hidden_by_admin);
      console.log('👤 Property created_by:', testProperty.created_by);
      console.log('👤 Property user_id:', testProperty.user_id);
      
      // Test 1: Admin hides the property
      console.log('\n🔒 Test 1: Admin hiding property...');
      
      const { error: adminHideError } = await window.supabase
        .from('properties')
        .update({ 
          status: 'pending',
          hidden_by_admin: true
        })
        .eq('id', testProperty.id);
      
      if (adminHideError) {
        console.error('❌ Error hiding property as admin:', adminHideError);
        return;
      }
      
      console.log('✅ Property hidden by admin');
      
      // Test 2: Verify property is hidden
      const { data: hiddenProperty, error: checkError } = await window.supabase
        .from('properties')
        .select('*')
        .eq('id', testProperty.id)
        .single();
      
      if (checkError) {
        console.error('❌ Error checking property:', checkError);
        return;
      }
      
      console.log('📊 Updated status:', hiddenProperty.status);
      console.log('🔒 Updated hidden_by_admin:', hiddenProperty.hidden_by_admin);
      
      // Test 3: Try to unhide as seller (should fail)
      console.log('\n👁️ Test 3: Seller trying to unhide (should fail)...');
      
      const { error: sellerUnhideError } = await window.supabase
        .from('properties')
        .update({ status: 'available' })
        .eq('id', testProperty.id);
      
      if (sellerUnhideError) {
        console.log('✅ EXCELLENT! Seller cannot unhide admin-hidden property');
        console.log('🛡️ Database protection working:', sellerUnhideError.message);
      } else {
        console.log('❌ BAD! Seller was able to unhide admin-hidden property');
        
        // Check if property was actually updated
        const { data: updatedProperty } = await window.supabase
          .from('properties')
          .select('*')
          .eq('id', testProperty.id)
          .single();
        
        console.log('📊 Status after seller attempt:', updatedProperty.status);
        console.log('🔒 hidden_by_admin after seller attempt:', updatedProperty.hidden_by_admin);
        
        if (updatedProperty.status === 'available') {
          console.log('💥 CRITICAL: Property was reactivated by seller!');
        }
      }
      
      // Test 4: Try to change hidden_by_admin flag (should fail)
      console.log('\n🚫 Test 4: Seller trying to change hidden_by_admin flag (should fail)...');
      
      const { error: flagChangeError } = await window.supabase
        .from('properties')
        .update({ hidden_by_admin: false })
        .eq('id', testProperty.id);
      
      if (flagChangeError) {
        console.log('✅ EXCELLENT! Seller cannot change hidden_by_admin flag');
        console.log('🛡️ Database protection working:', flagChangeError.message);
      } else {
        console.log('❌ BAD! Seller was able to change hidden_by_admin flag');
      }
      
      // Test 5: Check UI logic
      console.log('\n🖥️ Test 5: Testing UI logic...');
      
      const currentProperty = hiddenProperty;
      const isHiddenByAdmin = currentProperty.hidden_by_admin && 
                             (currentProperty.status === 'pending' || currentProperty.status === 'hidden');
      
      if (isHiddenByAdmin) {
        console.log('✅ UI Logic: Property correctly identified as admin-hidden');
        console.log('✅ UI should show disabled button with error message');
      } else {
        console.log('❌ UI Logic: Property not correctly identified as admin-hidden');
      }
      
      // Test 6: Test PropertyActions.tsx logic simulation
      console.log('\n⚙️ Test 6: Simulating PropertyActions.tsx logic...');
      
      const property = currentProperty;
      
      // Simulate the check from PropertyActions.tsx
      if (property.hidden_by_admin && (property.status === 'hidden' || property.status === 'pending')) {
        console.log('✅ PropertyActions Logic: Would show error message');
        console.log('📝 Message: "لا يمكنك إظهار هذا العقار لأنه تم إخفاؤه من قبل الإدارة"');
      } else {
        console.log('❌ PropertyActions Logic: Would allow unhiding (BUG!)');
      }
      
      // Test 7: Clean up (as admin)
      console.log('\n🧹 Test 7: Cleaning up (admin restore)...');
      
      const { error: cleanupError } = await window.supabase
        .from('properties')
        .update({ 
          status: 'available',
          hidden_by_admin: false
        })
        .eq('id', testProperty.id);
      
      if (cleanupError) {
        console.warn('⚠️ Cleanup failed:', cleanupError);
      } else {
        console.log('✅ Property restored by admin');
      }
      
      // Final verification
      const { data: finalProperty } = await window.supabase
        .from('properties')
        .select('*')
        .eq('id', testProperty.id)
        .single();
      
      console.log('📊 Final status:', finalProperty.status);
      console.log('🔒 Final hidden_by_admin:', finalProperty.hidden_by_admin);
      
      // Summary
      console.log('\n🎉 Test Summary:');
      console.log('================');
      
      if (sellerUnhideError && flagChangeError) {
        console.log('✅ ALL TESTS PASSED!');
        console.log('✅ Database protection is working correctly');
        console.log('✅ Sellers cannot bypass admin restrictions');
        console.log('✅ UI logic correctly identifies admin-hidden properties');
      } else {
        console.log('❌ SOME TESTS FAILED!');
        console.log('⚠️ Seller restrictions may not be working properly');
        
        if (!sellerUnhideError) {
          console.log('❌ Seller can unhide admin-hidden properties');
        }
        if (!flagChangeError) {
          console.log('❌ Seller can change hidden_by_admin flag');
        }
      }
      
    } catch (error) {
      console.error('❌ Test failed with error:', error);
    }
  };
  
  comprehensiveTest();
}
