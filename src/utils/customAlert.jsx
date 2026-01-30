import Swal from 'sweetalert2';
import 'animate.css';

// Umumiy Dizayn Sozlamalari
const glassPopup = {
    background: 'rgba(20, 20, 30, 0.95)',
    color: '#fff',
    backdrop: `rgba(15, 23, 42, 0.4)`, // To'qroq va shaffof fon
    customClass: {
        popup: 'glass-modal-border animated fadeInDown faster' 
    },
    showClass: {
        popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
    }
};

// 1. MUVAFFAQIYATLI XABAR ✅
export const showSuccessAlert = (title, message = "") => {
    Swal.fire({
        ...glassPopup,
        icon: 'success',
        title: `<h3 style="color:#10b981; font-family:sans-serif;">${title}</h3>`,
        html: `<p style="color:#cbd5e1">${message}</p>`,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Ajoyib! 😎',
        timer: 3500,
        timerProgressBar: true
    });
};

// 2. XATOLIK XABARI ❌
export const showErrorAlert = (error) => {
  let message = "Kutilmagan xatolik yuz berdi.";

  if (typeof error === "string") {
    message = error;
  }
  // Agar Backenddan javob kelsa
  else if (error.response) {
    const data = error.response.data;

    // Agar javob HTML formatda kelsa (sizdagi 500 xatolik kabi)
    if (typeof data === "string") {
      // Juda uzun matn bo'lsa, qisqartiramiz yoki umumiy xabar beramiz
      if (data.includes("AttributeError")) {
        message =
          "Tizimda ichki xatolik (Backend Error). Admin bilan bog'laning.";
      } else {
        message = "Server xatosi: " + error.response.status;
      }
    }
    // Agar javob JSON bo'lsa { detail: "..." }
    else if (data.detail) {
      message = data.detail;
    }
    // Agar javob JSON Object bo'lsa { field: ["error"] }
    else if (typeof data === "object") {
      message = Object.entries(data)
        .map(([key, val]) => `<b>${key.toUpperCase()}:</b> ${val}`)
        .join("<br/>");
    }
  }
  Swal.fire({
    ...glassPopup,
    icon: "error",
    title: `<h3 style="color:#ef4444">Uups... Xatolik!</h3>`,
    html: `<div style="color:#cbd5e1; text-align:left; font-size:14px;">${message}</div>`,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Tushunarli",
  });
};

// 3. TASDIQLASH (Confirm) ❓
export const confirmAction = async (title, text, confirmText = "Ha, davom etamiz") => {
    const result = await Swal.fire({
        ...glassPopup,
        icon: 'question',
        title: `<h3 style="color:#3b82f6">${title}</h3>`,
        html: `<p style="color:#cbd5e1">${text}</p>`,
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#64748b',
        confirmButtonText: confirmText,
        cancelButtonText: 'Yo\'q, qaytish'
    });
    return result.isConfirmed;
};
// Kurs sotib olish uchun maxsus tasdiqlash oynasi
export const confirmCoursePurchase = async (course) => {
    const result = await Swal.fire({
        title: `<h3 style="color:#3b82f6">Kursni sotib olasizmi?</h3>`,
        html: `
            <div style="text-align: left; color: #cbd5e1;">
                <p><b>Kurs:</b> ${course.title}</p>
                <p><b>Narxi:</b> ${parseFloat(course.price).toLocaleString()} UZS</p>
                <hr style="border-color: rgba(255,255,255,0.1)"/>
                <p style="font-size: 0.8em; color: #94a3b8;">Sotib olgandan so'ng barcha videolar ochiladi.</p>
            </div>
        `,
        icon: 'question',
        background: 'rgba(20, 20, 30, 0.95)',
        color: '#fff',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ha, sotib olaman 🛒',
        cancelButtonText: 'Bekor qilish',
        customClass: {
            popup: 'glass-modal-border'
        }
    });
    return result.isConfirmed;
};