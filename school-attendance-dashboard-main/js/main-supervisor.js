(function(){
  function getTheme(){ return document.documentElement.getAttribute('data-theme') || 'light'; }
  function setTogglePressed(){ var btn = document.getElementById('themeToggle'); if(!btn) return; btn.setAttribute('aria-pressed', getTheme()==='dark' ? 'true' : 'false'); }

  function normalizeStr(s){ return String(s||'').toLowerCase(); }
  function inRange(date, start, end){ if(!(date instanceof Date)) return false; if(start && date < start) return false; if(end && date > end) return false; return true; }

  function getFilters(){ return {}; }

  function applyFilters(){
    var all = window.allAbsences || [];
    var rows = all.filter(function(r){ return r.status !== 'archived'; });
    window.renderReports(rows);
    return rows;
  }

  function bindEvents(){
    var si = null, sd = null, ed = null, ex = null;
    var vc = document.getElementById('viewCards');
    var vt = document.getElementById('viewTable');

    if(vc) vc.addEventListener('click', function(){ setView('cards'); });
    if(vt) vt.addEventListener('click', function(){ setView('table'); });
    // Filters removed
  }

  function setView(view){
    var cardsView = document.getElementById('cardsView');
    var tableView = document.getElementById('tableView');
    var viewCardsBtn = document.getElementById('viewCards');
    var viewTableBtn = document.getElementById('viewTable');
    if(view === 'cards'){
      cardsView.classList.remove('hidden');
      tableView.classList.add('hidden');
      viewCardsBtn.classList.add('active');
      viewTableBtn.classList.remove('active');
    } else {
      cardsView.classList.add('hidden');
      tableView.classList.remove('hidden');
      viewCardsBtn.classList.remove('active');
      viewTableBtn.classList.add('active');
      renderTable(applyFilters());
    }
  }

  var currentSort = { key: 'timestamp', dir: 'desc' };

  function renderTable(reports){
    var sorted = reports.slice().sort(function(a,b){
      var aVal = a[currentSort.key];
      var bVal = b[currentSort.key];
      if(currentSort.key === 'timestamp'){
        aVal = aVal instanceof Date ? aVal : new Date(aVal);
        bVal = bVal instanceof Date ? bVal : new Date(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if(aVal < bVal) return currentSort.dir === 'asc' ? -1 : 1;
      if(aVal > bVal) return currentSort.dir === 'asc' ? 1 : -1;
      return 0;
    });

    var tbody = document.getElementById('reportsTableBody');
    tbody.innerHTML = '';
    sorted.forEach(function(r){
      var row = document.createElement('tr');
      var formattedTime = r.timestamp instanceof Date ? r.timestamp.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : r.timestamp;
      row.innerHTML = `
        <td>${r.division}</td>
        <td>${r.class}</td>
        <td>${r.section}</td>
        <td>${r.absentees}</td>
        <td>${r.attendanceStatus || ''}</td>
        <td>${r.reason || ''}</td>
        <td>${formattedTime}</td>
      `;
      tbody.appendChild(row);
    });

    // Update header sort indicators
    var headers = document.querySelectorAll('#reportsTable th');
    headers.forEach(function(th){ th.classList.remove('sort-asc', 'sort-desc'); });
    var keys = ['division', 'class', 'section', 'absentees', 'attendanceStatus', 'reason', 'timestamp'];
    var idx = keys.indexOf(currentSort.key);
    if(idx !== -1){
      headers[idx].classList.add(currentSort.dir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  }

  function bindTableSort(){
    var headers = document.querySelectorAll('#reportsTable th');
    headers.forEach(function(th, i){
      th.style.cursor = 'pointer';
      th.addEventListener('click', function(){
        var keys = ['division', 'class', 'section', 'absentees', 'attendanceStatus', 'reason', 'timestamp'];
        var key = keys[i];
        if(currentSort.key === key){
          currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          currentSort.key = key;
          currentSort.dir = 'asc';
        }
        renderTable(applyFilters());
      });
    });
  }

  // Charts removed

  function init(){ document.documentElement.setAttribute('data-theme','light'); setTogglePressed(); bindEvents(); bindTableSort(); document.addEventListener('absences-updated', applyFilters); applyFilters(); }

  if(document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
