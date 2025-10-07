export const translations = {
  en: {
    // Navigation
    home: 'Home',
    checkText: 'Check Text',
    newsFeed: 'News Feed', 
    dashboard: 'Dashboard',
    admin: 'Admin',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    
    // Main interface
    appName: 'TruthLens',
    tagline: 'Advanced AI-powered fake news detection',
    heroTitle: 'Is it true?',
    heroSubtitle: 'Verify news authenticity with AI-powered analysis in seconds',
    
    // Text checking
    pasteText: 'Paste your text here...',
    analyzeText: 'Analyze Text',
    uploadFile: 'Upload File',
    analyzing: 'Analyzing...',
    
    // Results
    classification: 'Classification',
    confidence: 'Confidence',
    explanation: 'Explanation',
    keywords: 'Key Terms',
    sources: 'Verification Sources',
    real: 'REAL',
    fake: 'FAKE',
    uncertain: 'UNCERTAIN',
    
    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    createAccount: 'Create Account',
    signIn: 'Sign In',
    forgotPassword: 'Forgot Password?',
    
    // Settings
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    
    // Admin
    totalPredictions: 'Total Predictions',
    totalArticles: 'Total Articles',
    accuracy: 'Accuracy',
    recentActivity: 'Recent Activity',
    
    // Warnings
    disclaimer: 'This is an educational tool. Always verify important information with official sources.',
    noResults: 'No results found',
    error: 'An error occurred',
    tryAgain: 'Try Again'
  },
  ru: {
    // Navigation
    home: 'Главная',
    checkText: 'Проверить текст',
    newsFeed: 'Лента новостей',
    dashboard: 'Панель управления',
    admin: 'Администрирование',
    login: 'Войти',
    signup: 'Регистрация',
    logout: 'Выйти',
    
    // Main interface
    appName: 'TruthLens',
    tagline: 'Продвинутое обнаружение фейковых новостей с помощью ИИ',
    heroTitle: 'Это правда?',
    heroSubtitle: 'Проверяйте достоверность новостей с помощью анализа ИИ за секунды',
    
    // Text checking
    pasteText: 'Вставьте ваш текст сюда...',
    analyzeText: 'Анализировать текст',
    uploadFile: 'Загрузить файл',
    analyzing: 'Анализируем...',
    
    // Results
    classification: 'Классификация',
    confidence: 'Уверенность',
    explanation: 'Объяснение',
    keywords: 'Ключевые термины',
    sources: 'Источники проверки',
    real: 'ПРАВДА',
    fake: 'ФЕЙК',
    uncertain: 'НЕОПРЕДЕЛЕННО',
    
    // Auth
    email: 'Электронная почта',
    password: 'Пароль',
    name: 'Полное имя',
    createAccount: 'Создать аккаунт',
    signIn: 'Войти',
    forgotPassword: 'Забыли пароль?',
    
    // Settings
    language: 'Язык',
    theme: 'Тема',
    darkMode: 'Темная тема',
    lightMode: 'Светлая тема',
    
    // Admin
    totalPredictions: 'Всего прогнозов',
    totalArticles: 'Всего статей',
    accuracy: 'Точность',
    recentActivity: 'Недавняя активность',
    
    // Warnings
    disclaimer: 'Это образовательный инструмент. Всегда проверяйте важную информацию в официальных источниках.',
    noResults: 'Результаты не найдены',
    error: 'Произошла ошибка',
    tryAgain: 'Попробуйте снова'
  },
  kz: {
    // Navigation
    home: 'Басты бет',
    checkText: 'Мәтінді тексеру',
    newsFeed: 'Жаңалықтар',
    dashboard: 'Басқару панелі',
    admin: 'Әкімшілік',
    login: 'Кіру',
    signup: 'Тіркелу',
    logout: 'Шығу',
    
    // Main interface
    appName: 'TruthLens',
    tagline: 'AI арқылы жалған жаңалықтарды анықтау',
    heroTitle: 'Бұл шынық па?',
    heroSubtitle: 'AI талдауымен жаңалықтардың шынайылығын секундтар ішінде тексеріңіз',
    
    // Text checking
    pasteText: 'Мәтініңізді осында қойыңыз...',
    analyzeText: 'Мәтінді талдау',
    uploadFile: 'Файл жүктеу',
    analyzing: 'Талдап жатырмыз...',
    
    // Results
    classification: 'Классификация',
    confidence: 'Сенімділік',
    explanation: 'Түсіндірме',
    keywords: 'Негізгі терминдер',
    sources: 'Тексеру көздері',
    real: 'ШЫНДЫҚ',
    fake: 'ЖАЛҒАН',
    uncertain: 'БЕЛГІСІЗ',
    
    // Auth
    email: 'Электрондық пошта',
    password: 'Құпия сөз',
    name: 'Толық аты',
    createAccount: 'Аккаунт жасау',
    signIn: 'Кіру',
    forgotPassword: 'Құпия сөзді ұмыттыңыз ба?',
    
    // Settings
    language: 'Тіл',
    theme: 'Тақырып',
    darkMode: 'Қараңғы тақырып',
    lightMode: 'Жарық тақырып',
    
    // Admin
    totalPredictions: 'Барлық болжамдар',
    totalArticles: 'Барлық мақалалар',
    accuracy: 'Дәлдік',
    recentActivity: 'Соңғы әрекеттер',
    
    // Warnings
    disclaimer: 'Бұл білім беру құралы. Маңызды ақпаратты ресми көздерден тексеріңіз.',
    noResults: 'Нәтижелер табылмады',
    error: 'Қате орын алды',
    tryAgain: 'Қайталап көріңіз'
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;