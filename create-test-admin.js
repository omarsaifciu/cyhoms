// Script to create a test admin user
// Run this in the browser console on the app page

console.log('🔧 Creating test admin user...');

// Check if supabase client is available
if (typeof window.supabase === 'undefined') {
  console.error('❌ Supabase client not found. Make sure you are on the app page.');
} else {
  console.log('✅ Supabase client found');
  
  // Create test admin user
  const createTestAdmin = async () => {
    try {
      console.log('📝 Creating test admin user...');
      
      // First, try to sign up the user
      const { data: signUpData, error: signUpError } = await window.supabase.auth.signUp({
        email: 'admin@test.com',
        password: 'Admin123!',
        options: {
          data: {
            full_name: 'Test Admin'
          }
        }
      });
      
      if (signUpError && !signUpError.message.includes('already registered')) {
        console.error('❌ Error creating user:', signUpError);
        return;
      }
      
      console.log('✅ User created or already exists');
      
      // Now add to admin_management table
      const { data: adminData, error: adminError } = await window.supabase
        .from('admin_management')
        .insert([{
          admin_email: 'admin@test.com',
          is_active: true
        }]);
      
      if (adminError && adminError.code !== '23505') { // Ignore duplicate key error
        console.error('❌ Error adding to admin_management:', adminError);
        return;
      }
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@test.com');
      console.log('🔑 Password: Admin123!');
      console.log('🎯 You can now login with these credentials');
      
    } catch (error) {
      console.error('❌ Unexpected error:', error);
    }
  };
  
  createTestAdmin();
}
