// Test script to verify contact button styling in property pages
// Run this in browser console

console.log('🔧 Testing Contact Button Styling...');

const testContactButtonStyling = () => {
  try {
    // Find contact buttons
    const contactButtons = [];
    
    // Look for contact-related buttons
    const allButtons = document.querySelectorAll('button');
    
    allButtons.forEach((button) => {
      const text = button.textContent || button.innerText;
      if (text.includes('اتصل الآن') || text.includes('Call Now') || text.includes('Şimdi Ara') ||
          text.includes('إرسال رسالة') || text.includes('Send Message') || text.includes('Mesaj Gönder') ||
          text.includes('واتساب') || text.includes('WhatsApp') ||
          text.includes('مشاركة العقار') || text.includes('Share Property') || text.includes('Mülkü Paylaş')) {
        
        let buttonType = 'unknown';
        if (text.includes('اتصل الآن') || text.includes('Call Now') || text.includes('Şimdi Ara')) {
          buttonType = 'call';
        } else if (text.includes('إرسال رسالة') || text.includes('Send Message') || text.includes('Mesaj Gönder')) {
          buttonType = 'email';
        } else if (text.includes('واتساب') || text.includes('WhatsApp')) {
          buttonType = 'whatsapp';
        } else if (text.includes('مشاركة العقار') || text.includes('Share Property') || text.includes('Mülkü Paylaş')) {
          buttonType = 'share';
        }
        
        contactButtons.push({
          element: button,
          text: text.trim(),
          type: buttonType
        });
      }
    });
    
    console.log(`🔍 Found ${contactButtons.length} contact buttons`);
    
    // Expected styling for call button (should match reference design)
    const expectedCallStyling = {
      height: '48px', // h-12
      borderRadius: '12px', // rounded-xl
      background: 'linear-gradient(135deg, rgb(236, 72, 154) 0%, rgb(244, 63, 94) 100%)', // gradient
      color: 'rgb(255, 255, 255)', // text-white
      fontWeight: '600' // font-semibold
    };
    
    contactButtons.forEach((btn, index) => {
      console.log(`\n🔍 ${btn.type.toUpperCase()} Button ${index + 1}:`);
      console.log('   Text:', btn.text);
      
      const computedStyle = getComputedStyle(btn.element);
      const classList = Array.from(btn.element.classList);
      
      console.log('   Classes:', classList.join(' '));
      
      // Special focus on call button (should match reference design)
      if (btn.type === 'call') {
        console.log('   🎯 CALL BUTTON - Should match reference design:');
        
        // Check height
        const height = computedStyle.height;
        console.log('   Height:', height);
        if (height === expectedCallStyling.height || height === '3rem') {
          console.log('   ✅ CORRECT: Height is 48px (h-12)');
        } else {
          console.log('   ❌ INCORRECT: Height should be 48px, got', height);
        }
        
        // Check border radius
        const borderRadius = computedStyle.borderRadius;
        console.log('   Border Radius:', borderRadius);
        if (borderRadius === expectedCallStyling.borderRadius || borderRadius === '12px' || borderRadius === '0.75rem') {
          console.log('   ✅ CORRECT: Border radius is 12px (rounded-xl)');
        } else {
          console.log('   ❌ INCORRECT: Border radius should be 12px, got', borderRadius);
        }
        
        // Check background
        const background = computedStyle.background || computedStyle.backgroundImage;
        console.log('   Background:', background);
        if (background.includes('linear-gradient') && 
            (background.includes('#ec489a') || background.includes('236, 72, 154')) &&
            (background.includes('#f43f5e') || background.includes('244, 63, 94'))) {
          console.log('   ✅ CORRECT: Has gradient background');
        } else {
          console.log('   ❌ INCORRECT: Should have gradient background');
        }
        
        // Check text color
        const color = computedStyle.color;
        console.log('   Text Color:', color);
        if (color === expectedCallStyling.color || color === 'rgb(255, 255, 255)' || color === 'white') {
          console.log('   ✅ CORRECT: Text color is white');
        } else {
          console.log('   ❌ INCORRECT: Text color should be white, got', color);
        }
        
        // Check font weight
        const fontWeight = computedStyle.fontWeight;
        console.log('   Font Weight:', fontWeight);
        if (fontWeight === expectedCallStyling.fontWeight || fontWeight === '600' || fontWeight === 'bold') {
          console.log('   ✅ CORRECT: Font weight is semibold/600');
        } else {
          console.log('   ❌ INCORRECT: Font weight should be 600, got', fontWeight);
        }
        
        // Check box shadow
        const boxShadow = computedStyle.boxShadow;
        console.log('   Box Shadow:', boxShadow);
        if (boxShadow && boxShadow !== 'none') {
          console.log('   ✅ CORRECT: Has box shadow');
        } else {
          console.log('   ❌ INCORRECT: Should have box shadow');
        }
        
        // Check for required classes
        const requiredClasses = ['w-full', 'h-12', 'rounded-xl', 'text-white', 'font-semibold', 'shadow-lg'];
        const missingClasses = requiredClasses.filter(cls => !classList.includes(cls));
        
        if (missingClasses.length === 0) {
          console.log('   ✅ CORRECT: All required classes present');
        } else {
          console.log('   ❌ INCORRECT: Missing classes:', missingClasses);
        }
        
        // Check for hover effects
        const hasHoverClasses = classList.some(cls => 
          cls.includes('hover:') || cls.includes('transition') || cls.includes('transform')
        );
        
        if (hasHoverClasses) {
          console.log('   ✅ CORRECT: Has hover effects');
        } else {
          console.log('   ❌ INCORRECT: Should have hover effects');
        }
        
        // Check for phone icon
        const phoneIcon = btn.element.querySelector('svg');
        if (phoneIcon) {
          console.log('   ✅ CORRECT: Has phone icon');
        } else {
          console.log('   ⚠️ No phone icon found');
        }
        
      } else {
        // For other buttons, just show their current styling
        console.log('   📊 Current styling:');
        console.log('     Height:', computedStyle.height);
        console.log('     Border Radius:', computedStyle.borderRadius);
        console.log('     Background:', computedStyle.background || computedStyle.backgroundColor);
        console.log('     Text Color:', computedStyle.color);
        console.log('     Font Weight:', computedStyle.fontWeight);
        console.log('     Box Shadow:', computedStyle.boxShadow);
      }
      
      // Highlight button for visual identification
      const highlightColor = btn.type === 'call' ? 'red' : 
                           btn.type === 'email' ? 'blue' : 
                           btn.type === 'whatsapp' ? 'green' : 'orange';
      
      btn.element.style.outline = `3px solid ${highlightColor}`;
      btn.element.style.outlineOffset = '2px';
      setTimeout(() => {
        btn.element.style.outline = '';
        btn.element.style.outlineOffset = '';
      }, 8000);
    });
    
    // Expected visual appearance for call button
    console.log('\n🎨 Expected Call Button Appearance:');
    console.log('===================================');
    console.log('📏 Height: 48px (h-12)');
    console.log('🔄 Border Radius: 12px (rounded-xl)');
    console.log('🎨 Background: Pink to red gradient');
    console.log('📝 Text: White color, semibold weight');
    console.log('💫 Shadow: Drop shadow (shadow-lg)');
    console.log('📞 Icon: Phone icon with white color');
    console.log('✨ Hover: Scale up slightly, brightness change');
    console.log('⚡ Transition: Smooth 300ms animation');
    
    // Summary
    console.log('\n🎉 Test Summary:');
    console.log('================');
    
    const callButton = contactButtons.find(btn => btn.type === 'call');
    
    if (callButton) {
      const computedStyle = getComputedStyle(callButton.element);
      const classList = Array.from(callButton.element.classList);
      
      const hasCorrectHeight = computedStyle.height === '48px' || computedStyle.height === '3rem';
      const hasCorrectRadius = computedStyle.borderRadius === '12px' || computedStyle.borderRadius === '0.75rem';
      const hasGradient = (computedStyle.background || computedStyle.backgroundImage).includes('linear-gradient');
      const hasWhiteText = computedStyle.color === 'rgb(255, 255, 255)' || computedStyle.color === 'white';
      const hasShadow = computedStyle.boxShadow && computedStyle.boxShadow !== 'none';
      
      if (hasCorrectHeight && hasCorrectRadius && hasGradient && hasWhiteText && hasShadow) {
        console.log('✅ CALL BUTTON TESTS PASSED!');
        console.log('✅ Call button matches reference design');
        console.log('✅ Ready for user interaction');
      } else {
        console.log('❌ CALL BUTTON TESTS FAILED!');
        console.log('⚠️ Check the detailed results above');
        
        if (!hasCorrectHeight) console.log('❌ Height issue');
        if (!hasCorrectRadius) console.log('❌ Border radius issue');
        if (!hasGradient) console.log('❌ Gradient background issue');
        if (!hasWhiteText) console.log('❌ Text color issue');
        if (!hasShadow) console.log('❌ Shadow issue');
      }
    } else {
      console.log('⚠️ NO CALL BUTTON FOUND');
      console.log('💡 Navigate to a property page to test');
    }
    
    console.log('\n🔍 Button highlights:');
    console.log('🔴 Red outline = Call button');
    console.log('🔵 Blue outline = Email button');
    console.log('🟢 Green outline = WhatsApp button');
    console.log('🟠 Orange outline = Share button');
    console.log('💡 Highlights last for 8 seconds');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Auto-run the test
testContactButtonStyling();

// Also provide manual trigger
window.testContactButtonStyling = testContactButtonStyling;
