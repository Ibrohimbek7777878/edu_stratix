import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const DynamicBackground = () => {
  // Hozirgi faslni saqlash uchun state (boshlang'ich qiymat: qish)
  const [season, setSeason] = useState("winter");

  // tsparticles kutubxonasini ishga tushirish (Lightweight versiyasi)
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    // 1. Dastur birinchi marta yuklanganda kompyuter vaqtiga qarab faslni aniqlash
    const month = new Date().getMonth(); // 0-11 gacha raqam qaytaradi
    if (month === 11 || month === 0 || month === 1)
      setSeason("winter"); // Dekabr, Yanvar, Fevral
    else if (month >= 2 && month <= 4) setSeason("spring"); // Mart, Aprel, May
    else if (month >= 5 && month <= 7)
      setSeason("summer"); // Iyun, Iyul, Avgust
    else setSeason("autumn"); // Sentabr, Oktabr, Noyabr

    // 2. Tashqaridan (Navbar yoki boshqa joydan) keladigan Custom Event-ni tinglash
    const handleSeasonChange = (event) => {
      // CustomEvent ichidagi "detail" qiymatini olib, state-ni yangilash
      setSeason(event.detail);
    };

    // "changeSeason" nomli event hodisasiga quloq solishni boshlaymiz
    window.addEventListener("changeSeason", handleSeasonChange);

    // Komponent o'chirilganda xotirani tozalash (Memory leak oldini olish)
    return () => {
      window.removeEventListener("changeSeason", handleSeasonChange);
    };
  }, []);

  // Har bir fasl uchun alohida sozlamalar (options) funksiyasi
  const getOptions = () => {
    // --- QISH (Qor effekti) ---
    if (season === "winter") {
      return {
        background: { color: "#0f172a" },
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.8, random: true },
          size: { value: 4, random: true },
          move: {
            enable: true,
            speed: 2,
            direction: "bottom", // Pastga qarab tushish
            random: false,
            straight: false,
            out_mode: "out",
          },
        },
      };
    }

    // --- BAHOR (REAL YOMG'IR TOMCHISI EFFEKTI) ---
    if (season === "spring") {
      return {
        background: { color: "#0f1c2e" },
        particles: {
          number: { value: 200, density: { enable: true, value_area: 800 } },
          color: { value: "#ffffff" },
          shape: {
            type: "circle", // Doira shakli (Tezlik bilan tomchiga aylanadi)
          },
          opacity: {
            value: 0.4, // Suv kabi yarim shaffof
            random: true,
          },
          size: {
            value: { min: 1, max: 2 }, // Kichik tomchilar
            random: true,
          },
          move: {
            enable: true,
            speed: { min: 35, max: 52 }, // JUDA TEZ - Bu chiziq ko'rinishini beradi
            direction: "bottom", // To'g'ri pastga
            random: false,
            straight: true, // Egri-bugri bo'lmasligi uchun
            out_mode: "out",
          },
          // Tomchining orqasidan "iz" qoldirish (Haqiqiy yomg'ir siri)
          wobble: { enable: false },
          roll: { enable: false },
        },
      };
    }

    // --- YOZ (IT Dasturlash tillari effekti) ---
    if (season === "summer") {
      return {
        background: { color: "#020617" },
        particles: {
          number: { value: 40 },
          color: { value: ["#00ff41", "#3b82f6", "#facc15"] },
          shape: {
            type: "char", // Belgilar (matn) shakli
            character: [
              {
                value: ["< / >", "{ }", "function", "const", "0", "1"],
                font: "Consolas",
                weight: "bold",
              },
              { value: ["⚛️", "🐍", "☕", "🚀"] },
            ],
          },
          size: { value: 14, random: true },
          opacity: { value: 0.8 },
          move: {
            enable: true,
            speed: 2,
            direction: "top", // Tepaga qarab "uchish"
            random: true,
            out_mode: "out",
          },
        },
      };
    }

    // --- KUZ (Xazonrezgi effekti) ---
    if (season === "autumn") {
      return {
        background: { color: "#271c19" },
        particles: {
          number: { value: 50 },
          color: { value: ["#fbbf24", "#ea580c", "#dc2626"] },
          shape: { type: "polygon", sides: 5 }, // Bargga o'xshash ko'pburchak
          size: { value: 6, random: true },
          move: {
            enable: true,
            speed: 3,
            direction: "bottom-right", // Shamolda uchayotgan barglar
            random: true,
            straight: false,
            out_mode: "out",
          },
          rotate: {
            // Barglarning aylanib tushishi
            value: 0,
            random: true,
            animation: { enable: true, speed: 5, sync: false },
          },
        },
      };
    }
  };

  return (
    // Orqa fon qatlami (Boshqa elementlarga xalaqit bermasligi uchun -z-50)
    <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          ...getOptions(),
          fullScreen: { enable: false }, // Konteyner ichida ishlashi uchun
          detectRetina: true, // Retina displeylar uchun sifat
          fpsLimit: 120, // Animatsiya ravonligi
        }}
        className="w-full h-full absolute top-0 left-0"
      />
    </div>
  );
};

export default DynamicBackground;
