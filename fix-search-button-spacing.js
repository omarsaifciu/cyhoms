// Script to automatically fix search button spacing issues
// Run this in browser console to apply ml-2 to all search buttons

console.log('🔧 Fixing Search Button Spacing...');

const fixSearchButtonSpacing = () => {
  try {
    // Get current language
    const htmlElement = document.documentElement;
    const currentLang = htmlElement.getAttribute('lang');
    
    console.log('🌐 Current language:', currentLang);
    console.log('🔧 Applying ml-2 to all search buttons...');
    
    // Find all buttons that might be search buttons
    const allButtons = document.querySelectorAll('button');
    const searchButtons = [];
    
    allButtons.forEach((button) => {
      const buttonText = button.textContent || button.innerText || '';
      const hasSearchIcon = button.querySelector('svg') !== null;
      const isInForm = button.closest('form') !== null;
      const buttonType = button.getAttribute('type');
      
      // Check if this looks like a search button
      const isSearchButton = (
        buttonText.includes('بحث') || 
        buttonText.includes('Search') || 
        buttonText.includes('Ara') ||
        (hasSearchIcon && isInForm && buttonType === 'submit')
      );
      
      if (isSearchButton) {
        searchButtons.push(button);
      }
    });
    
    console.log(`🔍 Found ${searchButtons.length} search buttons to fix`);
    
    let buttonsFixed = 0;
    let iconsFixed = 0;
    
    searchButtons.forEach((button, index) => {
      console.log(`\n🔧 Fixing Button ${index + 1}...`);
      
      // Remove any existing margin classes
      button.classList.remove('me-2', 'ms-2', 'ml-1', 'ml-3', 'ml-4');
      
      // Add ml-2 if not already present
      if (!button.classList.contains('ml-2')) {
        button.classList.add('ml-2');
        buttonsFixed++;
        console.log('   ✅ Added ml-2 to button');
      } else {
        console.log('   ✅ Button already has ml-2');
      }
      
      // Fix search icons inside the button
      const searchIcons = button.querySelectorAll('svg');
      searchIcons.forEach((icon, iconIndex) => {
        console.log(`   🎯 Fixing Icon ${iconIndex + 1}...`);
        
        // Remove any existing margin classes
        icon.classList.remove('me-2', 'ms-2', 'ml-2', 'mr-1', 'mr-3', 'mr-4');
        
        // Add mr-2 if not already present
        if (!icon.classList.contains('mr-2')) {
          icon.classList.add('mr-2');
          iconsFixed++;
          console.log('     ✅ Added mr-2 to icon');
        } else {
          console.log('     ✅ Icon already has mr-2');
        }
      });
    });
    
    console.log('\n🎉 Fixing Complete!');
    console.log('==================');
    console.log(`✅ Buttons fixed: ${buttonsFixed}`);
    console.log(`✅ Icons fixed: ${iconsFixed}`);
    console.log(`📊 Total search buttons: ${searchButtons.length}`);
    
    if (buttonsFixed === 0 && iconsFixed === 0) {
      console.log('🎉 All spacing was already correct!');
    } else {
      console.log('🔄 Spacing has been updated');
      console.log('💡 Refresh the page to see if changes persist');
    }
    
    // Verify the fixes
    console.log('\n🔍 Verifying fixes...');
    
    let verificationPassed = true;
    
    searchButtons.forEach((button, index) => {
      const computedStyle = getComputedStyle(button);
      const marginLeft = computedStyle.marginLeft;
      
      if (marginLeft === '8px' || marginLeft === '0.5rem') {
        console.log(`✅ Button ${index + 1}: margin-left = ${marginLeft}`);
      } else {
        console.log(`❌ Button ${index + 1}: margin-left = ${marginLeft} (expected 8px)`);
        verificationPassed = false;
      }
      
      // Verify icons
      const searchIcons = button.querySelectorAll('svg');
      searchIcons.forEach((icon, iconIndex) => {
        const iconStyle = getComputedStyle(icon);
        const marginRight = iconStyle.marginRight;
        
        if (marginRight === '8px' || marginRight === '0.5rem') {
          console.log(`✅ Button ${index + 1} Icon ${iconIndex + 1}: margin-right = ${marginRight}`);
        } else {
          console.log(`❌ Button ${index + 1} Icon ${iconIndex + 1}: margin-right = ${marginRight} (expected 8px)`);
          verificationPassed = false;
        }
      });
    });
    
    if (verificationPassed) {
      console.log('\n🎉 ALL VERIFICATIONS PASSED!');
      console.log('✅ All search buttons now have consistent small spacing');
    } else {
      console.log('\n⚠️ SOME VERIFICATIONS FAILED');
      console.log('💡 Some buttons may need manual fixing in the source code');
    }
    
    // Test in different languages
    console.log('\n🌐 Language Testing Instructions:');
    console.log('1. Switch to Arabic (العربية)');
    console.log('2. Check that search button spacing looks good');
    console.log('3. Switch to English');
    console.log('4. Check that search button spacing looks good');
    console.log('5. Switch to Turkish (Türkçe)');
    console.log('6. Check that search button spacing looks good');
    console.log('7. All should have the same small, consistent spacing');
    
  } catch (error) {
    console.error('❌ Fix failed with error:', error);
  }
};

// Auto-run the fix
fixSearchButtonSpacing();

// Also provide manual trigger
window.fixSearchButtonSpacing = fixSearchButtonSpacing;
