export type Locale = "en" | "ar"

export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    commissions: "Commissions",
    districts: "Districts",
    groups: "Groups",
    bands: "Bands",
    members: "Members",
    settings: "Settings",

    // Common Actions
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    filter: "Filter",
    actions: "Actions",
    view: "View",
    back: "Back",

    logout: "Logout",
    changePassword: "Change Password",
    changePasswordDescription: "Update your password to keep your account secure",
    account: "Account",

    // Commission
    addCommission: "Add Commission",
    editCommission: "Edit Commission",
    commissionName: "Commission Name",
    commissionCode: "Commission Code",
    commissionID: "Commission ID",
    commissionDetails: "Commission Details",

    // District
    addDistrict: "Add District",
    editDistrict: "Edit District",
    districtName: "District Name",
    districtCode: "District Code",
    districtID: "District ID",
    selectCommission: "Select Commission",

    // Group
    addGroup: "Add Group",
    editGroup: "Edit Group",
    groupName: "Group Name",
    groupTownName: "Town Name",
    groupCode: "Group Code",
    groupID: "Group ID",
    selectDistrict: "Select District",

    // Band
    addBand: "Add Band",
    editBand: "Edit Band",
    bandName: "Band Name",
    bandCode: "Band Code",
    selectGroup: "Select Group",
    bandMembers: "Band Members",

    // Member
    addMember: "Add Member",
    editMember: "Edit Member",
    memberName: "Member Name",
    memberCode: "Member Code",
    civilId: "Civil ID",
    phoneNumber: "Phone Number",
    assignedBands: "Assigned Bands",
    selectBands: "Select Bands",

    // Messages
    deleteConfirm: "Are you sure you want to delete this item?",
    deleteSuccess: "Item deleted successfully",
    saveSuccess: "Changes saved successfully",

    // Placeholders
    searchPlaceholder: "Search...",
    noResults: "No results found",

    // Theme
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",

    filterByCommission: "Filter by Commission",
    filterByDistrict: "Filter by District",
    allCommissions: "All Commissions",
    allDistricts: "All Districts",
    clearAllFilters: "Clear all filters",
    filters: "Filters",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    commissions: "المفوضيات",
    districts: "المناطق",
    groups: "الأفواج",
    bands: "الفرق",
    members: "الأعضاء",
    settings: "الإعدادات",

    // Common Actions
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    search: "بحث",
    filter: "تصفية",
    actions: "الإجراءات",
    view: "عرض",
    back: "رجوع",


    logout: "تسجيل الخروج",
    changePassword: "تغيير كلمة المرور",
    changePasswordDescription: "قم بتحديث كلمة المرور الخاصة بك للحفاظ على أمان حسابك",
    account: "الحساب",

    // Commission
    addCommission: "إضافة مفوضية",
    editCommission: "تعديل مفوضية",
    commissionName: "اسم المفوضية",
    commissionCode: "رمز المفوضية",
    commissionID: "رمز المفوضية",
    commissionDetails: "تفاصيل المفوضية",

    // District
    addDistrict: "إضافة منطقة",
    editDistrict: "تعديل منطقة",
    districtName: "اسم المنطقة",
    districtCode: "رمز المنطقة",
    districtID: "رمز المنطقة",
    selectCommission: "اختر المفوضية",

    // Group
    addGroup: "إضافة فوج",
    editGroup: "تعديل فوج",
    groupName: "اسم الفوج",
    groupTownName: "البلدة",
    groupCode: "رمز الفوج",
    groupID: "رمز الفوج",
    selectDistrict: "اختر المنطقة",

    // Band
    addBand: "إضافة فرقة",
    editBand: "تعديل فرقة",
    bandName: "اسم الفرقة",
    bandCode: "رمز الفرقة",
    selectGroup: "اختر الفوج",
    bandMembers: "أعضاء الفرقة",

    // Member
    addMember: "إضافة عضو",
    editMember: "تعديل عضو",
    memberName: "اسم العضو",
    memberCode: "رمز العضو",
    civilId: "الرقم المدني",
    phoneNumber: "رقم الهاتف",
    assignedBands: "الفرق المعينة",
    selectBands: "اختر الفرق",

    // Messages
    deleteConfirm: "هل أنت متأكد من حذف هذا العنصر؟",
    deleteSuccess: "تم الحذف بنجاح",
    saveSuccess: "تم الحفظ بنجاح",

    // Placeholders
    searchPlaceholder: "بحث...",
    noResults: "لا توجد نتائج",

    // Theme
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    language: "اللغة",

    filterByCommission: "تصفية حسب المفوضية",
    filterByDistrict: "تصفية حسب المنطقة",
    allCommissions: "جميع المفوضيات",
    allDistricts: "جميع المناطق",
    clearAllFilters: "مسح جميع الفلاتر",
    filters: "الفلاتر",
  },
}

export function t(key: keyof typeof translations.en, locale: Locale = "en"): string {
  return translations[locale][key] || key
}
