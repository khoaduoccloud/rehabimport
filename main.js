// Khởi tạo các biến toàn cục
let searchCache = {};
let currentPage = 1;
const ITEMS_PER_PAGE = 10;
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw66ska6hRmdYjOdXdARZHdbnd5JDJofUTAtStvBPX2RfROm-VSVvi0IvUR8uvYYvw9KA/exec';
const darkmodeToggle = document.getElementById('darkmode-toggle');
const cherryBlossoms = document.getElementById('cherry-blossoms');
const perpetualHearts = document.getElementById('perpetual-hearts');
const heartsContainer = document.getElementById('hearts-container');


// Custom Cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
  cursor.classList.add('active');
});

document.addEventListener('mouseup', () => {
  cursor.classList.remove('active');
});

// Phan DarkMode
// Enhanced dark mode functionality with system preference detection
if (darkmodeToggle) {
  // Check if user has a saved preference first
  const savedDarkMode = localStorage.getItem('darkMode');
  
  // If no saved preference, check system preference
  if (savedDarkMode === null) {
      // Check if user prefers dark mode at system level
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Apply system preference
      if (prefersDarkMode) {
          document.body.classList.add('dark-mode');
          darkmodeToggle.checked = true;
      }
  } else if (savedDarkMode === 'enabled') {
      // Apply saved user preference if it exists
      document.body.classList.add('dark-mode');
      darkmodeToggle.checked = true;
  }
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Only apply system changes if user hasn't set a preference
      if (localStorage.getItem('darkMode') === null) {
          const systemPrefersDark = e.matches;
          document.body.classList.toggle('dark-mode', systemPrefersDark);
          darkmodeToggle.checked = systemPrefersDark;
      }
  });
  
  // Toggle handler remains for manual control
  darkmodeToggle.addEventListener('change', function() {
      document.body.classList.toggle('dark-mode', this.checked);
      
      // Store user preference
      if (this.checked) {
          localStorage.setItem('darkMode', 'enabled');
      } else {
          localStorage.setItem('darkMode', 'disabled');
      }
  });
}


// Fix dark mode functionality - improved implementation
if (darkmodeToggle) {
  // Check if user has a saved preference first
  const savedDarkMode = localStorage.getItem('darkMode');
  
  // Default to light mode if no preference is saved
  if (savedDarkMode === 'enabled') {
      document.body.classList.add('dark-mode');
      darkmodeToggle.checked = true;
  } else {
      document.body.classList.remove('dark-mode'); // Ensure light mode
      darkmodeToggle.checked = false;
  }
  
  // Apply saved preference or system preference if no saved preference
  if (savedDarkMode === 'enabled') {
      document.body.classList.add('dark-mode');
      darkmodeToggle.checked = true;
  } else if (savedDarkMode === null) {
      // Check system preference only if user hasn't set a preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDarkMode) {
          document.body.classList.add('dark-mode');
          darkmodeToggle.checked = true;
      }
  }
  
  // Event listener for toggle change with debugging
  darkmodeToggle.addEventListener('change', function() {
      console.log('Dark mode toggle changed. Checked:', this.checked);
      if (this.checked) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('darkMode', 'enabled');
          console.log('Dark mode enabled and saved to localStorage');
      } else {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('darkMode', 'disabled');
          console.log('Dark mode disabled and saved to localStorage');
      }
  });
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Only apply system changes if user hasn't set a preference
      if (localStorage.getItem('darkMode') === null) {
          const systemPrefersDark = e.matches;
          document.body.classList.toggle('dark-mode', systemPrefersDark);
          darkmodeToggle.checked = systemPrefersDark;
          console.log('System preference changed, dark mode:', systemPrefersDark);
      }
  });

  // Enhanced dark mode toggle logic
  darkmodeToggle.addEventListener('change', function () {
    const isDarkMode = this.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);

    // Reset dynamically applied styles
    if (!isDarkMode) {
        // Reset placeholder and input styles
        document.querySelectorAll('input, select').forEach(el => {
            el.style.color = ''; // Reset text color
            el.style.backgroundColor = ''; // Reset background color
        });

        // Reset footer styles
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.style.backgroundColor = ''; // Reset background color
            footer.style.color = ''; // Reset text color
        }
    }

    // Store user preference
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
  });

} else {
  console.warn('Dark mode toggle element not found');
}
//KET THUC DARKMODE

// Improved scrollbar decoration function that works on all pages
function createScrollbarDecoration() {
  const scrollDecoration = document.createElement('div');
  scrollDecoration.className = 'scrollbar-decoration';
  
  // Add floating hearts
  for (let i = 1; i <= 3; i++) {
      const heart = document.createElement('div');
      heart.className = `scrollbar-heart scroll-h${i}`;
      scrollDecoration.appendChild(heart);
  }
  
  document.body.appendChild(scrollDecoration);
  
  // Show scrollbar decoration when scrolling is possible
  function checkScrollable() {
      const isBodyScrollable = document.body.scrollHeight > window.innerHeight;
      const scrollableContainers = Array.from(document.querySelectorAll('.container')).filter(
          el => el.scrollHeight > el.clientHeight
      );
      
      if (isBodyScrollable || scrollableContainers.length > 0) {
          scrollDecoration.style.opacity = '0.7';
      } else {
          scrollDecoration.style.opacity = '0.4';
      }
  }
  
  // Check on load and resize
  checkScrollable();
  window.addEventListener('resize', checkScrollable);
  
  // Enhance visibility during scrolling
  document.addEventListener('scroll', function() {
      scrollDecoration.style.opacity = '1';
      
      // Return to normal opacity after a delay
      clearTimeout(scrollDecoration.timeoutId);
      scrollDecoration.timeoutId = setTimeout(() => {
          checkScrollable();
      }, 800);
  }, true);
  
  // Monitor DOM changes that might affect scrollability
  const observer = new MutationObserver(checkScrollable);
  observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
  });
}

// Call function to create scrollbar decoration
createScrollbarDecoration();


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
