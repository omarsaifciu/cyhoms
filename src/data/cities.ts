
export interface District {
  arabic: string;
  turkish: string;
  english: string;
}

export interface City {
  arabic: string;
  turkish: string;
  english: string;
  districts: District[];
}

export const cyprusCities: City[] = [
  {
    arabic: "لفكوشا",
    turkish: "Lefkoşa",
    english: "Nicosia",
    districts: [
      { arabic: "هاسبولات", turkish: "Haspolat", english: "Haspolat" },
      { arabic: "أورطاكوي", turkish: "Ortaköy", english: "Ortaköy" },
      { arabic: "كوتشوك كايماكلي", turkish: "Küçük Kaymaklı", english: "Kucuk Kaymakli" },
      { arabic: "غونيلي", turkish: "Gönyeli", english: "Gonyeli" },
      { arabic: "ينيكنت", turkish: "Yenikent", english: "Yenikent" },
      { arabic: "حميدكوي", turkish: "Hamitköy", english: "Hamitkoy" },
      { arabic: "طاشكنكوي", turkish: "Taşkınköy", english: "Taskinkoy" },
      { arabic: "مرمرة", turkish: "Marmara", english: "Marmara" },
      { arabic: "كوشكلو جفتلك", turkish: "Köşklüçiftlik", english: "Koshkluchiftlik" },
      { arabic: "ينيشهير", turkish: "Yenişehir", english: "Yenişehir" },
      { arabic: "دملوبينار", turkish: "Dumlupınar", english: "Dumlupinar" }
    ]
  },
  {
    arabic: "غيرنه",
    turkish: "Girne",
    english: "Kyrenia",
    districts: [
      { arabic: "غيرنه المركز", turkish: "Girne Merkez", english: "Central Girne" },
      { arabic: "كاراأوغولان أوغلو", turkish: "Karaoğlanoğlu", english: "Karaoglanoglu" },
      { arabic: "ألسانجاك", turkish: "Alsancak", english: "Alsancak" },
      { arabic: "لابتة", turkish: "Lapta", english: "Lapta" },
      { arabic: "زيتينليك", turkish: "Zeytinlik", english: "Zeytinlik" },
      { arabic: "بيلاپيس", turkish: "Bellapais", english: "Bellapais" },
      { arabic: "أوزانكوي", turkish: "Ozanköy", english: "Ozankoy" },
      { arabic: "دوغانكوي", turkish: "Doğanköy", english: "Dogankoy" },
      { arabic: "تشاتال كوي", turkish: "Çatalköy", english: "Catalkoy" },
      { arabic: "كرمى", turkish: "Karaman", english: "Karaman" },
      { arabic: "أسان تيبيه", turkish: "Aşağı Girne", english: "Lower Girne" }
    ]
  },
  {
    arabic: "غازي ماغوسا",
    turkish: "Gazimağusa",
    english: "Famagusta",
    districts: [
      { arabic: "ماغوسا المركز", turkish: "Mağusa Merkez", english: "Central Famagusta" },
      { arabic: "سكاريا", turkish: "Sakarya", english: "Sakarya" },
      { arabic: "توزلا", turkish: "Tuzla", english: "Tuzla" },
      { arabic: "كانبولات", turkish: "Canbulat", english: "Canbulat" },
      { arabic: "سالاميس", turkish: "Salamis", english: "Salamis" },
      { arabic: "يني بوغازيتشي", turkish: "Yeniboğaziçi", english: "Yeni Bogazici" },
      { arabic: "غولسرين", turkish: "Gülseren", english: "Gulseren" },
      { arabic: "بايكال", turkish: "Baykal", english: "Baykal" },
      { arabic: "دملوبينار", turkish: "Dumlupınar", english: "Dumlupinar" },
      { arabic: "منطقة الجامعة", turkish: "DAÜ Civarı", english: "Near East University Area" }
    ]
  },
  {
    arabic: "غوزيليورت",
    turkish: "Güzelyurt",
    english: "Morphou",
    districts: [
      { arabic: "غوزيليورت المركز", turkish: "Güzelyurt Merkez", english: "Central Morphou" },
      { arabic: "بوستانجي", turkish: "Bostancı", english: "Bostanci" },
      { arabic: "أيدن كوي", turkish: "Aydınköy", english: "Aydinkoy" },
      { arabic: "يدي دالغا", turkish: "Yedidalga", english: "Yedidalga" },
      { arabic: "غازي فيرن", turkish: "Gaziveren", english: "Gaziveren" },
      { arabic: "جيميكوناغي", turkish: "Gemikonağı", english: "Gemikonagi" },
      { arabic: "دوغانجي", turkish: "Doğancı", english: "Doganci" }
    ]
  },
  {
    arabic: "إسكيليه",
    turkish: "İskele",
    english: "Iskele",
    districts: [
      { arabic: "إسكليه المركز", turkish: "İskele Merkez", english: "Central Iskele" },
      { arabic: "لونغ بيتش", turkish: "Long Beach", english: "Long Beach" },
      { arabic: "بوغاز", turkish: "Boğaz", english: "Bogaz" },
      { arabic: "بافرا", turkish: "Bafra", english: "Bafra" },
      { arabic: "يني إرينكوي", turkish: "Yenierenköy", english: "Yeni Erenkoy" },
      { arabic: "توبجوكوي", turkish: "Topçuköy", english: "Topcukoy" },
      { arabic: "كانتارا", turkish: "Kantara", english: "Kantara" }
    ]
  },
  {
    arabic: "كارباز",
    turkish: "Karpaz",
    english: "Karpasia",
    districts: [
      { arabic: "ديب كارباز", turkish: "Dipkarpaz", english: "Dipkarpaz" },
      { arabic: "كالي بورنو", turkish: "Zafer Burnu", english: "Cape Apostolos Andreas" },
      { arabic: "بالالان", turkish: "Balalan", english: "Balalan" },
      { arabic: "أفتيبه", turkish: "Avtepe", english: "Avtepe" },
      { arabic: "جيلينجيك", turkish: "Gelincik", english: "Gelincik" },
      { arabic: "سيفاي", turkish: "Siphai", english: "Siphai" },
      { arabic: "كوتشوك إرينكوي", turkish: "Küçük Erenköy", english: "Kucuk Erenkoy" }
    ]
  }
];

export type Language = 'ar' | 'en' | 'tr';

export const getAllCities = (language: Language = 'ar'): string[] => {
  console.log('getAllCities called with language:', language);
  
  const allText = language === 'ar' ? "الكل" : language === 'en' ? "All" : "Tümü";
  const cities: string[] = [allText];
  
  cyprusCities.forEach(city => {
    let cityName: string = '';
    
    if (language === 'ar') {
      cityName = city.arabic;
    } else if (language === 'en') {
      cityName = city.english;
    } else if (language === 'tr') {
      cityName = city.turkish;
    }
    
    console.log('Processing city:', cityName, 'for language:', language);
    if (cityName) {
      cities.push(cityName);
    }
  });
  
  console.log('getAllCities final result:', cities);
  return cities;
};

export const getAllDistricts = (language: Language = 'ar'): string[] => {
  const allText = language === 'ar' ? "الكل" : language === 'en' ? "All" : "Tümü";
  const allDistricts: string[] = [allText];
  cyprusCities.forEach(city => {
    city.districts.forEach(district => {
      let districtName: string = '';
      
      if (language === 'ar') {
        districtName = district.arabic;
      } else if (language === 'en') {
        districtName = district.english;
      } else if (language === 'tr') {
        districtName = district.turkish;
      }
      
      if (districtName) {
        allDistricts.push(districtName);
      }
    });
  });
  return allDistricts;
};

export const getDistrictsByCity = (cityName: string, language: Language = 'ar'): string[] => {
  console.log('getDistrictsByCity called with:', { cityName, language });
  
  const allText = language === 'ar' ? "الكل" : language === 'en' ? "All" : "Tümü";
  
  if (cityName === allText || cityName === "الكل" || cityName === "All" || cityName === "Tümü") {
    console.log('Returning [allText] for all cities');
    return [allText];
  }
  
  const city = cyprusCities.find(city => 
    city.arabic === cityName || city.english === cityName || city.turkish === cityName
  );
  
  console.log('Found city:', city);
  
  if (!city) {
    console.log('No city found, returning [allText]');
    return [allText];
  }
  
  const districts: string[] = [allText];
  city.districts.forEach(district => {
    let districtName: string = '';
    
    if (language === 'ar') {
      districtName = district.arabic;
    } else if (language === 'en') {
      districtName = district.english;
    } else if (language === 'tr') {
      districtName = district.turkish;
    }
    
    if (districtName) {
      districts.push(districtName);
    }
  });
  
  console.log('Returning districts:', districts);
  return districts;
};
