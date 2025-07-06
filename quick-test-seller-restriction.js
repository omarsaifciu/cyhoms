// Quick test for seller restriction
// Run this in browser console

console.log('🔧 Quick Test: Seller Restriction for Admin-Hidden Properties');

if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase client not found');
} else {
  const quickTest = async () => {
    try {
      // Get current user
      const { data: { user }, error } = await window.supabase.auth.getUser();
      
      if (error || !user) {
        console.error('❌ User not logged in');
        return;
      }
      
      console.log('✅ User:', user.email);
      
      // Get user's properties (check both created_by and user_id)
      const { data: properties, error: propError } = await window.supabase
        .from('properties')
        .select('*')
        .or(`created_by.eq.${user.id},user_id.eq.${user.id}`)
        .limit(1);
      
      if (propError || !properties || properties.length === 0) {
        console.error('❌ No properties found for this user');
        return;
      }
      
      const testProperty = properties[0];
      console.log('🏠 Test property:', testProperty.title_ar || testProperty.title_en || 'No title');
      console.log('📊 Current status:', testProperty.status);
      console.log('🔒 Current hidden_by_admin:', testProperty.hidden_by_admin);
      
      // Step 1: Hide property as admin
      console.log('\n🔒 Step 1: Hiding property as admin...');
      
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
      
      console.log('✅ Property hidden by admin');
      
      // Step 2: Try to unhide as seller
      console.log('\n👁️ Step 2: Trying to unhide as seller...');
      
      const { error: unhideError } = await window.supabase
        .from('properties')
        .update({ status: 'available' })
        .eq('id', testProperty.id)
        .eq('user_id', user.id);
      
      if (unhideError) {
        console.log('✅ GOOD! Seller cannot unhide admin-hidden property');
        console.log('Error:', unhideError.message);
      } else {
        console.log('❌ BAD! Seller was able to unhide admin-hidden property');
        
        // Check if property was actually updated
        const { data: updatedProperty } = await window.supabase
          .from('properties')
          .select('*')
          .eq('id', testProperty.id)
          .single();
        
        console.log('📊 Updated status:', updatedProperty.status);
        console.log('🔒 Updated hidden_by_admin:', updatedProperty.hidden_by_admin);
      }
      
      // Step 3: Clean up
      console.log('\n🧹 Cleaning up...');
      
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
        console.log('✅ Property restored');
      }
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  };
  
  quickTest();
}
