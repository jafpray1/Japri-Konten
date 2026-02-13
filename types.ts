
export enum Audience {
  GENERAL = 'Umum',
  STUDENTS = 'Pelajar & Mahasiswa',
  OFFICE_WORKERS = 'Pekerja Kantoran',
  HOUSEWIVES = 'Ibu Rumah Tangga',
  GAMERS = 'Gamers',
  TECH_LOVERS = 'Pecinta Teknologi',
  FASHIONISTAS = 'Fashionista',
}

export enum Tone {
  FORMAL = 'Formal',
  CASUAL = 'Santai',
  PERSUASIVE = 'Persuasif',
  INFORMATIVE = 'Informatif',
  EMOTIONAL = 'Emosional',
  SLANG = 'Gaul',
}

export enum ScriptLength {
  SHORT = '200 Karakter',
  MEDIUM = '300 Karakter',
  LONG = '400 Karakter',
  XL = '500 Karakter',
  XXL = '600 Karakter',
}

export interface HookItem {
  type: string;
  content: string;
}

export interface GeneratedScript {
  hook: string;
  body: string;
  cta: string;
}

export enum VoiceActor {
  PUCK = 'Puck (Pria - Energik/TikTok)',
  KORE = 'Kore (Wanita - Hangat/Narasi)',
  FENRIR = 'Fenrir (Pria - Berat/Wibawa)',
  ZEPHYR = 'Zephyr (Wanita - Lembut/ASMR)',
  CHARON = 'Charon (Pria - Deep/Misterius)',
}

export enum SpeechStyle {
  HYPED = 'Hype & Viral (Cepat/Semangat)',
  STORYTELLER = 'Storytelling (Mengalir)',
  NEWS = 'Berita/Formal (Jelas)',
  SAD = 'Sedih/Emosional',
  WHISPER = 'Berbisik/Misterius',
  ANGRY = 'Tegas/Marah',
}

export enum SpeechSpeed {
  SLOW = 'Lambat (0.75x)',
  NORMAL = 'Normal (1.0x)',
  FAST = 'Cepat (1.25x)',
  SUPER_FAST = 'Ngebut (1.5x)',
}
