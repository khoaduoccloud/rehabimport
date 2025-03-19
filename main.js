// Khởi tạo các biến toàn cục
let searchCache = {};
let currentPage = 1;
const ITEMS_PER_PAGE = 10;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw66ska6hRmdYjOdXdARZHdbnd5JDJofUTAtStvBPX2RfROm-VSVvi0IvUR8uvYYvw9KA/exec';

// Bubbles Effect cho Cursor
const bubblesContainer = document.createElement('div');
bubblesContainer.classList.add('bubbles');
document.body.appendChild(bubblesContainer);

// Tạo hiệu ứng bubbles khi di chuyển chuột
document.addEventListener('mousemove', (e) => {
  createBubble(e.clientX, e.clientY);
});

// Tạo bubble mới
function createBubble(x, y) {
  // Giới hạn tốc độ tạo bubble để tránh quá nhiều hiệu ứng
  if (Math.random() > 0.92) { // Chỉ tạo bubble ngẫu nhiên 8% thời gian di chuyển
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // Kích thước ngẫu nhiên từ 8px đến 12px
    const size = Math.random() * 4 + 8; 
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Vị trí gần vị trí con trỏ
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
    
    bubblesContainer.appendChild(bubble);
    
    // Xóa bubble sau khi animation kết thúc
    setTimeout(() => {
      bubble.remove();
    }, 3000); // Thời gian animation float
  }
}

// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
  // Tạo Theme Toggle
  const themeToggle = document.createElement('div');
  themeToggle.classList.add('theme-toggle');
  themeToggle.innerHTML = `
    <input type="checkbox" id="darkmode-toggle">
    <label for="darkmode-toggle">
      <svg class="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79z"></path>
      </svg>
    </label>
  `;
  document.body.appendChild(themeToggle);

  // Xử lý toggle theme
  const darkModeToggle = document.getElementById('darkmode-toggle');
  
  // Khởi tạo trạng thái toggle dựa trên theme đã lưu
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  
  // Đồng bộ trạng thái toggle với theme
  darkModeToggle.checked = (savedTheme === 'dark');
  
  // Xử lý sự kiện thay đổi theme
  darkModeToggle.addEventListener('change', function() {
    const newTheme = this.checked ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
});

// Loader functions
function showLoader() {
  document.getElementById("loader").style.display = "block";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
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
      fetch(`${SCRIPT_URL}?action=getNextID&department=${value}`)
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
document.getElementById("deviceForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  showLoader();
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

  fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: new URLSearchParams(data).toString()
  })
  .then(response => response.json())
  .then(result => {
    hideLoader();
    if (!result.success) {
      throw new Error(result.error || 'Lỗi không xác định');
    }
    alert(result.message);
    document.getElementById("deviceForm").reset();
  })
  .catch(error => {
    hideLoader();
    alert('Lỗi: ' + error.message);
    console.error('Error:', error);
  });
});

// Search functionality
document.getElementById("searchBtn").addEventListener("click", function() {
  showLoader();
  const data = getFormData();
  
  // Validate department
  const deptInput = data.department.trim().toLowerCase();
  const allowedDepartments = ["phcnnl", "phcn nhi", "nth", "cc", "yhct", "kd tbyt", "cdha tdcn xn"];
  
  if (deptInput && !allowedDepartments.includes(deptInput)) {
    hideLoader();
    alert("Không đúng cú pháp cho KHOA PHÒNG SỬ DỤNG. Hãy thử nhập: PHCNNL, PHCN Nhi, NTH, CC, YHCT, KD-TBYT, CĐHA-TDCN-XN.");
    return;
  }

  const params = new URLSearchParams(data).toString();
  fetch(`${SCRIPT_URL}?${params}`)
    .then(response => response.json())
    .then(result => {
      hideLoader();
      if (!result.success) {
        throw new Error(result.error || 'Lỗi tìm kiếm');
      }
      displaySearchResults(result);
    })
    .catch(error => {
      hideLoader();
      console.error("Lỗi tìm kiếm:", error);
      alert("Lỗi tìm kiếm: " + error.message);
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
document.getElementById("deleteBtn").addEventListener("click", function() {
  const deviceID = document.getElementById('deviceID').value.trim();
  if (!deviceID) {
    alert("Vui lòng nhập MÃ THIẾT BỊ của bản ghi cần xóa.");
    return;
  }

  if (confirm(`Bạn có chắc muốn xóa bản ghi có MÃ THIẾT BỊ: ${deviceID}?`)) {
    showLoader();
    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams({
        action: "delete",
        deviceID: deviceID
      }).toString()
    })
    .then(response => response.json())
    .then(result => {
      hideLoader();
      if (!result.success) {
        throw new Error(result.error || 'Lỗi khi xóa dữ liệu');
      }
      alert(result.message);
      document.getElementById("deviceForm").reset();
    })
    .catch(error => {
      hideLoader();
      console.error("Lỗi xóa dữ liệu:", error);
      alert("Lỗi: " + error.message);
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
