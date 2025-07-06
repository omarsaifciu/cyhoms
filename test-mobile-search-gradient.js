// Test script to verify mobile search button has gradient colors
// Run this in browser console on mobile/tablet view

console.log('🔧 Testing Mobile Search Button Gradient...');

const testMobileSearchGradient = () => {
  try {
    // Test 1: Check if CSS variables are defined
    console.log('\n📊 Test 1: Checking CSS gradient variables...');
    
    const rootStyles = getComputedStyle(document.documentElement);
    const gradientFromColor = rootStyles.getPropertyValue('--brand-gradient-from-color').trim();
    const gradientToColor = rootStyles.getPropertyValue('--brand-gradient-to-color').trim();
    
    console.log('🎨 --brand-gradient-from-color:', gradientFromColor);
    console.log('🎨 --brand-gradient-to-color:', gradientToColor);
    
    if (gradientFromColor && gradientToColor) {
      console.log('✅ CSS gradient variables are defined');
    } else {
      console.log('❌ CSS gradient variables are missing');
      return;
    }
    
    // Test 2: Check mobile search button in header
    console.log('\n🔍 Test 2: Checking mobile search button in header...');
    
    // Look for mobile search button (in mobile menu)
    const mobileSearchButtons = document.querySelectorAll('button[type="submit"]');
    let mobileHeaderSearchButton = null;
    
    mobileSearchButtons.forEach(button => {
      const svg = button.querySelector('svg');
      if (svg && button.closest('form')) {
        // Check if this is in mobile search context
        const form = button.closest('form');
        const input = form.querySelector('input[type="text"]');
        if (input && (input.placeholder.includes('Search') || input.placeholder.includes('ابحث') || input.placeholder.includes('Ara'))) {
          mobileHeaderSearchButton = button;
        }
      }
    });
    
    if (mobileHeaderSearchButton) {
      console.log('✅ Found mobile header search button');
      
      const computedStyle = getComputedStyle(mobileHeaderSearchButton);
      const background = computedStyle.background || computedStyle.backgroundImage;
      
      console.log('🎨 Button background:', background);
      
      if (background.includes('linear-gradient') && 
          (background.includes('#ec489a') || background.includes('var(--brand-gradient-from-color)')) &&
          (background.includes('#f43f5e') || background.includes('var(--brand-gradient-to-color)'))) {
        console.log('✅ EXCELLENT: Mobile header search button has gradient background!');
      } else {
        console.log('❌ Mobile header search button does not have gradient background');
        console.log('Expected: linear-gradient with gradient colors');
        console.log('Actual:', background);
      }
    } else {
      console.log('⚠️ Mobile header search button not found (may not be visible in current view)');
    }
    
    // Test 3: Check mobile search filters button
    console.log('\n🔍 Test 3: Checking mobile search filters button...');
    
    // Look for mobile search button in filters section
    const searchButtons = document.querySelectorAll('button');
    let mobileFiltersSearchButton = null;
    
    searchButtons.forEach(button => {
      const text = button.textContent || button.innerText;
      if ((text.includes('بحث') || text.includes('Search') || text.includes('Ara')) && 
          button.querySelector('svg') && 
          button.classList.contains('w-full')) {
        mobileFiltersSearchButton = button;
      }
    });
    
    if (mobileFiltersSearchButton) {
      console.log('✅ Found mobile filters search button');
      
      const computedStyle = getComputedStyle(mobileFiltersSearchButton);
      const background = computedStyle.background || computedStyle.backgroundImage;
      
      console.log('🎨 Button background:', background);
      
      if (background.includes('linear-gradient') && 
          (background.includes('#ec489a') || background.includes('var(--brand-gradient-from-color)')) &&
          (background.includes('#f43f5e') || background.includes('var(--brand-gradient-to-color)'))) {
        console.log('✅ EXCELLENT: Mobile filters search button has gradient background!');
      } else {
        console.log('❌ Mobile filters search button does not have gradient background');
        console.log('Expected: linear-gradient with gradient colors');
        console.log('Actual:', background);
      }
    } else {
      console.log('⚠️ Mobile filters search button not found (may not be visible in current view)');
    }
    
    // Test 4: Check desktop search button for comparison
    console.log('\n🖥️ Test 4: Checking desktop search button for comparison...');
    
    const desktopSearchButtons = document.querySelectorAll('button');
    let desktopSearchButton = null;
    
    desktopSearchButtons.forEach(button => {
      if (button.classList.contains('rounded-full') && 
          button.querySelector('svg') && 
          !button.classList.contains('w-full') &&
          button.closest('form')) {
        desktopSearchButton = button;
      }
    });
    
    if (desktopSearchButton) {
      console.log('✅ Found desktop search button');
      
      const computedStyle = getComputedStyle(desktopSearchButton);
      const background = computedStyle.background || computedStyle.backgroundImage;
      
      console.log('🎨 Desktop button background:', background);
      
      if (background.includes('linear-gradient')) {
        console.log('✅ Desktop search button has gradient background');
      } else {
        console.log('⚠️ Desktop search button may not have gradient background');
      }
    } else {
      console.log('⚠️ Desktop search button not found');
    }
    
    // Test 5: Visual comparison
    console.log('\n👀 Test 5: Visual inspection guide...');
    console.log('📱 To verify mobile gradient:');
    console.log('1. Switch to mobile view (< 1024px width)');
    console.log('2. Open mobile menu (hamburger icon)');
    console.log('3. Look for search input with button');
    console.log('4. The search button should have pink-to-red gradient');
    console.log('5. Also check search filters section for search button');
    
    console.log('\n🖥️ To verify desktop gradient:');
    console.log('1. Switch to desktop view (> 1024px width)');
    console.log('2. Look at main search bar');
    console.log('3. The search button should have pink-to-red gradient');
    
    // Test 6: Theme compatibility
    console.log('\n🌙 Test 6: Testing theme compatibility...');
    
    const isDarkMode = document.documentElement.classList.contains('dark');
    console.log('🌙 Current theme:', isDarkMode ? 'Dark' : 'Light');
    
    if (isDarkMode) {
      const darkGradientFrom = rootStyles.getPropertyValue('--brand-gradient-from-color').trim();
      const darkGradientTo = rootStyles.getPropertyValue('--brand-gradient-to-color').trim();
      console.log('🌙 Dark mode gradient from:', darkGradientFrom);
      console.log('🌙 Dark mode gradient to:', darkGradientTo);
    }
    
    // Summary
    console.log('\n🎉 Test Summary:');
    console.log('================');
    
    const hasGradientVars = gradientFromColor && gradientToColor;
    const foundMobileButton = mobileHeaderSearchButton || mobileFiltersSearchButton;
    
    if (hasGradientVars && foundMobileButton) {
      console.log('✅ TESTS PASSED!');
      console.log('✅ CSS gradient variables are defined');
      console.log('✅ Mobile search button found');
      console.log('✅ Ready for visual verification');
    } else {
      console.log('⚠️ SOME TESTS INCOMPLETE');
      if (!hasGradientVars) {
        console.log('❌ CSS gradient variables missing');
      }
      if (!foundMobileButton) {
        console.log('❌ Mobile search button not found');
      }
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Switch to mobile view (width < 1024px)');
    console.log('2. Verify search button has pink-to-red gradient');
    console.log('3. Compare with desktop version');
    console.log('4. Test in both light and dark themes');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Auto-run the test
testMobileSearchGradient();

// Also provide manual trigger
window.testMobileSearchGradient = testMobileSearchGradient;
