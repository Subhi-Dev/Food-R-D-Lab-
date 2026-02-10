import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UnitSystem = 'metric' | 'imperial';
type Language = 'en' | 'ar';

interface UserProfile {
  name: string;
  title: string;
  email: string;
  avatarUrl: string;
}

interface SettingsContextType {
  // Appearance & Units
  units: UnitSystem;
  setUnits: (unit: UnitSystem) => void;
  notifications: {
    appAlerts: boolean;
    emailSummaries: boolean;
  };
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleNotification: (key: 'appAlerts' | 'emailSummaries') => void;
  
  // Profile & Identity
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Language & RTL
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;

  // Helpers
  formatMass: (kgValue: number) => string;
  formatTemp: (celsiusValue: number) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Sidebar
    dashboard: "Dashboard",
    runs: "Runs",
    inventory: "Inventory",
    reports: "Reports",
    schedule: "Schedule",
    settings: "Settings",
    
    // Dashboard Headers & Search
    investInnovation: "Invest in your innovation",
    search: "Search projects...",
    newProject: "New Project",
    
    // Filters
    all: "All",
    active: "Active",
    completed: "Completed",
    
    // Stats Cards
    activeProjects: "Active Projects",
    labCapacity: "Lab Capacity",
    pendingApprovals: "Pending Approvals",
    nextMilestone: "Next Milestone",
    recentReports: "Recent Reports",
    
    // Project Card
    version: "Version",
    progress: "Progress",
    viewDetails: "View Details",
    lastEdited: "Last edited by",
    
    // Card Context Menu
    editProject: "Edit Project",
    duplicateFormulation: "Duplicate Formulation",
    startNewRun: "Start New Run",
    exportData: "Export Batch Data",
    archiveProject: "Archive Project",
    deleteProject: "Delete",
    
    // Common Terms
    status: "Status",
    category: "Category",
    lead: "Lead",
    weighing: "Weighing",
    processing: "Processing",
    
    // Runs Page
    startRun: "Run Execution",
    recentBatches: "Recent Batches",
    cancelRun: "Cancel Run",
    step: "Step",
    targetWeight: "Target Weight",
    actualWeight: "Actual Weight",
    finishRun: "Finish Run",
    nextStep: "Next Step",
    previous: "Previous",

    // Profile & Notifications
    activityFeed: "Activity Feed",
    markAllRead: "Mark all read",
    clearAll: "Clear all",
    noNotifications: "No new notifications",
    profileIdentity: "Profile & Identity",
    manageCredentials: "Manage your lab credentials and preferences",
    identity: "Identity",
    digitalSignature: "Digital Signature",
    localization: "Localization",
    saveChanges: "Save Changes",
    cancel: "Cancel",
  },
  ar: {
    // Sidebar
    dashboard: "لوحة التحكم",
    runs: "عمليات التشغيل",
    inventory: "المخزون",
    reports: "التقارير",
    schedule: "الجدول",
    settings: "الإعدادات",
    
    // Dashboard Headers & Search
    investInnovation: "استثمر في ابتكارك",
    search: "بحث في المشاريع...",
    newProject: "مشروع جديد",
    
    // Filters
    all: "الكل",
    active: "نشط",
    completed: "مكتمل",
    
    // Stats Cards
    activeProjects: "المشاريع النشطة",
    labCapacity: "سعة المختبر",
    pendingApprovals: "قيد المراجعة",
    nextMilestone: "الحدث القادم",
    recentReports: "أحدث التقارير",
    
    // Project Card
    version: "الإصدار",
    progress: "التقدم",
    viewDetails: "عرض التفاصيل",
    lastEdited: "آخر تعديل بواسطة",
    
    // Card Context Menu
    editProject: "تعديل المشروع",
    duplicateFormulation: "تكرار التركيبة",
    startNewRun: "بدء التشغيل",
    exportData: "تصدير البيانات",
    archiveProject: "أرشفة المشروع",
    deleteProject: "حذف",
    
    // Common Terms
    status: "الحالة",
    category: "الفئة",
    lead: "المسؤول",
    weighing: "توزين",
    processing: "معالجة",
    
    // Runs Page
    startRun: "تنفيذ التجربة",
    recentBatches: "أحدث الدفعات",
    cancelRun: "إلغاء",
    step: "خطوة",
    targetWeight: "الوزن المستهدف",
    actualWeight: "الوزن الفعلي",
    finishRun: "إنهاء التجربة",
    nextStep: "الخطوة التالية",
    previous: "السابق",

    // Profile & Notifications
    activityFeed: "نشاط النظام",
    markAllRead: "تحديد الكل كمقروء",
    clearAll: "مسح الكل",
    noNotifications: "لا توجد إشعارات جديدة",
    profileIdentity: "الملف الشخصي والهوية",
    manageCredentials: "إدارة بيانات الاعتماد والتفضيلات",
    identity: "الهوية",
    digitalSignature: "التوقيع الرقمي",
    localization: "اللغة والمنطقة",
    saveChanges: "حفظ التغييرات",
    cancel: "إلغاء",
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<UnitSystem>('metric');
  const [notifications, setNotifications] = useState({
    appAlerts: true,
    emailSummaries: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Dr. Sarah Chen',
    title: 'Head of R&D',
    email: 'sarah.chen@labmanager.io',
    avatarUrl: 'https://picsum.photos/200'
  });

  // Language State
  const [language, setLanguage] = useState<Language>('en');
  const isRTL = language === 'ar';

  // Theme Side Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Language/RTL Side Effect
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    // Force font family update on body if needed via class, though CSS handles it by default
    if (isRTL) {
      document.body.style.fontFamily = "'Tajawal', sans-serif";
    } else {
      document.body.style.fontFamily = "'Inter', sans-serif";
    }
  }, [language, isRTL]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleNotification = (key: 'appAlerts' | 'emailSummaries') => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const t = (key: string) => {
    return TRANSLATIONS[language][key] || key;
  };

  const formatMass = (kgValue: number) => {
    if (units === 'metric') {
      if (kgValue < 1) return `${(kgValue * 1000).toFixed(0)}${isRTL ? ' جم' : 'g'}`;
      return `${kgValue.toFixed(2)}${isRTL ? ' كجم' : 'kg'}`;
    } else {
      const lbs = kgValue * 2.20462;
      if (lbs < 1) return `${(lbs * 16).toFixed(1)}${isRTL ? ' أونصة' : 'oz'}`;
      return `${lbs.toFixed(2)}${isRTL ? ' باوند' : 'lbs'}`;
    }
  };

  const formatTemp = (celsiusValue: number) => {
    if (units === 'metric') {
      return `${celsiusValue}°C`;
    } else {
      const fahrenheit = (celsiusValue * 9/5) + 32;
      return `${fahrenheit.toFixed(1)}°F`;
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      units, setUnits, 
      notifications, toggleNotification, 
      darkMode, toggleDarkMode,
      profile, updateProfile,
      language, setLanguage, isRTL, t,
      formatMass, formatTemp 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};