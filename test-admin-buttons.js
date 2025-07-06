// Script to test admin buttons functionality
// Run this in the browser console after logging in as admin

console.log('🔧 Testing admin buttons functionality...');

// Check if user is logged in and is admin
const checkAdminStatus = async () => {
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase client not found');
    return false;
  }
  
  try {
    const { data: { user }, error } = await window.supabase.auth.getUser();
    
    if (error || !user) {
      console.error('❌ User not logged in');
      return false;
    }
    
    console.log('✅ User logged in:', user.email);
    
    // Check if user is admin
    if (user.email === 'omar122540@gmail.com' || user.email === 'admin@test.com') {
      console.log('✅ User is admin');
      return true;
    }
    
    // Check admin_management table
    const { data, error: adminError } = await window.supabase
      .from('admin_management')
      .select('*')
      .eq('admin_email', user.email)
      .eq('is_active', true)
      .single();
    
    if (adminError && adminError.code !== 'PGRST116') {
      console.error('❌ Error checking admin status:', adminError);
      return false;
    }
    
    if (data) {
      console.log('✅ User is admin (from admin_management table)');
      return true;
    }
    
    console.log('❌ User is not admin');
    return false;
    
  } catch (error) {
    console.error('❌ Error checking admin status:', error);
    return false;
  }
};

// Test admin buttons visibility
const testAdminButtons = () => {
  console.log('🔍 Checking for admin buttons...');
  
  // Look for admin action buttons
  const adminButtons = document.querySelectorAll('[class*="AdminPropertyActions"]');
  console.log(`Found ${adminButtons.length} admin action containers`);
  
  // Look for hide/show buttons
  const hideButtons = document.querySelectorAll('button[title*="Hide"], button[title*="Show"], button[title*="إخفاء"], button[title*="إظهار"]');
  console.log(`Found ${hideButtons.length} hide/show buttons`);
  
  // Look for delete buttons
  const deleteButtons = document.querySelectorAll('button[title*="Delete"], button[title*="حذف"]');
  console.log(`Found ${deleteButtons.length} delete buttons`);
  
  // Check if buttons are visible
  const visibleButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
    const style = window.getComputedStyle(btn);
    return style.opacity !== '0' && style.display !== 'none' && style.visibility !== 'hidden';
  });
  
  console.log(`Found ${visibleButtons.length} visible buttons total`);
  
  // Look for featured properties section
  const featuredSection = document.querySelector('[data-section="featured-properties"]');
  if (featuredSection) {
    console.log('✅ Featured properties section found');
    
    // Look for property cards in featured section
    const propertyCards = featuredSection.querySelectorAll('[class*="PropertyCard"], .group');
    console.log(`Found ${propertyCards.length} property cards in featured section`);
    
    // Check each card for admin buttons
    propertyCards.forEach((card, index) => {
      const adminActionsInCard = card.querySelectorAll('button[title*="Hide"], button[title*="Show"], button[title*="Delete"], button[title*="إخفاء"], button[title*="إظهار"], button[title*="حذف"]');
      console.log(`Card ${index + 1}: Found ${adminActionsInCard.length} admin buttons`);
    });
  } else {
    console.log('❌ Featured properties section not found');
  }
};

// Run the tests
const runTests = async () => {
  console.log('🚀 Starting admin buttons test...');
  
  const isAdmin = await checkAdminStatus();
  
  if (!isAdmin) {
    console.log('⚠️ Please login as admin first');
    console.log('💡 You can use: admin@test.com / Admin123!');
    return;
  }
  
  // Wait a bit for the page to load
  setTimeout(() => {
    testAdminButtons();
    console.log('✅ Test completed');
  }, 2000);
};

runTests();
