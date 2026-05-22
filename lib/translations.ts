type Language = "en" | "hi" | "mr";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

export const translations: Translations = {
  en: {
    "welcome_back": "Welcome Back",
    "sign_in": "Sign in to your account to continue",
    "email": "Email",
    "password": "Password",
    "remember_me": "Remember me",
    "sign_in_button": "Sign In",
    "no_account": "Don't have an account?",
    "create_account": "Create Account",
    "create_business": "Create Your Business Account",
    "setup_whatsapp": "Set up WhatsApp automation for your business",
    "business_name": "Business Name",
    "confirm_password": "Confirm Password",
    "create_account_button": "Create Account",
    "already_have_account": "Already have account?",
    "terms": "Terms of Service",
    "by_signing": "By signing up, you agree to our",
    "day_free": "30-Day Free",
    "no_card": "No Card Needed",
    "per_month": "/month",
    "get_started": "Get Started",
  },
  hi: {
    "welcome_back": "स्वागत है",
    "sign_in": "अपने खाते में साइन इन करें",
    "email": "ईमेल",
    "password": "पासवर्ड",
    "remember_me": "मुझे याद रखें",
    "sign_in_button": "साइन इन करें",
    "no_account": "खाता नहीं है?",
    "create_account": "खाता बनाएं",
    "create_business": "अपना व्यवसाय खाता बनाएं",
    "setup_whatsapp": "अपने व्यवसाय के लिए WhatsApp ऑटोमेशन सेट करें",
    "business_name": "व्यवसाय का नाम",
    "confirm_password": "पासवर्ड की पुष्टि करें",
    "create_account_button": "खाता बनाएं",
    "already_have_account": "पहले से खाता है?",
    "terms": "सेवा की शर्तें",
    "by_signing": "साइन अप करके, आप हमारे सहमत हैं",
    "day_free": "30 दिन मुफ्त",
    "no_card": "कोई कार्ड की जरूरत नहीं",
    "per_month": "/महीना",
    "get_started": "शुरु करें",
  },
  mr: {
    "welcome_back": "स्वागत आहे",
    "sign_in": "तुमच्या खात्यात साइन इन करा",
    "email": "ईमेल",
    "password": "पासवर्ड",
    "remember_me": "मला आठव रठा",
    "sign_in_button": "साइन इन करा",
    "no_account": "खाता नाही?",
    "create_account": "खाता तयार करा",
    "create_business": "तुमचे व्यवसाय खाते तयार करा",
    "setup_whatsapp": "तुमच्या व्यवसायासाठी WhatsApp ऑटोमेशन सेट करा",
    "business_name": "व्यवसायाचे नाव",
    "confirm_password": "पासवर्ड पुष्टी करा",
    "create_account_button": "खाता तयार करा",
    "already_have_account": "आधीच खाता आहे?",
    "terms": "सेवेचे अटी",
    "by_signing": "साइन अप करून, तुम्ही आमच्याशी सहमत आहात",
    "day_free": "३० दिन विनामूल्य",
    "no_card": "कार्ड आवश्यक नाही",
    "per_month": "/महीना",
    "get_started": "सुरु करा",
  }
};

export function getTranslation(language: Language, key: string): string {
  return translations[language]?.[key] || translations.en[key] || key;
}
