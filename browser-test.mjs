import puppeteer from 'puppeteer';

(async () => {
  console.log("🤖 AI: Browser launch kar raha hoon...");
  
  // Launching browser in non-headless mode so the user can see it
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  console.log("🤖 AI: https://astroguru.sitekraft.dev/ par ja raha hoon...");
  await page.goto('https://astroguru.sitekraft.dev/', { waitUntil: 'networkidle2' });
  
  console.log("🤖 AI: Website load ho gayi hai. Page title:", await page.title());
  
  try {
    // Attempting to find a generic sign-in or login button
    console.log("🤖 AI: Sign In button dhoondh raha hoon...");
    
    // Waiting a bit to let Clerk initialize
    await new Promise(r => setTimeout(r, 3000));

    const signInButton = await page.$('button, a').then(async () => {
      // Find a button containing "Sign In" or "Login"
      const elements = await page.$$('button, a');
      for (let el of elements) {
        const text = await page.evaluate(e => e.textContent, el);
        if (text && (text.includes('Sign In') || text.includes('Login') || text.includes('Get Started'))) {
          return el;
        }
      }
      return null;
    });

    if (signInButton) {
      console.log("🤖 AI: Button mil gaya! Click kar raha hoon...");
      await signInButton.click();
      await new Promise(r => setTimeout(r, 3000));
      console.log("🤖 AI: Clerk ka login popup khul gaya hoga.");
      console.log("⚠️ IMPORTANT: Clerk (Authentication) me bot-protection hoti hai. Agar Captcha aaye toh kripya aap manually solve kar dein taaki main aage badh sakun.");
    } else {
      console.log("🤖 AI: Sign In button directly nahi mila, shayad pehle se logged in hain ya UI different hai.");
    }

  } catch (error) {
    console.log("🤖 AI: Error aayi:", error.message);
  }

  // Keeping the browser open for 5 minutes so we can test together
  console.log("🤖 AI: Browser 5 minute ke liye open rahega. Aap aage ka flow manual try kar sakte hain, ya mujhe aur clicks karne ko bol sakte hain.");
  await new Promise(r => setTimeout(r, 300000));
  
  await browser.close();
})();
