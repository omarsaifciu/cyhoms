// Test script to verify language-specific spacing for search buttons
// Run this in browser console

console.log('🔧 Testing Language-Specific Spacing...');

const testLanguageSpecificSpacing = () => {
  try {
    // Get current language
    const htmlElement = document.documentElement;
    const currentLang = htmlElement.getAttribute('lang');
    const currentDir = htmlElement.getAttribute('dir');
    
    console.log('🌐 Current language:', currentLang);
    console.log('🌐 Current direction:', currentDir);
    
    // Find all search buttons
    const searchButtons = [];
    const allButtons = document.querySelectorAll('button[type="submit"]');
    
    allButtons.forEach((button) => {
      const form = button.closest('form');
      if (form) {
        const input = form.querySelector('input[type="text"]');
        if (input && (input.placeholder.includes('ابحث') || input.placeholder.includes('Search') || input.placeholder.includes('Ara'))) {
          searchButtons.push(button);
        }
      }
    });
    
    // Also find text search buttons
    document.querySelectorAll('button').forEach((button) => {
      const text = button.textContent || button.innerText;
      if (text.includes('بحث') || text.includes('Search') || text.includes('Ara')) {
        if (!searchButtons.includes(button)) {
          searchButtons.push(button);
        }
      }
    });
    
    console.log(`🔍 Found ${searchButtons.length} search buttons`);
    
    searchButtons.forEach((button, index) => {
      console.log(`\n🔍 Search Button ${index + 1}:`);
      
      const computedStyle = getComputedStyle(button);
      const classList = Array.from(button.classList);
      
      // Check margin classes
      const marginClasses = classList.filter(cls => 
        cls.startsWith('ml-') || cls.startsWith('mr-') || 
        cls.startsWith('me-') || cls.startsWith('ms-')
      );
      
      console.log('   Classes:', classList.join(' '));
      console.log('   Margin classes:', marginClasses);
      
      // Get computed margins
      const margins = {
        left: computedStyle.marginLeft,
        right: computedStyle.marginRight
      };
      
      console.log('   Computed margins:');
      console.log('     margin-left:', margins.left);
      console.log('     margin-right:', margins.right);
      
      // Check expected behavior based on language
      if (currentLang === 'ar') {
        // Arabic: should have NO margin classes
        if (marginClasses.length === 0) {
          console.log('   ✅ CORRECT: Arabic version has no margin classes');
        } else {
          console.log('   ❌ INCORRECT: Arabic version should not have margin classes');
          console.log('   💡 Found margin classes:', marginClasses);
        }
        
        // Check if margin is 0 or very small
        const marginLeftPx = parseFloat(margins.left);
        if (marginLeftPx <= 2) {
          console.log('   ✅ CORRECT: Arabic version has minimal margin-left');
        } else {
          console.log('   ❌ INCORRECT: Arabic version has too much margin-left:', margins.left);
        }
      } else {
        // English/Turkish: should have ml-2
        const hasML2 = marginClasses.includes('ml-2');
        if (hasML2) {
          console.log('   ✅ CORRECT: English/Turkish version has ml-2');
        } else {
          console.log('   ❌ INCORRECT: English/Turkish version should have ml-2');
          console.log('   💡 Current margin classes:', marginClasses);
        }
        
        // Check if margin-left is 8px
        if (margins.left === '8px' || margins.left === '0.5rem') {
          console.log('   ✅ CORRECT: English/Turkish version has 8px margin-left');
        } else {
          console.log('   ❌ INCORRECT: English/Turkish version margin-left is:', margins.left);
        }
      }
      
      // Check button position relative to container
      const form = button.closest('form');
      if (form) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = form.getBoundingClientRect();
        
        const distanceFromRight = containerRect.right - buttonRect.right;
        const distanceFromLeft = buttonRect.left - containerRect.left;
        
        console.log('   Position:');
        console.log('     Distance from right edge:', distanceFromRight + 'px');
        console.log('     Distance from left edge:', distanceFromLeft + 'px');
        
        if (currentLang === 'ar') {
          // Arabic: button should be close to left edge
          if (distanceFromLeft < 15) {
            console.log('   ✅ CORRECT: Arabic button close to left edge');
          } else {
            console.log('   ❌ INCORRECT: Arabic button too far from left edge');
          }
        } else {
          // English/Turkish: button should be close to right edge
          if (distanceFromRight < 15) {
            console.log('   ✅ CORRECT: English/Turkish button close to right edge');
          } else {
            console.log('   ❌ INCORRECT: English/Turkish button too far from right edge');
          }
        }
      }
      
      // Check search icons
      const searchIcons = button.querySelectorAll('svg');
      searchIcons.forEach((icon, iconIndex) => {
        console.log(`   🎯 Icon ${iconIndex + 1}:`);
        
        const iconStyle = getComputedStyle(icon);
        const iconClasses = Array.from(icon.classList);
        
        const iconMarginClasses = iconClasses.filter(cls => 
          cls.startsWith('ml-') || cls.startsWith('mr-') || 
          cls.startsWith('me-') || cls.startsWith('ms-')
        );
        
        console.log('     Icon classes:', iconClasses.join(' '));
        console.log('     Icon margin classes:', iconMarginClasses);
        
        const iconMargins = {
          left: iconStyle.marginLeft,
          right: iconStyle.marginRight
        };
        
        console.log('     Icon computed margins:');
        console.log('       margin-left:', iconMargins.left);
        console.log('       margin-right:', iconMargins.right);
        
        if (currentLang === 'ar') {
          // Arabic: icon should have NO margin classes
          if (iconMarginClasses.length === 0) {
            console.log('     ✅ CORRECT: Arabic icon has no margin classes');
          } else {
            console.log('     ❌ INCORRECT: Arabic icon should not have margin classes');
          }
        } else {
          // English/Turkish: icon should have mr-2
          const hasMR2 = iconMarginClasses.includes('mr-2');
          if (hasMR2) {
            console.log('     ✅ CORRECT: English/Turkish icon has mr-2');
          } else {
            console.log('     ❌ INCORRECT: English/Turkish icon should have mr-2');
          }
          
          // Check if margin-right is 8px
          if (iconMargins.right === '8px' || iconMargins.right === '0.5rem') {
            console.log('     ✅ CORRECT: English/Turkish icon has 8px margin-right');
          } else {
            console.log('     ❌ INCORRECT: English/Turkish icon margin-right is:', iconMargins.right);
          }
        }
      });
      
      // Highlight button
      button.style.outline = '3px solid purple';
      button.style.outlineOffset = '2px';
      setTimeout(() => {
        button.style.outline = '';
        button.style.outlineOffset = '';
      }, 7000);
    });
    
    // Expected behavior summary
    console.log('\n🎯 Expected Behavior Summary:');
    console.log('=============================');
    
    if (currentLang === 'ar') {
      console.log('📱 Arabic (العربية):');
      console.log('   • Button: NO margin classes (no ml-2, no me-2)');
      console.log('   • Icon: NO margin classes (no mr-2, no me-2)');
      console.log('   • Button close to LEFT edge of container');
      console.log('   • Layout: [🔍][ابحث عن العقارات...]');
    } else if (currentLang === 'en') {
      console.log('📱 English:');
      console.log('   • Button: ml-2 class (8px margin-left)');
      console.log('   • Icon: mr-2 class (8px margin-right)');
      console.log('   • Button close to RIGHT edge of container');
      console.log('   • Layout: [Search properties...] [🔍]');
    } else if (currentLang === 'tr') {
      console.log('📱 Turkish (Türkçe):');
      console.log('   • Button: ml-2 class (8px margin-left)');
      console.log('   • Icon: mr-2 class (8px margin-right)');
      console.log('   • Button close to RIGHT edge of container');
      console.log('   • Layout: [Mülk ara...] [🔍]');
    }
    
    // Summary
    console.log('\n🎉 Test Summary:');
    console.log('================');
    
    let allCorrect = true;
    
    searchButtons.forEach((button) => {
      const classList = Array.from(button.classList);
      const marginClasses = classList.filter(cls => 
        cls.startsWith('ml-') || cls.startsWith('mr-') || 
        cls.startsWith('me-') || cls.startsWith('ms-')
      );
      
      if (currentLang === 'ar') {
        if (marginClasses.length > 0) allCorrect = false;
      } else {
        if (!marginClasses.includes('ml-2')) allCorrect = false;
      }
    });
    
    if (allCorrect) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('✅ Language-specific spacing is working correctly');
    } else {
      console.log('❌ SOME TESTS FAILED!');
      console.log('⚠️ Check the detailed results above');
    }
    
    console.log('\n🔄 Testing Instructions:');
    console.log('1. Test in Arabic (العربية) - should have no margins');
    console.log('2. Test in English - should have ml-2 and mr-2');
    console.log('3. Test in Turkish (Türkçe) - should have ml-2 and mr-2');
    console.log('4. Compare visual spacing between languages');
    
    console.log('\n🔍 Buttons highlighted in purple for 7 seconds');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Auto-run the test
testLanguageSpecificSpacing();

// Also provide manual trigger
window.testLanguageSpecificSpacing = testLanguageSpecificSpacing;
