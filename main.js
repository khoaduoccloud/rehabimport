document.getElementById("deviceForm").addEventListener("submit", function(e) {
  e.preventDefault();

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
    user: document.getElementById('user').value
  };

  // Chuyển object thành form-encoded string (key=value&key=value...)
  const formData = new URLSearchParams(data).toString();

  fetch('https://script.google.com/macros/s/AKfycbxcgi-BeUpMF1UPuAlZeKv6LzaEE1ntudYX6G3EkzXb8dboX5c5OjkJeJ_RFNgieesBtg/exec', { 
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: new URLSearchParams(data).toString()
  })
  .then(response => response.text())
  .then(result => {
    alert('Dữ liệu đã được lưu thành công vào Google Trang tính!');
    console.log(result);
	document.getElementById("deviceForm").reset(); // Xóa dữ liệu sau khi gửi thành công
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
	   // Xử lý sự kiện cho 3 nút bên phải
    document.getElementById("searchBtn").addEventListener("click", function() {
      const data = getFormData();
      // Tạo query string từ các trường
      const params = new URLSearchParams(data).toString();
      // Gửi GET request lên doGet (Google Apps Script)
      fetch('https://script.google.com/macros/s/AKfycbxcgi-BeUpMF1UPuAlZeKv6LzaEE1ntudYX6G3EkzXb8dboX5c5OjkJeJ_RFNgieesBtg/exec' + '?' + params)
        .then(r => r.json())
        .then(json => displaySearchResults(json))
        .catch(err => console.error("Lỗi tìm kiếm:", err));
    });

    // Hàm lấy dữ liệu form thành object
    function getFormData() {
      return {
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
    user: document.getElementById('user').value
        // ... các trường khác ...
      };
    }

    // Hàm hiển thị kết quả dưới dạng bảng
    function displaySearchResults(data) {
      const container = document.getElementById("searchResults");
      container.innerHTML = ""; // Xóa kết quả cũ

      if (!data || !data.results || data.results.length === 0) {
        container.innerHTML = "<p>Không tìm thấy kết quả phù hợp.</p>";
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
        th.style.border = "1px solid #ccc";
        th.style.padding = "8px";
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Tạo body
      const tbody = document.createElement("tbody");
      data.results.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell;
          td.style.border = "1px solid #ccc";
          td.style.padding = "8px";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      container.appendChild(table);
    }
    document.getElementById("infoBtn").addEventListener("click", function() {
  // Mở file CV từ GitHub trong tab mới
  window.open('cv.html', '_blank');
});
	   

function displaySearchResults(data) {
  var container = document.getElementById("searchResults");
  container.innerHTML = ""; // Xoá kết quả cũ
  if (!data.results || data.results.length === 0) {
    container.innerHTML = "<p>Không tìm thấy kết quả nào.</p>";
    return;
  }
  // Tạo bảng hiển thị kết quả
  var table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  
  // Tạo header bảng
  var thead = document.createElement("thead");
  var headerRow = document.createElement("tr");
  data.headers.forEach(function(header) {
    var th = document.createElement("th");
    th.textContent = header;
    th.style.border = "1px solid #ccc";
    th.style.padding = "8px";
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Tạo body bảng
  var tbody = document.createElement("tbody");
  data.results.forEach(function(row) {
    var tr = document.createElement("tr");
    row.forEach(function(cell) {
      var td = document.createElement("td");
      td.textContent = cell;
      td.style.border = "1px solid #ccc";
      td.style.padding = "8px";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  
  container.appendChild(table);
}
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
    row.forEach(cell => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

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
    fetch('https://script.google.com/macros/s/AKfycbxcgi-BeUpMF1UPuAlZeKv6LzaEE1ntudYX6G3EkzXb8dboX5c5OjkJeJ_RFNgieesBtg/exec', {
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
