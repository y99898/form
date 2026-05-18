const TELEGRAM_BOT_TOKEN = '8293770629:AAHgYwDabWA4YJXwLYLPfcSY43-SwJe2cS8';
const TELEGRAM_CHAT_ID = '5709332539';

const form = document.getElementById('joinForm');
const submitBtn = document.getElementById('submitBtn');
const notification = document.getElementById('notification');
const photoInput = document.getElementById('photoInput');
const previewImage = document.getElementById('previewImage');
const photoPreview = document.getElementById('photoPreview');
const removePhotoBtn = document.getElementById('removePhotoBtn');

let selectedFile = null;

// =========================
// الإشعارات
// =========================
function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = 'notification ' + type;
  notification.style.display = 'block';

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// =========================
// رفع الصورة
// =========================
photoInput.addEventListener('change', function(e) {
  const file = e.target.files[0];

  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      showNotification('صيغة غير مدعومة', 'warning');
      photoInput.value = '';
      return;
    }

    selectedFile = file;

    const reader = new FileReader();

    reader.onload = function(event) {
      previewImage.src = event.target.result;
      previewImage.style.display = 'block';

      const placeholder = photoPreview.querySelector('.placeholder-icon');
      if (placeholder) placeholder.style.display = 'none';

      photoPreview.classList.add('has-image');
      removePhotoBtn.classList.add('visible');
    };

    reader.readAsDataURL(file);
  }
});

// =========================
// حذف الصورة
// =========================
removePhotoBtn.addEventListener('click', () => {
  selectedFile = null;
  photoInput.value = '';
  previewImage.src = '';
  previewImage.style.display = 'none';

  const placeholder = photoPreview.querySelector('.placeholder-icon');
  if (placeholder) placeholder.style.display = 'block';

  photoPreview.classList.remove('has-image');
  removePhotoBtn.classList.remove('visible');
});

// =========================
// النقر على الصورة لاختيار ملف
// =========================
photoPreview.addEventListener('click', function() {
  photoInput.click();
});

// =========================
// إرسال إلى تيليجرام
// =========================
async function sendToTelegram(data) {
  const message = `
🚴‍♂️ تسجيل جديد - فريق درّاجة الحمدانية

👤 الاسم: ${data.fullname}
📱 الواتساب: ${data.whatsapp}
⚧ الجنس: ${data.gender}
📍 العنوان: ${data.address}
🎂 العمر: ${data.age}
📅 التاريخ: ${new Date().toLocaleString('ar-IQ')}
`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })
  });

  const result = await response.json();

  if (!result.ok) {
    throw new Error(result.description || 'فشل الإرسال');
  }

  return result;
}

// =========================
// إرسال النموذج
// =========================
form.addEventListener('submit', async function(e) {
  e.preventDefault();

  if (
    TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' ||
    TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE'
  ) {
    showNotification('الرجاء إعداد بيانات تيليجرام أولاً', 'error');
    return;
  }

  const formData = {
    fullname: document.getElementById('fullname').value.trim(),
    whatsapp: document.getElementById('whatsapp').value.trim(),
    gender: document.getElementById('gender').value,
    address: document.getElementById('address').value.trim(),
    age: document.getElementById('age').value
  };

  if (
    !formData.fullname ||
    !formData.whatsapp ||
    !formData.gender ||
    !formData.address ||
    !formData.age
  ) {
    showNotification('يرجى ملء جميع الحقول', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = 'جاري الإرسال...';

  try {
    await sendToTelegram(formData);

    showNotification('تم التسجيل بنجاح', 'success');

    form.reset();

    selectedFile = null;
    photoInput.value = '';
    previewImage.src = '';
    previewImage.style.display = 'none';

    const placeholder = photoPreview.querySelector('.placeholder-icon');
    if (placeholder) placeholder.style.display = 'block';

    photoPreview.classList.remove('has-image');
    removePhotoBtn.classList.remove('visible');

  } catch (error) {
    console.error(error);
    showNotification('حدث خطأ أثناء الإرسال', 'error');
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> انطلق الآن';
});

// =========================
// تأثيرات الإدخال
// =========================
const inputs = document.querySelectorAll('input:not([type="file"]), select, textarea');

inputs.forEach(input => {
  input.addEventListener('focus', function() {
    const icon = this.parentElement.querySelector('label i');

    if (icon) {
      icon.style.color = '#ff4d6d';
      icon.style.transform = 'scale(1.2)';
    }
  });

  input.addEventListener('blur', function() {
    const icon = this.parentElement.querySelector('label i');

    if (icon) {
      icon.style.color = '';
      icon.style.transform = 'scale(1)';
    }
  });
});

// =========================
// حماية قوية: تعطيل Inspect وأدوات المطورين
// =========================

// تعطيل الزر الأيمن للفأرة
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

// تعطيل اختصارات لوحة المفاتيح للمطورين
document.addEventListener('keydown', function(e) {
  // F12
  if (e.keyCode === 123) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+I
  if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+J
  if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
    e.preventDefault();
    return false;
  }

  // Ctrl+U
  if (e.ctrlKey && e.keyCode === 85) {
    e.preventDefault();
    return false;
  }

  // Ctrl+S
  if (e.ctrlKey && e.keyCode === 83) {
    e.preventDefault();
    return false;
  }

  // Ctrl+Shift+K
  if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
    e.preventDefault();
    return false;
  }
});

// كشف DevTools
(function() {
  const threshold = 160;
  let devtoolsOpen = false;

  function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;

        console.clear();
        console.log('%cتحذير!', 'color:red; font-size:30px;');
        console.log('%cهذه المنطقة مخصصة للمطورين فقط', 'font-size:20px;');
      }
    } else {
      devtoolsOpen = false;
    }
  }

  setInterval(detectDevTools, 1000);
})();

// تعطيل السحب والإفلات
document.addEventListener('dragover', function(e) {
  e.preventDefault();
  return false;
}, false);

document.addEventListener('drop', function(e) {
  e.preventDefault();
  return false;
}, false);

// تحذير الكونسول
console.clear();
console.log('%c⚠️ تحذير أمني ⚠️', 'color:#ff4d6d; font-size:40px; font-weight:bold;');
console.log('%cتم تعطيل أدوات المطورين لحماية البيانات', 'color:#ffae42; font-size:20px;');
console.log('%cفريق درّاجة الحمدانية 🚴‍♂️', 'color:#33cc99; font-size:18px;');