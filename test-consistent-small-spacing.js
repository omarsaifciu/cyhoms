// Test script to verify consistent small spacing for search buttons in all languages
// Run this in browser console

console.log('🔧 Testing Consistent Small Spacing for Search Buttons...');

const testConsistentSmallSpacing = () => {
  try {
    // Test 1: Check current language
    console.log('\n📊 Test 1: Checking current language...');
    
    const htmlElement = document.documentElement;
    const currentDir = htmlElement.getAttribute('dir');
    const currentLang = htmlElement.getAttribute('lang');
    
    console.log('🌐 Current direction:', currentDir);
    console.log('🌐 Current language:', currentLang);
    
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
      
      console.log('📏 Button margins:');
      console.log('   margin-left:', marginLeft);
      console.log('   margin-right:', marginRight);
      
      // Check if button uses ml-2 (should be 0.5rem = 8px)
      if (marginLeft === '8px' || marginLeft === '0.5rem') {
        console.log('✅ EXCELLENT: Button uses ml-2 (8px margin-left)');
        console.log('✅ This creates consistent small spacing');
      } else {
        console.log('⚠️ Button margin-left:', marginLeft);
        console.log('💡 Expected: 8px (0.5rem) for ml-2');
      }
      
      // Check button position relative to container
      const buttonRect = mobileSearchButton.getBoundingClientRect();
      const containerRect = mobileSearchButton.closest('form').getBoundingClientRect();
      
      const distanceFromRight = containerRect.right - buttonRect.right;
      const distanceFromLeft = buttonRect.left - containerRect.left;
      
      console.log('📐 Distance from container right:', distanceFromRight + 'px');
      console.log('📐 Distance from container left:', distanceFromLeft + 'px');
      
      if (distanceFromRight < 15) {
        console.log('✅ GOOD: Button is close to right edge (small spacing)');
      } else {
        console.log('⚠️ Button may be too far from right edge');
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
        
        console.log(`\n🔍 Button ${index + 1} icon margins:`);
        console.log('   margin-left:', marginLeft);
        console.log('   margin-right:', marginRight);
        
        if (marginRight === '8px' || marginRight === '0.5rem') {
          console.log('✅ Icon uses mr-2 (8px margin-right)');
          console.log('✅ Small consistent spacing between icon and text');
        } else {
          console.log('⚠️ Icon margin-right:', marginRight);
          console.log('💡 Expected: 8px (0.5rem) for mr-2');
        }
      }
    });
    
    // Test 4: Visual consistency check
    console.log('\n👀 Test 4: Visual consistency check...');
    console.log('📋 Expected behavior in ALL languages:');
    console.log('✅ Search button: 8px margin from input field (ml-2)');
    console.log('✅ Search icon: 8px margin from text (mr-2)');
    console.log('✅ Button close to container edge');
    console.log('✅ Small, consistent spacing');
    
    // Test 5: Language comparison guide
    console.log('\n🌐 Test 5: Language comparison guide...');
    console.log('📱 To verify consistency:');
    console.log('1. Test in Arabic (العربية)');
    console.log('2. Test in English');
    console.log('3. Test in Turkish (Türkçe)');
    console.log('4. All should have same small spacing');
    
    console.log('\n📏 Expected measurements:');
    console.log('• Button margin-left: 8px in all languages');
    console.log('• Icon margin-right: 8px in all languages');
    console.log('• Button distance from edge: < 15px');
    
    // Test 6: Mobile vs Desktop comparison
    console.log('\n📱🖥️ Test 6: Mobile vs Desktop comparison...');
    
    // Check if we're in mobile or desktop view
    const isMobileView = window.innerWidth < 1024;
    console.log('📱 Current view:', isMobileView ? 'Mobile' : 'Desktop');
    
    if (isMobileView) {
      console.log('📱 Mobile view active - testing mobile search button');
    } else {
      console.log('🖥️ Desktop view active - testing desktop search button');
    }
    
    // Summary
    console.log('\n🎉 Test Summary:');
    console.log('================');
    
    const hasCorrectButtonMargin = mobileSearchButton && 
      (getComputedStyle(mobileSearchButton).marginLeft === '8px' || 
       getComputedStyle(mobileSearchButton).marginLeft === '0.5rem');
    
    const hasCorrectIconMargin = buttonsWithSearchIcon.some(button => {
      const searchIcon = button.querySelector('svg');
      if (searchIcon) {
        const iconStyle = getComputedStyle(searchIcon);
        return iconStyle.marginRight === '8px' || iconStyle.marginRight === '0.5rem';
      }
      return false;
    });
    
    if (hasCorrectButtonMargin && hasCorrectIconMargin) {
      console.log('✅ TESTS PASSED!');
      console.log('✅ Button uses ml-2 (8px margin-left)');
      console.log('✅ Icon uses mr-2 (8px margin-right)');
      console.log('✅ Small, consistent spacing achieved');
    } else {
      console.log('⚠️ TESTS INCOMPLETE');
      if (!hasCorrectButtonMargin) {
        console.log('❌ Button margin may not be correct');
      }
      if (!hasCorrectIconMargin) {
        console.log('❌ Icon margin may not be correct');
      }
    }
    
    console.log('\n📋 Final verification:');
    console.log('1. Switch between languages');
    console.log('2. Check that spacing looks identical');
    console.log('3. Button should be close to edge in all languages');
    console.log('4. Icon should have small gap from text');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Auto-run the test
testConsistentSmallSpacing();

// Also provide manual trigger
window.testConsistentSmallSpacing = testConsistentSmallSpacing;
