import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const WEB_API_KEY = 'AIzaSyANVv6y3FoI0khY-PEnXFPfA3MidSzm5oQ';

async function testFirebaseSignup(email, password) {
  console.log(`Testing Firebase SignUp REST API for ${email}...`);

  // 1. Try Firebase Auth REST API signUp
  const signupRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${WEB_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });

  const signupJson = await signupRes.json();
  console.log('SignUp REST Result:', signupJson);

  if (signupJson.error?.message === 'EMAIL_EXISTS') {
    console.log('Email exists! Trying signIn REST API...');
    const signinRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const signinJson = await signinRes.json();
    console.log('SignIn REST Result:', signinJson);
  }
}

testFirebaseSignup('abc@gmail.com', '123456').catch(console.error);
