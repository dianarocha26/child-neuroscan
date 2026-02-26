export const HeroIllustration = () => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="200" cy="150" r="120" fill="#E0F2FE" opacity="0.5"/>
    <circle cx="200" cy="150" r="90" fill="#BAE6FD" opacity="0.6"/>

    <ellipse cx="200" cy="180" rx="60" ry="65" fill="#FDE68A"/>

    <circle cx="200" cy="140" r="45" fill="#FED7AA"/>

    <circle cx="185" cy="135" r="8" fill="#1F2937"/>
    <circle cx="215" cy="135" r="8" fill="#1F2937"/>
    <circle cx="187" cy="134" r="3" fill="#FFFFFF"/>
    <circle cx="217" cy="134" r="3" fill="#FFFFFF"/>

    <path d="M 185 155 Q 200 165 215 155" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none"/>

    <circle cx="170" cy="145" r="12" fill="#FCA5A5" opacity="0.6"/>
    <circle cx="230" cy="145" r="12" fill="#FCA5A5" opacity="0.6"/>

    <path d="M 140 200 Q 145 190 155 195" stroke="#0EA5E9" strokeWidth="8" strokeLinecap="round" fill="none"/>
    <path d="M 245 195 Q 255 190 260 200" stroke="#0EA5E9" strokeWidth="8" strokeLinecap="round" fill="none"/>

    <path d="M 160 110 Q 165 95 175 100" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <path d="M 225 100 Q 235 95 240 110" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" fill="none"/>

    <circle cx="320" cy="80" r="15" fill="#F472B6" opacity="0.7">
      <animate attributeName="cy" values="80;75;80" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="80" cy="100" r="12" fill="#A78BFA" opacity="0.7">
      <animate attributeName="cy" values="100;95;100" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="350" cy="200" r="10" fill="#34D399" opacity="0.7">
      <animate attributeName="cy" values="200;195;200" dur="3s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export const WelcomeIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="100" cy="100" r="80" fill="#DBEAFE"/>

    <circle cx="100" cy="90" r="35" fill="#FED7AA"/>

    <circle cx="88" cy="85" r="5" fill="#1F2937"/>
    <circle cx="112" cy="85" r="5" fill="#1F2937"/>

    <path d="M 85 100 Q 100 110 115 100" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

    <path d="M 60 120 Q 65 110 75 115 L 80 135 Q 70 140 60 135 Z" fill="#0EA5E9"/>
    <path d="M 140 115 Q 135 110 125 115 L 120 135 Q 130 140 140 135 Z" fill="#0EA5E9"/>

    <circle cx="75" cy="95" r="8" fill="#FCA5A5" opacity="0.5"/>
    <circle cx="125" cy="95" r="8" fill="#FCA5A5" opacity="0.5"/>
  </svg>
);

export const SuccessIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="100" cy="100" r="80" fill="#D1FAE5"/>

    <circle cx="100" cy="100" r="50" fill="#34D399"/>

    <path d="M 75 100 L 90 115 L 125 80" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

    <circle cx="160" cy="60" r="8" fill="#FBBF24" opacity="0.8">
      <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="40" cy="70" r="6" fill="#F472B6" opacity="0.8">
      <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="50" cy="140" r="7" fill="#A78BFA" opacity="0.8">
      <animate attributeName="r" values="7;11;7" dur="1.8s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export const EmptyStateIllustration = () => (
  <svg viewBox="0 0 300 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="150" cy="220" rx="100" ry="15" fill="#E5E7EB" opacity="0.5"/>

    <rect x="80" y="100" width="140" height="100" rx="12" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="3"/>

    <line x1="100" y1="130" x2="180" y2="130" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
    <line x1="100" y1="150" x2="160" y2="150" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
    <line x1="100" y1="170" x2="170" y2="170" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>

    <circle cx="150" cy="60" r="30" fill="#DBEAFE"/>
    <circle cx="150" cy="55" r="18" fill="#93C5FD"/>
    <circle cx="143" cy="52" r="4" fill="#1F2937"/>
    <circle cx="157" cy="52" r="4" fill="#1F2937"/>
    <path d="M 143 62 Q 150 66 157 62" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none"/>

    <path d="M 130 70 Q 128 65 125 68" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M 175 68 Q 172 65 170 70" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" fill="none"/>
  </svg>
);

export const ThinkingIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="100" cy="110" r="60" fill="#FEF3C7"/>

    <circle cx="100" cy="100" r="40" fill="#FED7AA"/>

    <circle cx="88" cy="95" r="5" fill="#1F2937">
      <animate attributeName="cy" values="95;93;95" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="112" cy="95" r="5" fill="#1F2937">
      <animate attributeName="cy" values="95;93;95" dur="3s" repeatCount="indefinite"/>
    </circle>

    <ellipse cx="100" cy="108" rx="8" ry="5" fill="#1F2937" opacity="0.3"/>

    <circle cx="60" cy="50" r="12" fill="#E0E7FF" opacity="0.8">
      <animate attributeName="cy" values="50;45;50" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="45" cy="70" r="8" fill="#E0E7FF" opacity="0.6">
      <animate attributeName="cy" values="70;65;70" dur="2.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="35" cy="85" r="6" fill="#E0E7FF" opacity="0.4">
      <animate attributeName="cy" values="85;80;85" dur="3s" repeatCount="indefinite"/>
    </circle>

    <path d="M 65 55 Q 70 50 75 55 Q 80 50 85 55" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6">
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
    </path>
  </svg>
);

export const CelebrationIllustration = () => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="150" cy="150" r="100" fill="#FEF3C7" opacity="0.5"/>

    <circle cx="150" cy="160" r="50" fill="#FED7AA"/>
    <circle cx="150" cy="130" r="35" fill="#FED7AA"/>

    <circle cx="138" cy="125" r="6" fill="#1F2937"/>
    <circle cx="162" cy="125" r="6" fill="#1F2937"/>
    <path d="M 138 140 Q 150 155 162 140" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none"/>

    <path d="M 120 145 Q 115 135 110 140" stroke="#0EA5E9" strokeWidth="8" strokeLinecap="round" fill="none"/>
    <path d="M 190 140 Q 185 135 180 145" stroke="#0EA5E9" strokeWidth="8" strokeLinecap="round" fill="none"/>

    <circle cx="200" cy="80" r="6" fill="#FBBF24">
      <animate attributeName="cy" values="80;60;80" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="220" cy="100" r="5" fill="#F472B6">
      <animate attributeName="cy" values="100;80;100" dur="1.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="100" cy="80" r="6" fill="#34D399">
      <animate attributeName="cy" values="80;60;80" dur="1.1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="80" cy="95" r="5" fill="#A78BFA">
      <animate attributeName="cy" values="95;75;95" dur="1.3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="1.3s" repeatCount="indefinite"/>
    </circle>

    <path d="M 210 120 L 220 110 M 215 120 L 215 105" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round"/>
    <path d="M 90 120 L 80 110 M 85 120 L 85 105" stroke="#34D399" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const LoadingIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="100" cy="100" r="70" fill="#DBEAFE" opacity="0.3">
      <animate attributeName="r" values="70;75;70" dur="2s" repeatCount="indefinite"/>
    </circle>

    <circle cx="100" cy="100" r="40" fill="#93C5FD">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
    </circle>

    <circle cx="70" cy="100" r="10" fill="#0EA5E9">
      <animate attributeName="cy" values="100;90;100" dur="1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="100" cy="100" r="10" fill="#0EA5E9">
      <animate attributeName="cy" values="100;90;100" dur="1s" begin="0.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="130" cy="100" r="10" fill="#0EA5E9">
      <animate attributeName="cy" values="100;90;100" dur="1s" begin="0.4s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export const ErrorIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="100" cy="100" r="80" fill="#FEE2E2"/>

    <circle cx="100" cy="100" r="45" fill="#FED7AA"/>

    <circle cx="85" cy="95" r="5" fill="#1F2937">
      <animate attributeName="cy" values="95;97;95" dur="0.5s" repeatCount="1"/>
    </circle>
    <circle cx="115" cy="95" r="5" fill="#1F2937">
      <animate attributeName="cy" values="95;97;95" dur="0.5s" repeatCount="1"/>
    </circle>

    <path d="M 80 120 Q 100 110 120 120" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none"/>

    <path d="M 70 75 L 75 70 M 75 75 L 70 70" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
    <path d="M 125 70 L 130 75 M 125 75 L 130 70" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const MeditationIllustration = () => (
  <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="125" cy="125" r="100" fill="#E0E7FF" opacity="0.3">
      <animate attributeName="r" values="100;105;100" dur="4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite"/>
    </circle>

    <ellipse cx="125" cy="180" rx="40" ry="15" fill="#A78BFA" opacity="0.4"/>

    <circle cx="125" cy="100" r="30" fill="#FED7AA"/>

    <circle cx="115" cy="95" r="3" fill="#1F2937"/>
    <circle cx="135" cy="95" r="3" fill="#1F2937"/>

    <ellipse cx="125" cy="105" rx="6" ry="3" fill="#1F2937" opacity="0.4"/>

    <path d="M 95 130 Q 90 120 85 125 L 80 155 Q 90 160 95 150 Z" fill="#A78BFA"/>
    <path d="M 155 125 Q 160 120 165 125 L 170 155 Q 160 160 155 150 Z" fill="#A78BFA"/>

    <ellipse cx="125" cy="140" rx="25" ry="30" fill="#C4B5FD"/>
    <ellipse cx="125" cy="165" rx="35" ry="20" fill="#C4B5FD"/>

    <circle cx="180" cy="80" r="4" fill="#A78BFA" opacity="0.6">
      <animate attributeName="cy" values="80;75;80" dur="3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="70" cy="90" r="3" fill="#A78BFA" opacity="0.6">
      <animate attributeName="cy" values="90;85;90" dur="3.5s" repeatCount="indefinite"/>
    </circle>
  </svg>
);