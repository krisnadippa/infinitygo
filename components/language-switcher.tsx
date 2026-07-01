"use client";

import { useEffect, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("id");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Tambahkan script Google Translate
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "id", includedLanguages: "id,en,zh-CN", autoDisplay: false },
          "google_translate_element"
        );
      };
    }

    // Cek cookie untuk bahasa saat ini
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match && match[2]) {
      const lang = match[2].split("/")[2];
      if (lang) {
        setCurrentLang(lang);
      }
    }
  }, []);

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    setIsOpen(false);
    
    const domain = window.location.hostname;
    const hostParts = domain.split('.');
    
    // List all potential domains/subdomains to clear any stuck cookies
    const domainsToClear = [
      "", // host-only (no domain parameter)
      domain,
      `.${domain}`
    ];
    
    if (hostParts.length > 2) {
      const mainDomain = hostParts.slice(-2).join('.');
      domainsToClear.push(mainDomain);
      domainsToClear.push(`.${mainDomain}`);
    }
    
    // 1. Clear all possible googtrans cookies
    const paths = ["/", window.location.pathname];
    for (const d of domainsToClear) {
      for (const p of paths) {
        const domainAttr = d ? `; domain=${d}` : "";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}${domainAttr}`;
      }
    }

    // 2. Set the new cookie cleanly as host-only on the root path
    document.cookie = `googtrans=/id/${lang}; path=/;`;
    
    // Reload to apply the translation smoothly
    window.location.reload();
  };

  const languages = [
    { code: "id", name: "Indonesian (ID)" },
    { code: "en", name: "English (EN)" },
    { code: "zh-CN", name: "Chinese (ZH)" }
  ];

  const currentLangName = languages.find(l => l.code === currentLang)?.name.split(" ")[1].replace("(", "").replace(")", "") || "ID";

  return (
    <div className="relative z-50">
      <div id="google_translate_element" className="hidden"></div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-2 rounded-full transition-colors text-sm font-semibold border border-slate-200"
      >
        <Globe size={16} className="text-[#40B5AD]" />
        <span>{currentLangName}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full mt-2 right-0 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-40 z-50 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${currentLang === lang.code ? "text-[#40B5AD] font-bold bg-[#40B5AD]/5" : "text-slate-600 font-medium"}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
