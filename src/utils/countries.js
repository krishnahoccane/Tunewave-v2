/**
 * Country list for phone input: dial code + flag.
 * Dial code is stored without "+".
 */
export const COUNTRY_LIST = [
  { code: "91", name: "India", flag: "🇮🇳" },
  { code: "1", name: "United States", flag: "🇺🇸" },
  { code: "44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "61", name: "Australia", flag: "🇦🇺" },
  { code: "81", name: "Japan", flag: "🇯🇵" },
  { code: "86", name: "China", flag: "🇨🇳" },
  { code: "49", name: "Germany", flag: "🇩🇪" },
  { code: "33", name: "France", flag: "🇫🇷" },
  { code: "39", name: "Italy", flag: "🇮🇹" },
  { code: "34", name: "Spain", flag: "🇪🇸" },
  { code: "31", name: "Netherlands", flag: "🇳🇱" },
  { code: "55", name: "Brazil", flag: "🇧🇷" },
  { code: "52", name: "Mexico", flag: "🇲🇽" },
  { code: "7", name: "Russia", flag: "🇷🇺" },
  { code: "82", name: "South Korea", flag: "🇰🇷" },
  { code: "65", name: "Singapore", flag: "🇸🇬" },
  { code: "971", name: "UAE", flag: "🇦🇪" },
  { code: "966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "27", name: "South Africa", flag: "🇿🇦" },
  { code: "234", name: "Nigeria", flag: "🇳🇬" },
  { code: "254", name: "Kenya", flag: "🇰🇪" },
  { code: "20", name: "Egypt", flag: "🇪🇬" },
  { code: "212", name: "Morocco", flag: "🇲🇦" },
  { code: "62", name: "Indonesia", flag: "🇮🇩" },
  { code: "60", name: "Malaysia", flag: "🇲🇾" },
  { code: "63", name: "Philippines", flag: "🇵🇭" },
  { code: "84", name: "Vietnam", flag: "🇻🇳" },
  { code: "66", name: "Thailand", flag: "🇹🇭" },
  { code: "64", name: "New Zealand", flag: "🇳🇿" },
  { code: "358", name: "Finland", flag: "🇫🇮" },
  { code: "46", name: "Sweden", flag: "🇸🇪" },
  { code: "47", name: "Norway", flag: "🇳🇴" },
  { code: "45", name: "Denmark", flag: "🇩🇰" },
  { code: "353", name: "Ireland", flag: "🇮🇪" },
  { code: "48", name: "Poland", flag: "🇵🇱" },
  { code: "90", name: "Turkey", flag: "🇹🇷" },
  { code: "92", name: "Pakistan", flag: "🇵🇰" },
  { code: "880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "977", name: "Nepal", flag: "🇳🇵" },
];

export const getCountryByCode = (code) =>
  COUNTRY_LIST.find((c) => c.code === String(code)) || COUNTRY_LIST[0];
