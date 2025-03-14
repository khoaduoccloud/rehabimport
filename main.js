// Thêm nút chuyển đổi Dark mode
function addDarkModeToggle() {
  const themeButton = document.createElement('button');
  themeButton.className = 'theme-switch';
  themeButton.innerHTML = '<i class="fas fa-moon"></i> Chế độ tối';
  document.body.appendChild(themeButton);

  // Kiểm tra theme đã lưu
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
      themeButton.innerHTML = '<i class="fas fa-sun"></i> Chế độ sáng';
    }
  }

  // Xử lý sự kiện click
  themeButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    themeButton.innerHTML = newTheme === 'dark' 
      ? '<i class="fas fa-sun"></i> Chế độ sáng'
      : '<i class="fas fa-moon"></i> Chế độ tối';
  });
}


// Khởi tạo các tính năng khi trang web load xong
document.addEventListener('DOMContentLoaded', function() {
  addDarkModeToggle();
  addImagePreview();
});

function showLoader() {
	document.getElementById("loader").style.display = "block";
}
function hideLoader() {
	document.getElementById("loader").style.display = "none";
}
// thêm tính năng validation
// Thêm vào main.js
function validateForm() {
  const deviceID = document.getElementById('deviceID').value.trim();
  const deviceName = document.getElementById('deviceName').value.trim();
  
  if (!deviceID) {
    alert('Vui lòng nhập Mã thiết bị');
    return false;
  }

  if (!deviceName) {
    alert('Vui lòng nhập Tên thiết bị');
    return false;
  }

  // Validate định dạng mã thiết bị
  const deviceIDPattern = /^[A-Za-z]+\.[0-9]+$/;
  if (!deviceIDPattern.test(deviceID)) {
    alert('Mã thiết bị không đúng định dạng (VD: PHCNNL.01)');
    return false;
  }

  return true;
}
document.getElementById("deviceForm").addEventListener("submit", function(e) {
  e.preventDefault();
if (!validateForm()) return;
	//Hiển thị loader
	showLoader();
  // Lấy dữ liệu từ form
  var data = {
    deviceID: document.getElementById('deviceID').value,
    deviceName: document.getElementById('deviceName').value,
    deviceType: document.getElementById('deviceType').value,
    modelSerial: document.getElementById('modelSerial').value,
    originalPrice: document.getElementById('originalPrice').value,
    manufactureYear: document.getElementById('manufactureYear').value,
    usageYear: document.getElementById('usageYear').value,
    manufacturer: document.getElementById('manufacturer').value,
    country: document.getElementById('country').value,
    department: document.getElementById('department').value,
    user: document.getElementById('user').value,
    source: document.getElementById('source').value,
    imageURL: document.getElementById('imageURL').value
  };

  // Chuyển object thành form-encoded string (key=value&key=value...)
  const formData = new URLSearchParams(data).toString();

  fetch('https://script.google.com/macros/s/AKfycbzLwPv73CTRv5CvGp4RycQsWnZDLd8x2G7_fOsVZPiFygR8Pm5UTB08TSLtPU75B-8wdQ/exec', { 
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: new URLSearchParams(data).toString()
  })
  .then(response => response.text())
  .then(result => {
	  hideLoader(); // Ẩn loader khi hoàn thành
    alert('Dữ liệu đã được lưu thành công vào Google Trang tính!');
    console.log(result);
	document.getElementById("deviceForm").reset(); // Xóa dữ liệu sau khi gửi thành công
  })
  .catch(error => {
	  hideLoader();
    console.error('Error:', error);
  });
});
	   // Xử lý sự kiện cho 3 nút bên phải
    document.getElementById("searchBtn").addEventListener("click", function() {
	    showLoader(); // Hiển thị loader trước khi gửi request
      const data = getFormData();
	    // Kiểm tra trường 'department'
  const deptInput = data.department.trim().toLowerCase();
  // Danh sách các giá trị được phép (ở dạng lowercase)
  const allowedDepartments = ["phcnnl", "phcn nhi", "nth", "cc", "yhct", "kd tbyt", "cdha tdcn xn"];
  
  // Nếu người dùng nhập vào trường này (không rỗng) và không nằm trong danh sách cho phép
  if (deptInput && !allowedDepartments.includes(deptInput)) {
    alert("Không đúng cú pháp cho KHOA PHÒNG SỬ DỤNG. Hãy thử nhập: PHCNNL, PHCN Nhi, NTH, CC, YHCT, KD-TBYT, CĐHA-TDCN-XN.");
    return; // Ngừng xử lý tìm kiếm
  }
      // Tạo query string từ các trường
      const params = new URLSearchParams(data).toString();
      // Gửi GET request lên doGet (Google Apps Script)
      fetch('https://script.google.com/macros/s/AKfycbzLwPv73CTRv5CvGp4RycQsWnZDLd8x2G7_fOsVZPiFygR8Pm5UTB08TSLtPU75B-8wdQ/exec' + '?' + params)
        .then(r => r.json())
        .then(json => {
		hideLoader();
		displaySearchResults(json);
	})
        .catch(err => {
		hideLoader();
		console.error("Lỗi tìm kiếm:", err);
	});
    });

    // Hàm lấy dữ liệu form thành object
    function getFormData() {
      const data = {
        deviceID: document.getElementById('deviceID').value,
    deviceName: document.getElementById('deviceName').value,
    deviceType: document.getElementById('deviceType').value,
    modelSerial: document.getElementById('modelSerial').value,
    originalPrice: document.getElementById('originalPrice').value,
    manufactureYear: document.getElementById('manufactureYear').value,
    usageYear: document.getElementById('usageYear').value,
    manufacturer: document.getElementById('manufacturer').value,
    country: document.getElementById('country').value,
    department: document.getElementById('department').value,
    user: document.getElementById('user').value,
	source: document.getElementById('source').value,
	imageURL: document.getElementById('imageURL').value
        // ... các trường khác ...
      };
	console.log("Form data: ", data);
	    return data;
    }

    // Hàm hiển thị thông tin
    document.getElementById("infoBtn").addEventListener("click", function() {
	    showLoader(); // Hiển thị loader trước khi gửi request
  // Mở file CV từ GitHub trong tab mới
  window.open('cv.html', '_blank');
	    hideLoader();
});
	   

// Hàm hiển thị kết quả tìm kiếm trong modal
function displaySearchResults(data) {
  // Tìm phần tử modal
  const modal = document.getElementById("searchModal");
  const modalResults = document.getElementById("modalResults");

  // Xoá nội dung cũ
  modalResults.innerHTML = "";

  // Kiểm tra dữ liệu
  if (!data || !data.results || data.results.length === 0) {
    modalResults.innerHTML = "<p>Không tìm thấy kết quả nào.</p>";
    // Hiện modal để báo không có kết quả
    modal.style.display = "block";
    return;
  }

  // Tạo bảng
  const table = document.createElement("table");
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";

  // Tạo header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  data.headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Tạo body
  const tbody = document.createElement("tbody");
  data.results.forEach(row => {
    const tr = document.createElement("tr");
    row.forEach((cell, index) => {
      const td = document.createElement("td");
      
      // Xử lý đặc biệt cho cột hình ảnh
      if (index === 13 && cell) { // Giả sử cột 13 là cột hình ảnh
        const img = document.createElement("img");
        img.src = cell;
        img.alt = "Hình ảnh thiết bị";
        img.onerror = function() {
          this.src = 'placeholder.png'; // Ảnh mặc định khi không tải được
          this.alt = 'Không có hình ảnh';
        };
        
        // Thêm chức năng xem ảnh full size
        img.onclick = function() {
          const fullImg = window.open(cell, '_blank');
          if (!fullImg) {
            alert('Vui lòng cho phép popup để xem ảnh full size');
          }
        };
        
        td.appendChild(img);
      } else {
        // Định dạng số cho cột nguyên giá
        if (index === 5) { // Giả sử cột 5 là nguyên giá
          td.textContent = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(cell);
        } else {
          td.textContent = cell;
        }
      }
      
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  // Đưa bảng vào modal
  modalResults.appendChild(table);

  // Hiện modal
  modal.style.display = "block";
}
document.getElementById("closeModal").addEventListener("click", function() {
  document.getElementById("searchModal").style.display = "none";
});
window.addEventListener("click", function(e) {
  const modal = document.getElementById("searchModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
document.getElementById("refreshBtn").addEventListener("click", function() {
  window.location.reload();
});
// Xóa dữ liệu
document.getElementById("deleteBtn").addEventListener("click", function() {
  var deviceID = document.getElementById('deviceID').value.trim();
  if (!deviceID) {
    alert("Vui lòng nhập MÃ THIẾT BỊ của bản ghi cần xóa.");
    return;
  }
  if (confirm("Bạn có chắc muốn xóa bản ghi có MÃ THIẾT BỊ: " + deviceID + "?")) {
    var data = {
      action: "delete",
      deviceID: deviceID
    };
    fetch('https://script.google.com/macros/s/AKfycbzLwPv73CTRv5CvGp4RycQsWnZDLd8x2G7_fOsVZPiFygR8Pm5UTB08TSLtPU75B-8wdQ/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams(data).toString()
    })
    .then(response => response.text())
    .then(result => {
      alert(result);
      // Optionally, refresh the page or clear form
      document.getElementById("deviceForm").reset();
    })
    .catch(error => {
      console.error("Lỗi xóa dữ liệu:", error);
      alert("Đã xảy ra lỗi khi xóa dữ liệu.");
    });
  }
});
// thêm tính năng phân trang, loading, cache
let searchCache = {};
let currentPage = 1;
const ITEMS_PER_PAGE = 10;

function displaySearchResults(data) {
  const modal = document.getElementById("searchModal");
  const modalResults = document.getElementById("modalResults");
  modalResults.innerHTML = "";

  if (!data || !data.results || data.results.length === 0) {
    modalResults.innerHTML = "<p>Không tìm thấy kết quả nào.</p>";
    modal.style.display = "block";
    return;
  }

  // Tính toán phân trang
  const totalPages = Math.ceil(data.results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = data.results.slice(startIndex, endIndex);

  // Tạo bảng kết quả
  const table = createResultTable(data.headers, currentPageData);
  
  // Tạo điều khiển phân trang
  const pagination = createPagination(totalPages);

  modalResults.appendChild(table);
  modalResults.appendChild(pagination);
  modal.style.display = "block";
}

function createPagination(totalPages) {
  const div = document.createElement("div");
  div.className = "pagination";
  
  // Nút Previous
  if (currentPage > 1) {
    const prev = document.createElement("button");
    prev.textContent = "Trang trước";
    prev.onclick = () => changePage(currentPage - 1);
    div.appendChild(prev);
  }

  // Số trang
  const pageInfo = document.createElement("span");
  pageInfo.textContent = `Trang ${currentPage}/${totalPages}`;
  div.appendChild(pageInfo);

  // Nút Next
  if (currentPage < totalPages) {
    const next = document.createElement("button");
    next.textContent = "Trang sau";
    next.onclick = () => changePage(currentPage + 1);
    div.appendChild(next);
  }

  return div;
}
