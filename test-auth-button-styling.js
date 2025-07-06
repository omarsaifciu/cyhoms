// Test script to verify auth buttons have consistent styling
// Run this in browser console

console.log('🔧 Testing Auth Button Styling...');

const testAuthButtonStyling = () => {
  try {
    // Find auth buttons
    const authButtons = [];
    
    // Look for login and signup buttons
    const allButtons = document.querySelectorAll('button[type="submit"]');
    
    allButtons.forEach((button) => {
      const text = button.textContent || button.innerText;
      if (text.includes('تسجيل الدخول') || text.includes('Login') || text.includes('Giriş Yap') ||
          text.includes('إنشاء حساب') || text.includes('Sign Up') || text.includes('Kayıt Ol')) {
        authButtons.push({
          element: button,
          text: text.trim(),
          type: text.includes('تسجيل الدخول') || text.includes('Login') || text.includes('Giriş Yap') ? 'login' : 'signup'
        });
      }
    });
    
    console.log(`🔍 Found ${authButtons.length} auth buttons`);
    
    // Expected styling properties
    const expectedStyling = {
      height: '48px', // h-12
      borderRadius: '12px', // rounded-xl
      background: 'linear-gradient(135deg, rgb(236, 72, 154) 0%, rgb(244, 63, 94) 100%)', // gradient
      color: 'rgb(255, 255, 255)', // text-white
      fontWeight: '600', // font-semibold
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px' // shadow-lg
    };
    
    authButtons.forEach((btn, index) => {
      console.log(`\n🔍 ${btn.type.toUpperCase()} Button ${index + 1}:`);
      console.log('   Text:', btn.text);
      
      const computedStyle = getComputedStyle(btn.element);
      const classList = Array.from(btn.element.classList);
      
      console.log('   Classes:', classList.join(' '));
      
      // Check height
      const height = computedStyle.height;
      console.log('   Height:', height);
      if (height === expectedStyling.height || height === '3rem') {
        console.log('   ✅ CORRECT: Height is 48px (h-12)');
      } else {
        console.log('   ❌ INCORRECT: Height should be 48px, got', height);
      }
      
      // Check border radius
      const borderRadius = computedStyle.borderRadius;
      console.log('   Border Radius:', borderRadius);
      if (borderRadius === expectedStyling.borderRadius || borderRadius === '12px' || borderRadius === '0.75rem') {
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
      if (color === expectedStyling.color || color === 'rgb(255, 255, 255)' || color === 'white') {
        console.log('   ✅ CORRECT: Text color is white');
      } else {
        console.log('   ❌ INCORRECT: Text color should be white, got', color);
      }
      
      // Check font weight
      const fontWeight = computedStyle.fontWeight;
      console.log('   Font Weight:', fontWeight);
      if (fontWeight === expectedStyling.fontWeight || fontWeight === '600' || fontWeight === 'bold') {
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
      
      // Highlight button for visual identification
      btn.element.style.outline = '3px solid gold';
      btn.element.style.outlineOffset = '2px';
      setTimeout(() => {
        btn.element.style.outline = '';
        btn.element.style.outlineOffset = '';
      }, 8000);
    });
    
    // Check for consistency between login and signup buttons
    console.log('\n🔄 Consistency Check:');
    console.log('====================');
    
    if (authButtons.length >= 2) {
      const loginButton = authButtons.find(btn => btn.type === 'login');
      const signupButton = authButtons.find(btn => btn.type === 'signup');
      
      if (loginButton && signupButton) {
        const loginStyle = getComputedStyle(loginButton.element);
        const signupStyle = getComputedStyle(signupButton.element);
        
        const styleProperties = ['height', 'borderRadius', 'background', 'color', 'fontWeight'];
        let consistent = true;
        
        styleProperties.forEach(prop => {
          if (loginStyle[prop] !== signupStyle[prop]) {
            console.log(`❌ INCONSISTENT: ${prop} differs between login and signup`);
            console.log(`   Login: ${loginStyle[prop]}`);
            console.log(`   Signup: ${signupStyle[prop]}`);
            consistent = false;
          }
        });
        
        if (consistent) {
          console.log('✅ CONSISTENT: Login and signup buttons have matching styles');
        }
      }
    }
    
    // Expected visual appearance
    console.log('\n🎨 Expected Visual Appearance:');
    console.log('==============================');
    console.log('📏 Height: 48px (h-12)');
    console.log('🔄 Border Radius: 12px (rounded-xl)');
    console.log('🎨 Background: Pink to red gradient');
    console.log('📝 Text: White color, semibold weight');
    console.log('💫 Shadow: Drop shadow (shadow-lg)');
    console.log('✨ Hover: Scale up slightly, brightness change');
    console.log('⚡ Transition: Smooth 300ms animation');
    
    // Summary
    console.log('\n🎉 Test Summary:');
    console.log('================');
    
    let allCorrect = true;
    
    authButtons.forEach((btn) => {
      const computedStyle = getComputedStyle(btn.element);
      const classList = Array.from(btn.element.classList);
      
      const hasCorrectHeight = computedStyle.height === '48px' || computedStyle.height === '3rem';
      const hasCorrectRadius = computedStyle.borderRadius === '12px' || computedStyle.borderRadius === '0.75rem';
      const hasGradient = (computedStyle.background || computedStyle.backgroundImage).includes('linear-gradient');
      const hasWhiteText = computedStyle.color === 'rgb(255, 255, 255)' || computedStyle.color === 'white';
      const hasShadow = computedStyle.boxShadow && computedStyle.boxShadow !== 'none';
      
      if (!hasCorrectHeight || !hasCorrectRadius || !hasGradient || !hasWhiteText || !hasShadow) {
        allCorrect = false;
      }
    });
    
    if (allCorrect && authButtons.length > 0) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('✅ Auth buttons have consistent styling');
      console.log('✅ Matches the reference button design');
    } else if (authButtons.length === 0) {
      console.log('⚠️ NO AUTH BUTTONS FOUND');
      console.log('💡 Navigate to login or signup page to test');
    } else {
      console.log('❌ SOME TESTS FAILED!');
      console.log('⚠️ Check the detailed results above');
    }
    
    console.log('\n🔍 Buttons highlighted in gold for 8 seconds');
    console.log('💡 Test on both login and signup pages');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Auto-run the test
testAuthButtonStyling();

// Also provide manual trigger
window.testAuthButtonStyling = testAuthButtonStyling;
