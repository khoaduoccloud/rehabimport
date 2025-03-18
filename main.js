// Khởi tạo các biến toàn cục
let searchCache = {};
let currentPage = 1;
const ITEMS_PER_PAGE = 10;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwYB5gfzDRKtts0gCBwZac0rLP-MxpjjPvJMNcqBj6lO4IISWjAV5chzsR1XtKroys5/exec';

// Thêm Dark Mode Toggle
function addDarkModeToggle() {
  const themeButton = document.createElement('button');
  themeButton.className = 'theme-switch';
  themeButton.innerHTML = '<i class="fas fa-moon"></i>';
  document.body.appendChild(themeButton);

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    themeButton.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  themeButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeButton.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

// Loader functions
function showLoader() {
  const loader = document.getElementById("loader");
  const overlay = document.getElementById("loader-overlay");
  loader.style.display = "block";
  overlay.style.display = "block";
  loader.querySelector("::after").style.animation = "progress 1s linear forwards";
}

function hideLoader() {
  const loader = document.getElementById("loader");
  const overlay = document.getElementById("loader-overlay");
  
  // Đảm bảo progress bar đạt 100% trước khi ẩn
  const loaderBar = loader.querySelector("::after");
  loaderBar.style.width = "100%";
  
  setTimeout(() => {
    loader.style.display = "none";
    overlay.style.display = "none";
    loaderBar.style.width = "0";
    loaderBar.style.animation = "none";
  }, 500); // Đợi 0.5s sau khi hoàn thành
}

// Thêm Promise để xử lý các function bất đồng bộ
async function handleAsyncFunction(asyncFn) {
  showLoader();
  try {
    await asyncFn();
  } finally {
    hideLoader();
  }
}

// Thêm hàm format tiền tệ
function formatCurrency(number) {
  if (!number) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(number) + ' đ';
}

// Hàm chuyển đổi từ định dạng tiền tệ về số
function parseCurrency(string) {
  if (!string) return 0;
  return parseInt(string.replace(/[^\d]/g, ''));
}

// Khởi tạo các event listeners khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
  // Thêm event listener cho input mã thiết bị
  const deviceIDInput = document.getElementById('deviceID');
  
  deviceIDInput.addEventListener('input', function(e) {
    let value = e.target.value.trim().toUpperCase();
    // Nếu chỉ nhập mã khoa (không có số), gửi request để lấy số tiếp theo
    if (value && !value.includes('.')) {
      fetch(`${'https://script.google.com/macros/s/AKfycbwYB5gfzDRKtts0gCBwZac0rLP-MxpjjPvJMNcqBj6lO4IISWjAV5chzsR1XtKroys5/exec'}?action=getNextID&department=${value}`)
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            this.value = result.nextID;
          }
        })
        .catch(error => console.error('Error:', error));
    }
  });

  // Thêm Dark Mode Toggle
  addDarkModeToggle();
});

// Form validation
function validateForm() {
  const deviceID = document.getElementById('deviceID').value.trim().toUpperCase();
  const deviceName = document.getElementById('deviceName').value.trim();
  const originalPrice = document.getElementById('originalPrice').value.trim();
  const errors = [];

  if (!deviceID) {
    errors.push('Vui lòng nhập Mã thiết bị');
  } else {
    // Kiểm tra định dạng: PHCNNL.01, PHCNNHI.01, YHCT.01, v.v.
    const deviceIDPattern = /^(PHCNNL|PHCNNHI|YHCT|NTH|CC|XN)\.\d{2}$/;
    if (!deviceIDPattern.test(deviceID)) {
      errors.push('Mã thiết bị không đúng định dạng (VD: PHCNNL.01, PHCNNHI.01, YHCT.01)');
    }
  }

  if (!deviceName) {
    errors.push('Vui lòng nhập Tên thiết bị');
  }

  if (!originalPrice) {
    errors.push('Vui lòng nhập Nguyên giá');
  } else if (!/^\d+$/.test(originalPrice)) {
    errors.push('Nguyên giá chỉ được phép nhập số.');
  }

  if (errors.length > 0) {
    alert(errors.join('\n'));
    return false;
  }
  return true;
}

// Form submission
document.getElementById("deviceForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  await handleAsyncFunction(async () => {
    const originalPriceValue = parseCurrency(document.getElementById('originalPrice').value);
    
    const data = {
      deviceID: document.getElementById('deviceID').value.trim(),
      deviceName: document.getElementById('deviceName').value.trim(),
      deviceType: document.getElementById('deviceType').value,
      modelSerial: document.getElementById('modelSerial').value.trim(),
      originalPrice: originalPriceValue,
      manufactureYear: document.getElementById('manufactureYear').value,
      usageYear: document.getElementById('usageYear').value,
      manufacturer: document.getElementById('manufacturer').value.trim(),
      country: document.getElementById('country').value.trim(),
      department: document.getElementById('department').value,
      user: document.getElementById('user').value,
      source: document.getElementById('source').value,
      imageURL: document.getElementById('imageURL').value.trim()
    };

    const response = await fetch('https://script.google.com/macros/s/AKfycbwYB5gfzDRKtts0gCBwZac0rLP-MxpjjPvJMNcqBj6lO4IISWjAV5chzsR1XtKroys5/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams(data).toString()
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Lỗi không xác định');
    }
    alert(result.message);
    this.reset();
  });
});

// Search functionality
document.getElementById("searchBtn").addEventListener("click", async function() {
  await handleAsyncFunction(async () => {
    const data = getFormData();
    
    // Validate department
    const deptInput = data.department.trim().toLowerCase();
    const allowedDepartments = ["phcnnl", "phcn nhi", "nth", "cc", "yhct", "kd tbyt", "cdha tdcn xn"];
    
    if (deptInput && !allowedDepartments.includes(deptInput)) {
      alert("Không đúng cú pháp cho KHOA PHÒNG SỬ DỤNG. Hãy thử nhập: PHCNNL, PHCN Nhi, NTH, CC, YHCT, KD-TBYT, CĐHA-TDCN-XN.");
      return;
    }

    const params = new URLSearchParams(data).toString();
    const response = await fetch(`${'https://script.google.com/macros/s/AKfycbwYB5gfzDRKtts0gCBwZac0rLP-MxpjjPvJMNcqBj6lO4IISWjAV5chzsR1XtKroys5/exec'}?${params}`);
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Lỗi tìm kiếm');
    }
    displaySearchResults(result);
  });
});

// Get form data
function getFormData() {
  return {
    deviceID: document.getElementById('deviceID').value.trim(),
    deviceName: document.getElementById('deviceName').value.trim(),
    deviceType: document.getElementById('deviceType').value,
    modelSerial: document.getElementById('modelSerial').value.trim(),
    originalPrice: document.getElementById('originalPrice').value,
    manufactureYear: document.getElementById('manufactureYear').value,
    usageYear: document.getElementById('usageYear').value,
    manufacturer: document.getElementById('manufacturer').value.trim(),
    country: document.getElementById('country').value.trim(),
    department: document.getElementById('department').value,
    user: document.getElementById('user').value,
    source: document.getElementById('source').value,
    imageURL: document.getElementById('imageURL').value.trim()
  };
}

// Display search results
function displaySearchResults(data) {
  const modal = document.getElementById("searchModal");
  const modalResults = document.getElementById("modalResults");
  modalResults.innerHTML = "";

  if (!data.results || data.results.length === 0) {
    modalResults.innerHTML = "<p>Không tìm thấy kết quả nào.</p>";
    modal.style.display = "block";
    return;
  }

  const totalPages = Math.ceil(data.results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = data.results.slice(startIndex, endIndex);

  const table = createResultTable(data.headers, currentPageData);
  const pagination = createPagination(totalPages);

  modalResults.appendChild(table);
  modalResults.appendChild(pagination);
  modal.style.display = "block";
}

// Create result table
function createResultTable(headers, data) {
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  // Create header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create body
  const tbody = document.createElement("tbody");
  data.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach((cell, index) => {
      const td = document.createElement("td");
      
      if (index === 13 && cell) { // Image column
        const img = document.createElement("img");
        img.src = cell;
        img.alt = "Hình ảnh thiết bị";
        img.style.maxWidth = "150px";
        img.style.cursor = "pointer";
        img.onclick = () => window.open(cell, '_blank');
        td.appendChild(img);
      } else if (index === 5) { // Price column
        td.textContent = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(cell);
      } else {
        td.textContent = cell;
      }
      
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

// Create pagination
function createPagination(totalPages) {
  const div = document.createElement("div");
  div.className = "pagination";
  
  if (currentPage > 1) {
    const prev = document.createElement("button");
    prev.textContent = "Trang trước";
    prev.onclick = () => changePage(currentPage - 1);
    div.appendChild(prev);
  }

  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Trang ${currentPage}/${totalPages}`;
  div.appendChild(pageInfo);

  if (currentPage < totalPages) {
    const next = document.createElement("button");
    next.textContent = "Trang sau";
    next.onclick = () => changePage(currentPage + 1);
    div.appendChild(next);
  }

  return div;
}

// Change page
function changePage(newPage) {
  currentPage = newPage;
  displaySearchResults(searchCache);
}

// Modal close handlers
document.getElementById("closeModal").addEventListener("click", function() {
  document.getElementById("searchModal").style.display = "none";
});

window.addEventListener("click", function(e) {
  const modal = document.getElementById("searchModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Delete functionality
document.getElementById("deleteBtn").addEventListener("click", async function() {
  const deviceID = document.getElementById('deviceID').value.trim();
  if (!deviceID) {
    alert("Vui lòng nhập MÃ THIẾT BỊ của bản ghi cần xóa.");
    return;
  }

  if (confirm(`Bạn có chắc muốn xóa bản ghi có MÃ THIẾT BỊ: ${deviceID}?`)) {
    await handleAsyncFunction(async () => {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwYB5gfzDRKtts0gCBwZac0rLP-MxpjjPvJMNcqBj6lO4IISWjAV5chzsR1XtKroys5/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({
          action: "delete",
          deviceID: deviceID
        }).toString()
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Lỗi khi xóa dữ liệu');
      }
      alert(result.message);
      document.getElementById("deviceForm").reset();
    });
  }
});

// Refresh functionality
document.getElementById("refreshBtn").addEventListener("click", function() {
  window.location.reload();
});

// Info button handler
document.getElementById("infoBtn").addEventListener("click", function() {
  window.open('cv.html', '_blank');
});
