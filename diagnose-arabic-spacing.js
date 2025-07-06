// Diagnose Arabic spacing issues for search buttons
// Run this in browser console

console.log('🔍 Diagnosing Arabic Spacing Issues...');

const diagnoseArabicSpacing = () => {
  try {
    // Get current language and direction
    const htmlElement = document.documentElement;
    const currentLang = htmlElement.getAttribute('lang');
    const currentDir = htmlElement.getAttribute('dir');
    
    console.log('🌐 Current language:', currentLang);
    console.log('🌐 Current direction:', currentDir);
    
    if (currentLang !== 'ar') {
      console.log('⚠️ Not in Arabic mode. Switch to Arabic to test.');
      console.log('💡 Use language switcher to change to العربية');
    }
    
    // Find all search-related elements
    console.log('\n🔍 Finding all search elements...');
    
    // 1. Search buttons in forms
    const searchButtons = [];
    const allButtons = document.querySelectorAll('button[type="submit"]');
    
    allButtons.forEach((button, index) => {
      const form = button.closest('form');
      if (form) {
        const input = form.querySelector('input[type="text"]');
        if (input && (input.placeholder.includes('ابحث') || input.placeholder.includes('Search') || input.placeholder.includes('Ara'))) {
          searchButtons.push({
            type: 'form-submit',
            element: button,
            form: form,
            input: input,
            index: index
          });
        }
      }
    });
    
    // 2. Search buttons with text
    const textSearchButtons = [];
    document.querySelectorAll('button').forEach((button, index) => {
      const text = button.textContent || button.innerText;
      if (text.includes('بحث') || text.includes('Search') || text.includes('Ara')) {
        textSearchButtons.push({
          type: 'text-search',
          element: button,
          text: text.trim(),
          index: index
        });
      }
    });
    
    console.log(`📊 Found ${searchButtons.length} form search buttons`);
    console.log(`📊 Found ${textSearchButtons.length} text search buttons`);
    
    // Analyze each search button
    const allSearchElements = [...searchButtons, ...textSearchButtons];
    
    allSearchElements.forEach((item, index) => {
      console.log(`\n🔍 Search Element ${index + 1} (${item.type}):`);
      
      const element = item.element;
      const computedStyle = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      
      // Get all margin values
      const margins = {
        left: computedStyle.marginLeft,
        right: computedStyle.marginRight,
        top: computedStyle.marginTop,
        bottom: computedStyle.marginBottom,
        inlineStart: computedStyle.marginInlineStart,
        inlineEnd: computedStyle.marginInlineEnd
      };
      
      console.log('   Element:', element.tagName, element.className);
      console.log('   Text:', item.text || 'No text');
      console.log('   Position:', {
        left: rect.left,
        right: rect.right,
        width: rect.width
      });
      console.log('   Margins:', margins);
      
      // Check for margin classes
      const classList = Array.from(element.classList);
      const marginClasses = classList.filter(cls => 
        cls.startsWith('ml-') || cls.startsWith('mr-') || 
        cls.startsWith('me-') || cls.startsWith('ms-') ||
        cls.startsWith('mx-') || cls.startsWith('my-') ||
        cls.includes('margin')
      );
      
      console.log('   Margin classes:', marginClasses);
      
      // Check if this is in Arabic and has different spacing
      if (currentLang === 'ar') {
        const expectedMarginLeft = '8px'; // ml-2 = 0.5rem = 8px
        
        if (margins.left !== expectedMarginLeft && margins.left !== '0.5rem') {
          console.log('   ❌ ISSUE: margin-left is', margins.left, 'expected', expectedMarginLeft);
        } else {
          console.log('   ✅ GOOD: margin-left is correct');
        }
        
        // Check if element is too far from container edge
        if (item.form) {
          const containerRect = item.form.getBoundingClientRect();
          const distanceFromRight = containerRect.right - rect.right;
          const distanceFromLeft = rect.left - containerRect.left;
          
          console.log('   Container distances:');
          console.log('     From right edge:', distanceFromRight + 'px');
          console.log('     From left edge:', distanceFromLeft + 'px');
          
          if (distanceFromRight > 20) {
            console.log('   ❌ ISSUE: Button too far from right edge');
          } else {
            console.log('   ✅ GOOD: Button close to right edge');
          }
        }
      }
      
      // Check search icons inside the button
      const searchIcons = element.querySelectorAll('svg');
      searchIcons.forEach((icon, iconIndex) => {
        console.log(`   🎯 Icon ${iconIndex + 1}:`);
        
        const iconStyle = getComputedStyle(icon);
        const iconMargins = {
          left: iconStyle.marginLeft,
          right: iconStyle.marginRight,
          inlineStart: iconStyle.marginInlineStart,
          inlineEnd: iconStyle.marginInlineEnd
        };
        
        console.log('     Icon margins:', iconMargins);
        
        const iconClasses = Array.from(icon.classList);
        const iconMarginClasses = iconClasses.filter(cls => 
          cls.startsWith('ml-') || cls.startsWith('mr-') || 
          cls.startsWith('me-') || cls.startsWith('ms-')
        );
        
        console.log('     Icon margin classes:', iconMarginClasses);
        
        if (currentLang === 'ar') {
          const expectedMarginRight = '8px'; // mr-2 = 0.5rem = 8px
          
          if (iconMargins.right !== expectedMarginRight && iconMargins.right !== '0.5rem') {
            console.log('     ❌ ISSUE: icon margin-right is', iconMargins.right, 'expected', expectedMarginRight);
          } else {
            console.log('     ✅ GOOD: icon margin-right is correct');
          }
        }
      });
      
      // Highlight element for visual identification
      element.style.outline = '3px solid orange';
      element.style.outlineOffset = '2px';
      setTimeout(() => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      }, 8000);
    });
    
    // Check for CSS overrides
    console.log('\n🎨 Checking for CSS overrides...');
    
    // Check if there are any CSS rules that might override margins in Arabic
    const stylesheets = Array.from(document.styleSheets);
    let foundArabicRules = false;
    
    stylesheets.forEach((sheet, sheetIndex) => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        rules.forEach((rule, ruleIndex) => {
          if (rule.selectorText && (
            rule.selectorText.includes('[dir="rtl"]') ||
            rule.selectorText.includes('[lang="ar"]') ||
            rule.selectorText.includes('.rtl') ||
            rule.selectorText.includes('.arabic')
          )) {
            console.log(`   📜 Found Arabic CSS rule: ${rule.selectorText}`);
            console.log(`      ${rule.cssText}`);
            foundArabicRules = true;
          }
        });
      } catch (e) {
        // Skip stylesheets we can't access (CORS)
      }
    });
    
    if (!foundArabicRules) {
      console.log('   ✅ No specific Arabic CSS overrides found');
    }
    
    // Summary and recommendations
    console.log('\n🎉 Diagnosis Summary:');
    console.log('====================');
    
    if (currentLang === 'ar') {
      console.log('✅ Currently in Arabic mode - good for testing');
      
      const issuesFound = allSearchElements.some(item => {
        const margins = getComputedStyle(item.element);
        return margins.marginLeft !== '8px' && margins.marginLeft !== '0.5rem';
      });
      
      if (issuesFound) {
        console.log('❌ ISSUES FOUND: Some search buttons have incorrect spacing');
        console.log('💡 Recommendations:');
        console.log('   1. Check if any CSS is overriding ml-2 class');
        console.log('   2. Look for RTL-specific CSS rules');
        console.log('   3. Verify Tailwind CSS is working correctly');
        console.log('   4. Check browser developer tools for computed styles');
      } else {
        console.log('✅ NO ISSUES FOUND: All search buttons have correct spacing');
        console.log('💡 If you still see visual differences:');
        console.log('   1. Clear browser cache');
        console.log('   2. Check if the issue is in a different component');
        console.log('   3. Compare with other languages side by side');
      }
    } else {
      console.log('⚠️ Not in Arabic mode');
      console.log('💡 Switch to Arabic (العربية) and run this script again');
    }
    
    console.log('\n🔍 Elements highlighted in orange for 8 seconds');
    
  } catch (error) {
    console.error('❌ Diagnosis failed with error:', error);
  }
};

// Auto-run the diagnosis
diagnoseArabicSpacing();

// Also provide manual trigger
window.diagnoseArabicSpacing = diagnoseArabicSpacing;
