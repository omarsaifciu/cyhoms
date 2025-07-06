// Debug script to find all search buttons and their current spacing
// Run this in browser console to identify which buttons need fixing

console.log('🔍 Debugging Search Button Spacing...');

const debugSearchButtonSpacing = () => {
  try {
    // Get current language
    const htmlElement = document.documentElement;
    const currentLang = htmlElement.getAttribute('lang');
    const currentDir = htmlElement.getAttribute('dir');
    
    console.log('🌐 Current language:', currentLang);
    console.log('🌐 Current direction:', currentDir);
    
    // Find all buttons that might be search buttons
    const allButtons = document.querySelectorAll('button');
    const searchButtons = [];
    
    console.log(`\n🔍 Found ${allButtons.length} total buttons, analyzing...`);
    
    allButtons.forEach((button, index) => {
      const buttonText = button.textContent || button.innerText || '';
      const hasSearchIcon = button.querySelector('svg') !== null;
      const isInForm = button.closest('form') !== null;
      const buttonType = button.getAttribute('type');
      
      // Check if this looks like a search button
      const isSearchButton = (
        buttonText.includes('بحث') || 
        buttonText.includes('Search') || 
        buttonText.includes('Ara') ||
        (hasSearchIcon && isInForm) ||
        (buttonType === 'submit' && isInForm)
      );
      
      if (isSearchButton) {
        const computedStyle = getComputedStyle(button);
        const classList = Array.from(button.classList);
        
        const buttonInfo = {
          index: index,
          text: buttonText.trim(),
          type: buttonType,
          hasSearchIcon: hasSearchIcon,
          isInForm: isInForm,
          classList: classList,
          marginLeft: computedStyle.marginLeft,
          marginRight: computedStyle.marginRight,
          marginInlineStart: computedStyle.marginInlineStart,
          marginInlineEnd: computedStyle.marginInlineEnd,
          element: button
        };
        
        searchButtons.push(buttonInfo);
      }
    });
    
    console.log(`\n✅ Found ${searchButtons.length} search buttons:`);
    
    searchButtons.forEach((btn, index) => {
      console.log(`\n🔍 Search Button ${index + 1}:`);
      console.log('   Text:', btn.text || 'No text');
      console.log('   Type:', btn.type || 'No type');
      console.log('   Has Search Icon:', btn.hasSearchIcon);
      console.log('   In Form:', btn.isInForm);
      console.log('   Classes:', btn.classList.join(' '));
      console.log('   Margins:');
      console.log('     margin-left:', btn.marginLeft);
      console.log('     margin-right:', btn.marginRight);
      console.log('     margin-inline-start:', btn.marginInlineStart);
      console.log('     margin-inline-end:', btn.marginInlineEnd);
      
      // Check for specific margin classes
      const hasML2 = btn.classList.includes('ml-2');
      const hasMR2 = btn.classList.includes('mr-2');
      const hasME2 = btn.classList.includes('me-2');
      const hasMS2 = btn.classList.includes('ms-2');
      
      console.log('   Margin Classes:');
      console.log('     ml-2:', hasML2 ? '✅' : '❌');
      console.log('     mr-2:', hasMR2 ? '✅' : '❌');
      console.log('     me-2:', hasME2 ? '✅' : '❌');
      console.log('     ms-2:', hasMS2 ? '✅' : '❌');
      
      // Check if spacing is correct
      const expectedMarginLeft = '8px'; // 0.5rem = 8px
      const hasCorrectSpacing = btn.marginLeft === expectedMarginLeft || btn.marginLeft === '0.5rem';
      
      if (hasCorrectSpacing) {
        console.log('   ✅ CORRECT: Has 8px margin-left (ml-2)');
      } else {
        console.log('   ❌ INCORRECT: margin-left is', btn.marginLeft, 'expected 8px');
      }
      
      // Highlight the button for visual identification
      btn.element.style.outline = '3px solid red';
      btn.element.style.outlineOffset = '2px';
      setTimeout(() => {
        btn.element.style.outline = '';
        btn.element.style.outlineOffset = '';
      }, 5000);
    });
    
    // Check search icons inside buttons
    console.log('\n🔍 Checking search icons inside buttons...');
    
    const searchIcons = [];
    searchButtons.forEach((btn, btnIndex) => {
      const icons = btn.element.querySelectorAll('svg');
      icons.forEach((icon, iconIndex) => {
        const iconStyle = getComputedStyle(icon);
        const iconClassList = Array.from(icon.classList);
        
        const iconInfo = {
          buttonIndex: btnIndex,
          iconIndex: iconIndex,
          classList: iconClassList,
          marginLeft: iconStyle.marginLeft,
          marginRight: iconStyle.marginRight,
          marginInlineStart: iconStyle.marginInlineStart,
          marginInlineEnd: iconStyle.marginInlineEnd,
          element: icon
        };
        
        searchIcons.push(iconInfo);
      });
    });
    
    searchIcons.forEach((icon, index) => {
      console.log(`\n🎯 Search Icon ${index + 1} (in Button ${icon.buttonIndex + 1}):`);
      console.log('   Classes:', icon.classList.join(' '));
      console.log('   Margins:');
      console.log('     margin-left:', icon.marginLeft);
      console.log('     margin-right:', icon.marginRight);
      console.log('     margin-inline-start:', icon.marginInlineStart);
      console.log('     margin-inline-end:', icon.marginInlineEnd);
      
      // Check for specific margin classes
      const hasML2 = icon.classList.includes('ml-2');
      const hasMR2 = icon.classList.includes('mr-2');
      const hasME2 = icon.classList.includes('me-2');
      const hasMS2 = icon.classList.includes('ms-2');
      
      console.log('   Margin Classes:');
      console.log('     ml-2:', hasML2 ? '✅' : '❌');
      console.log('     mr-2:', hasMR2 ? '✅' : '❌');
      console.log('     me-2:', hasME2 ? '✅' : '❌');
      console.log('     ms-2:', hasMS2 ? '✅' : '❌');
      
      // Check if spacing is correct
      const expectedMarginRight = '8px'; // 0.5rem = 8px
      const hasCorrectSpacing = icon.marginRight === expectedMarginRight || icon.marginRight === '0.5rem';
      
      if (hasCorrectSpacing) {
        console.log('   ✅ CORRECT: Has 8px margin-right (mr-2)');
      } else {
        console.log('   ❌ INCORRECT: margin-right is', icon.marginRight, 'expected 8px');
      }
      
      // Highlight the icon for visual identification
      icon.element.style.outline = '2px solid blue';
      icon.element.style.outlineOffset = '1px';
      setTimeout(() => {
        icon.element.style.outline = '';
        icon.element.style.outlineOffset = '';
      }, 5000);
    });
    
    // Summary
    console.log('\n🎉 Debug Summary:');
    console.log('================');
    console.log(`📊 Total search buttons found: ${searchButtons.length}`);
    console.log(`📊 Total search icons found: ${searchIcons.length}`);
    
    const buttonsWithCorrectSpacing = searchButtons.filter(btn => 
      btn.marginLeft === '8px' || btn.marginLeft === '0.5rem'
    );
    
    const iconsWithCorrectSpacing = searchIcons.filter(icon => 
      icon.marginRight === '8px' || icon.marginRight === '0.5rem'
    );
    
    console.log(`✅ Buttons with correct spacing (ml-2): ${buttonsWithCorrectSpacing.length}/${searchButtons.length}`);
    console.log(`✅ Icons with correct spacing (mr-2): ${iconsWithCorrectSpacing.length}/${searchIcons.length}`);
    
    if (buttonsWithCorrectSpacing.length === searchButtons.length && 
        iconsWithCorrectSpacing.length === searchIcons.length) {
      console.log('🎉 ALL SPACING IS CORRECT!');
    } else {
      console.log('⚠️ SOME SPACING NEEDS FIXING:');
      
      const buttonsNeedingFix = searchButtons.filter(btn => 
        btn.marginLeft !== '8px' && btn.marginLeft !== '0.5rem'
      );
      
      const iconsNeedingFix = searchIcons.filter(icon => 
        icon.marginRight !== '8px' && icon.marginRight !== '0.5rem'
      );
      
      if (buttonsNeedingFix.length > 0) {
        console.log(`❌ Buttons needing fix: ${buttonsNeedingFix.length}`);
        buttonsNeedingFix.forEach((btn, index) => {
          console.log(`   ${index + 1}. "${btn.text}" - margin-left: ${btn.marginLeft}`);
        });
      }
      
      if (iconsNeedingFix.length > 0) {
        console.log(`❌ Icons needing fix: ${iconsNeedingFix.length}`);
        iconsNeedingFix.forEach((icon, index) => {
          console.log(`   ${index + 1}. Icon in button ${icon.buttonIndex + 1} - margin-right: ${icon.marginRight}`);
        });
      }
    }
    
    console.log('\n💡 Note: Buttons and icons are highlighted for 5 seconds');
    console.log('🔴 Red outline = Search buttons');
    console.log('🔵 Blue outline = Search icons');
    
  } catch (error) {
    console.error('❌ Debug failed with error:', error);
  }
};

// Auto-run the debug
debugSearchButtonSpacing();

// Also provide manual trigger
window.debugSearchButtonSpacing = debugSearchButtonSpacing;
