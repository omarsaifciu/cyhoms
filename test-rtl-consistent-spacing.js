// Test script to verify consistent spacing in both LTR and RTL
// Run this in browser console

console.log('🔧 Testing RTL Consistent Spacing...');

const testRTLConsistentSpacing = () => {
  try {
    // Get current language and direction
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
      const rect = button.getBoundingClientRect();
      
      // Get all margin values
      const margins = {
        left: computedStyle.marginLeft,
        right: computedStyle.marginRight,
        inlineStart: computedStyle.marginInlineStart,
        inlineEnd: computedStyle.marginInlineEnd
      };
      
      console.log('   Margins:');
      console.log('     margin-left:', margins.left);
      console.log('     margin-right:', margins.right);
      console.log('     margin-inline-start:', margins.inlineStart);
      console.log('     margin-inline-end:', margins.inlineEnd);
      
      // Check margin classes
      const classList = Array.from(button.classList);
      const marginClasses = classList.filter(cls => 
        cls.startsWith('ml-') || cls.startsWith('mr-') || 
        cls.startsWith('me-') || cls.startsWith('ms-')
      );
      
      console.log('   Margin classes:', marginClasses);
      
      // Check if using logical margins
      const hasLogicalMargin = marginClasses.some(cls => cls.startsWith('me-') || cls.startsWith('ms-'));
      
      if (hasLogicalMargin) {
        console.log('   ✅ GOOD: Uses logical margins (me-/ms-)');
        
        // Check if margin-inline-end is 8px
        if (margins.inlineEnd === '8px' || margins.inlineEnd === '0.5rem') {
          console.log('   ✅ EXCELLENT: margin-inline-end is 8px');
        } else {
          console.log('   ⚠️ margin-inline-end is:', margins.inlineEnd, '(expected 8px)');
        }
      } else {
        console.log('   ❌ BAD: Uses physical margins (ml-/mr-)');
        console.log('   💡 Should use me-2 for consistent RTL/LTR spacing');
      }
      
      // Check button position relative to container
      const form = button.closest('form');
      if (form) {
        const containerRect = form.getBoundingClientRect();
        const distanceFromEnd = currentDir === 'rtl' 
          ? rect.left - containerRect.left
          : containerRect.right - rect.right;
        
        console.log('   📐 Distance from container end:', distanceFromEnd + 'px');
        
        if (distanceFromEnd < 15) {
          console.log('   ✅ GOOD: Button close to container edge');
        } else {
          console.log('   ❌ BAD: Button too far from container edge');
        }
      }
      
      // Check search icons
      const searchIcons = button.querySelectorAll('svg');
      searchIcons.forEach((icon, iconIndex) => {
        console.log(`   🎯 Icon ${iconIndex + 1}:`);
        
        const iconStyle = getComputedStyle(icon);
        const iconMargins = {
          left: iconStyle.marginLeft,
          right: iconStyle.marginRight,
          inlineStart: iconStyle.marginInlineStart,
          inlineEnd: iconStyle.marginInlineEnd
        };
        
        console.log('     Icon margins:');
        console.log('       margin-left:', iconMargins.left);
        console.log('       margin-right:', iconMargins.right);
        console.log('       margin-inline-start:', iconMargins.inlineStart);
        console.log('       margin-inline-end:', iconMargins.inlineEnd);
        
        const iconClasses = Array.from(icon.classList);
        const iconMarginClasses = iconClasses.filter(cls => 
          cls.startsWith('ml-') || cls.startsWith('mr-') || 
          cls.startsWith('me-') || cls.startsWith('ms-')
        );
        
        console.log('     Icon margin classes:', iconMarginClasses);
        
        const hasLogicalIconMargin = iconMarginClasses.some(cls => cls.startsWith('me-') || cls.startsWith('ms-'));
        
        if (hasLogicalIconMargin) {
          console.log('     ✅ GOOD: Icon uses logical margins');
          
          // Check if margin-inline-end is 8px
          if (iconMargins.inlineEnd === '8px' || iconMargins.inlineEnd === '0.5rem') {
            console.log('     ✅ EXCELLENT: icon margin-inline-end is 8px');
          } else {
            console.log('     ⚠️ icon margin-inline-end is:', iconMargins.inlineEnd, '(expected 8px)');
          }
        } else {
          console.log('     ❌ BAD: Icon uses physical margins');
          console.log('     💡 Should use me-2 for consistent RTL/LTR spacing');
        }
      });
      
      // Highlight button
      button.style.outline = '3px solid green';
      button.style.outlineOffset = '2px';
      setTimeout(() => {
        button.style.outline = '';
        button.style.outlineOffset = '';
      }, 6000);
    });
    
    // Test expected behavior
    console.log('\n🎯 Expected Behavior:');
    console.log('=====================');
    
    if (currentDir === 'rtl') {
      console.log('📱 Arabic (RTL) Mode:');
      console.log('   • Button should be close to LEFT edge of container');
      console.log('   • me-2 should translate to margin-left: 8px');
      console.log('   • Icon me-2 should translate to margin-left: 8px');
      console.log('   • Layout: [🔍] [ابحث عن العقارات...]');
    } else {
      console.log('📱 English/Turkish (LTR) Mode:');
      console.log('   • Button should be close to RIGHT edge of container');
      console.log('   • me-2 should translate to margin-right: 8px');
      console.log('   • Icon me-2 should translate to margin-right: 8px');
      console.log('   • Layout: [Search properties...] [🔍]');
    }
    
    // Summary
    console.log('\n🎉 Test Summary:');
    console.log('================');
    
    const buttonsWithLogicalMargins = searchButtons.filter(button => {
      const classList = Array.from(button.classList);
      return classList.some(cls => cls.startsWith('me-') || cls.startsWith('ms-'));
    });
    
    const iconsWithLogicalMargins = [];
    searchButtons.forEach(button => {
      const icons = button.querySelectorAll('svg');
      icons.forEach(icon => {
        const classList = Array.from(icon.classList);
        if (classList.some(cls => cls.startsWith('me-') || cls.startsWith('ms-'))) {
          iconsWithLogicalMargins.push(icon);
        }
      });
    });
    
    console.log(`✅ Buttons with logical margins: ${buttonsWithLogicalMargins.length}/${searchButtons.length}`);
    console.log(`✅ Icons with logical margins: ${iconsWithLogicalMargins.length}`);
    
    if (buttonsWithLogicalMargins.length === searchButtons.length) {
      console.log('🎉 ALL BUTTONS USE LOGICAL MARGINS!');
      console.log('✅ Spacing should be consistent in both RTL and LTR');
    } else {
      console.log('⚠️ SOME BUTTONS STILL USE PHYSICAL MARGINS');
      console.log('💡 These may cause spacing issues in RTL');
    }
    
    console.log('\n🔄 Testing Instructions:');
    console.log('1. Switch to Arabic (العربية) and run this script');
    console.log('2. Switch to English and run this script');
    console.log('3. Switch to Turkish (Türkçe) and run this script');
    console.log('4. Compare the distance from container edge');
    console.log('5. All should have same small spacing (8px)');
    
    console.log('\n🔍 Buttons highlighted in green for 6 seconds');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Auto-run the test
testRTLConsistentSpacing();

// Also provide manual trigger
window.testRTLConsistentSpacing = testRTLConsistentSpacing;
