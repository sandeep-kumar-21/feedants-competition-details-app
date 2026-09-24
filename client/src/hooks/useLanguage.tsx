import { useState, createContext, useContext, ReactNode } from 'react';

export type Language = 'ENG' | 'HIN';

const translations = {
  ENG: {
    goBack: 'Go back',
    winnersGetCert: 'Winners get certificate',
    prizePool: 'Prize Pool',
    entryFee: 'Entry Fee',
    spotsLeft: 'Only {count} spots left',
    booked: '{booked} / {total} Booked',
    judge: 'Judge',
    introVideo: 'Intro Video',
    registrationClosesIn: 'Registration closes in',
    hurryUp: 'Hurry up!',
    importantDates: 'Important Dates',
    registerBefore: 'Register Before',
    submissionStarts: 'Submission Starts',
    submissionEnds: 'Submission Ends',
    resultDate: 'Result Date',
    previousWinners: 'Previous Winners',
    aboutTab: 'About Competition',
    judgingTab: 'Judging Parameters',
    rulesTab: 'Rules & Eligibility',
    viewMore: 'View more',
    viewLess: 'View less',
    rewardsTitle: 'Rewards',
    allPositions: '(All Positions)',
    disclaimer: 'Disclaimer: Only contributions from paid participants will be considered for judging.',
    howReceivePrize: 'How will you receive prize money?',
    watchVideoMore: 'Watch video to know more',
    refundPolicy: 'Refund policy',
    securePayments: 'Secure payments powered by',
    referAndEarn: 'Refer & Earn more discount',
    referEarnDesc: 'You earn ₹10 for every signup',
    copyLink: 'Copy Link',
    copied: 'Copied!',
    referNow: 'Refer Now',
    hearFromUsers: 'Hear From Our Users',
    hearUsersDesc: 'See what participants say about Feedants',
    adHere: 'Ad Here',
    uploadSubmission: 'Upload Submission',
    registeredBadge: 'Registered',
    payAndRegister: 'Pay {fee} & Register',
    competitionFull: 'Competition Full',
    registrationClosed: 'Registration Closed',
    viewSubmission: 'View Submission (Submitted)',
    switchAccount: 'Switch Demo User',
  },
  HIN: {
    goBack: 'वापस जाएं',
    winnersGetCert: 'विजेताओं को प्रमाणपत्र मिलेगा',
    prizePool: 'पुरस्कार राशि',
    entryFee: 'प्रवेश शुल्क',
    spotsLeft: 'केवल {count} स्थान शेष',
    booked: '{booked} / {total} बुक किए गए',
    judge: 'निर्णायक',
    introVideo: 'परिचय वीडियो',
    registrationClosesIn: 'पंजीकरण समाप्त होने में',
    hurryUp: 'जल्दी करें!',
    importantDates: 'महत्वपूर्ण तिथियां',
    registerBefore: 'पंजीकरण अंतिम तिथि',
    submissionStarts: 'सबमिशन प्रारंभ',
    submissionEnds: 'सबमिशन समाप्त',
    resultDate: 'परिणाम तिथि',
    previousWinners: 'पिछले विजेता',
    aboutTab: 'प्रतियोगिता के बारे में',
    judgingTab: 'मूल्यांकन पैरामीटर',
    rulesTab: 'नियम और पात्रता',
    viewMore: 'और देखें',
    viewLess: 'कम देखें',
    rewardsTitle: 'पुरस्कार',
    allPositions: '(सभी पद)',
    disclaimer: 'अस्वीकरण: केवल सशुल्क प्रतिभागियों के योगदान पर ही निर्णय लिया जाएगा।',
    howReceivePrize: 'पुरस्कार राशि कैसे मिलेगी?',
    watchVideoMore: 'अधिक जानने के लिए वीडियो देखें',
    refundPolicy: 'वापसी नीति',
    securePayments: 'सुरक्षित भुगतान द्वारा',
    referAndEarn: 'रेफर करें और छूट पाएं',
    referEarnDesc: 'प्रत्येक साइनअप पर ₹10 पाएं',
    copyLink: 'लिंक कॉपी करें',
    copied: 'कॉपी हो गया!',
    referNow: 'अभी रेफर करें',
    hearFromUsers: 'हमारे उपयोगकर्ताओं से सुनें',
    hearUsersDesc: 'देखें प्रतिभागी क्या कहते हैं',
    adHere: 'विज्ञापन यहां',
    uploadSubmission: 'सबमिशन अपलोड करें',
    registeredBadge: 'पंजीकृत',
    payAndRegister: '{fee} भुगतान कर पंजीकरण करें',
    competitionFull: 'प्रतियोगिता पूर्ण',
    registrationClosed: 'पंजीकरण समाप्त',
    viewSubmission: 'सबमिशन देखें (जमा किया गया)',
    switchAccount: 'डेमो उपयोगकर्ता बदलें',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.ENG, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'ENG',
  setLanguage: () => {},
  t: (key) => translations.ENG[key] || key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ENG');

  const t = (key: keyof typeof translations.ENG, params?: Record<string, string | number>): string => {
    let str = translations[language][key] || translations.ENG[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, String(v));
      });
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

