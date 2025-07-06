// Test script to verify Arabic RTL spacing for search buttons
// Run this in browser console

console.log('🔧 Testing Arabic RTL Spacing for Search Buttons...');

const testArabicRTLSpacing = () => {
  try {
    // Test 1: Check current language
    console.log('\n📊 Test 1: Checking current language...');
    
    const htmlElement = document.documentElement;
    const currentDir = htmlElement.getAttribute('dir');
    const currentLang = htmlElement.getAttribute('lang');
    
    console.log('🌐 Current direction:', currentDir);
    console.log('🌐 Current language:', currentLang);
    
    if (currentLang === 'ar' && currentDir === 'rtl') {
      console.log('✅ Arabic RTL mode is active');
    } else {
      console.log('⚠️ Not in Arabic RTL mode');
      console.log('💡 Switch to Arabic language to test RTL spacing');
    }
    
    // Test 2: Check mobile search button spacing
    console.log('\n📱 Test 2: Checking mobile search button spacing...');
    
    // Look for mobile search button
    const mobileSearchButtons = document.querySelectorAll('button[type="submit"]');
    let mobileSearchButton = null;
    
    mobileSearchButtons.forEach(button => {
      const svg = button.querySelector('svg');
      if (svg && button.closest('form')) {
        const form = button.closest('form');
        const input = form.querySelector('input[type="text"]');
        if (input && (input.placeholder.includes('Search') || input.placeholder.includes('ابحث') || input.placeholder.includes('Ara'))) {
          mobileSearchButton = button;
        }
      }
    });
    
    if (mobileSearchButton) {
      console.log('✅ Found mobile search button');
      
      const computedStyle = getComputedStyle(mobileSearchButton);
      const marginLeft = computedStyle.marginLeft;
      const marginRight = computedStyle.marginRight;
      const marginInlineEnd = computedStyle.marginInlineEnd;
      const marginInlineStart = computedStyle.marginInlineStart;
      
      console.log('📏 Button margins:');
      console.log('   margin-left:', marginLeft);
      console.log('   margin-right:', marginRight);
      console.log('   margin-inline-end:', marginInlineEnd);
      console.log('   margin-inline-start:', marginInlineStart);
      
      // Check if button uses logical properties (me-2 should translate to margin-inline-end)
      if (marginInlineEnd && marginInlineEnd !== '0px') {
        console.log('✅ EXCELLENT: Button uses logical margin (me-2)');
        console.log('✅ This will work correctly in both LTR and RTL');
      } else if (marginLeft && marginLeft !== '0px' && currentDir === 'ltr') {
        console.log('⚠️ Button uses physical margin-left (ml-2)');
        console.log('⚠️ This may cause spacing issues in RTL');
      } else if (marginRight && marginRight !== '0px' && currentDir === 'rtl') {
        console.log('⚠️ Button uses physical margin-right');
        console.log('⚠️ This may cause spacing issues in LTR');
      }
      
      // Check button position relative to container
      const buttonRect = mobileSearchButton.getBoundingClientRect();
      const containerRect = mobileSearchButton.closest('form').getBoundingClientRect();
      
      const distanceFromEnd = currentDir === 'rtl' 
        ? buttonRect.left - containerRect.left
        : containerRect.right - buttonRect.right;
      
      console.log('📐 Distance from container end:', distanceFromEnd + 'px');
      
      if (distanceFromEnd < 20) {
        console.log('✅ GOOD: Button is close to container edge');
      } else {
        console.log('❌ BAD: Button is too far from container edge');
        console.log('💡 Expected: Button should be close to the edge in all languages');
      }
      
    } else {
      console.log('⚠️ Mobile search button not found');
    }
    
    // Test 3: Check search icon spacing inside buttons
    console.log('\n🔍 Test 3: Checking search icon spacing inside buttons...');
    
    const searchButtons = document.querySelectorAll('button');
    let buttonsWithSearchIcon = [];
    
    searchButtons.forEach(button => {
      const searchIcon = button.querySelector('svg');
      const text = button.textContent || button.innerText;
      if (searchIcon && (text.includes('بحث') || text.includes('Search') || text.includes('Ara'))) {
        buttonsWithSearchIcon.push(button);
      }
    });
    
    console.log(`🔍 Found ${buttonsWithSearchIcon.length} buttons with search icons`);
    
    buttonsWithSearchIcon.forEach((button, index) => {
      const searchIcon = button.querySelector('svg');
      if (searchIcon) {
        const iconStyle = getComputedStyle(searchIcon);
        const marginLeft = iconStyle.marginLeft;
        const marginRight = iconStyle.marginRight;
        const marginInlineEnd = iconStyle.marginInlineEnd;
        const marginInlineStart = iconStyle.marginInlineStart;
        
        console.log(`\n🔍 Button ${index + 1} icon margins:`);
        console.log('   margin-left:', marginLeft);
        console.log('   margin-right:', marginRight);
        console.log('   margin-inline-end:', marginInlineEnd);
        console.log('   margin-inline-start:', marginInlineStart);
        
        if (marginInlineEnd && marginInlineEnd !== '0px') {
          console.log('✅ Icon uses logical margin (me-2)');
        } else if (marginRight && marginRight !== '0px') {
          console.log('⚠️ Icon uses physical margin-right (mr-2)');
          console.log('⚠️ This may cause spacing issues in RTL');
        }
      }
    });
    
    // Test 4: Visual comparison guide
    console.log('\n👀 Test 4: Visual comparison guide...');
    console.log('📋 To test RTL spacing:');
    console.log('1. Switch to Arabic language');
    console.log('2. Check mobile search button position');
    console.log('3. Compare with English/Turkish versions');
    console.log('4. Button should be same distance from edge in all languages');
    
    // Test 5: Language switching test
    console.log('\n🌐 Test 5: Language switching instructions...');
    console.log('📱 Mobile test steps:');
    console.log('1. Switch to mobile view (< 1024px)');
    console.log('2. Open mobile menu');
    console.log('3. Switch between languages: العربية ↔ English ↔ Türkçe');
    console.log('4. Check search button position consistency');
    
    console.log('\n🖥️ Desktop test steps:');
    console.log('1. Switch to desktop view (> 1024px)');
    console.log('2. Switch between languages');
    console.log('3. Check search button and icon spacing');
    
    // Summary
    console.log('\n🎉 Test Summary:');
    console.log('================');
    
    const hasLogicalMargins = buttonsWithSearchIcon.some(button => {
      const searchIcon = button.querySelector('svg');
      if (searchIcon) {
        const iconStyle = getComputedStyle(searchIcon);
        return iconStyle.marginInlineEnd && iconStyle.marginInlineEnd !== '0px';
      }
      return false;
    });
    
    if (hasLogicalMargins) {
      console.log('✅ TESTS PASSED!');
      console.log('✅ Buttons use logical margins (me-2)');
      console.log('✅ RTL spacing should work correctly');
    } else {
      console.log('⚠️ TESTS INCOMPLETE');
      console.log('⚠️ Some buttons may still use physical margins');
      console.log('💡 Switch to Arabic to see RTL behavior');
    }
    
    console.log('\n📋 Expected behavior:');
    console.log('✅ Arabic (RTL): Button close to right edge');
    console.log('✅ English/Turkish (LTR): Button close to right edge');
    console.log('✅ Icon spacing consistent in all languages');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Auto-run the test
testArabicRTLSpacing();

// Also provide manual trigger
window.testArabicRTLSpacing = testArabicRTLSpacing;

// Helper function to switch language for testing
window.switchToArabic = () => {
  console.log('🔄 Switching to Arabic...');
  // This would need to be implemented based on your language switching mechanism
  console.log('💡 Use the language switcher in the UI to change to Arabic');
};

window.switchToEnglish = () => {
  console.log('🔄 Switching to English...');
  console.log('💡 Use the language switcher in the UI to change to English');
};
