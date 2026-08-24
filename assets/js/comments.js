(function () {
  var section = document.getElementById('comments');
  if (!section) return;

  var API_URL = section.dataset.apiUrl;
  var POST_ID = section.dataset.postId;
  var POST_TITLE = section.dataset.postTitle;

  var listEl = document.getElementById('comments-list');
  var form = document.getElementById('comment-form');
  var nameInput = document.getElementById('comment-name');
  var textInput = document.getElementById('comment-text');
  var honeypot = document.getElementById('comment-website');
  var statusEl = document.getElementById('comment-status');
  var submitBtn = document.getElementById('comment-submit');

  var currentComments = [];
  var CACHE_KEY = 'comments_cache:' + POST_ID;

  function readCache() {
    try {
      var parsed = JSON.parse(localStorage.getItem(CACHE_KEY));
      return (parsed && Array.isArray(parsed.comments)) ? parsed.comments : null;
    } catch (e) {
      return null;
    }
  }

  function writeCache(comments) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ comments: comments }));
    } catch (e) {
      // storage unavailable or full — caching is best-effort, ignore
    }
  }

  function resolveClientIp() {
    return fetch('https://api.ipify.org?format=json')
      .then(function (res) { return res.json(); })
      .then(function (data) { return (data && data.ip) ? data.ip : ''; })
      .catch(function () { return ''; });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function renderComments(comments) {
    currentComments = comments;
    if (!comments.length) {
      listEl.innerHTML = '<p class="comments-empty">No comments yet. Be the first to say something.</p>';
      return;
    }
    listEl.innerHTML = comments.map(function (c) {
      return (
        '<div class="comment-item">' +
          '<div class="comment-item-header">' +
            '<span class="comment-author">' + escapeHtml(c.name || 'Anonymous') + '</span>' +
            '<span class="comment-date">' + formatDate(c.timestamp) + '</span>' +
          '</div>' +
          '<p class="comment-text">' + escapeHtml(c.comment) + '</p>' +
        '</div>'
      );
    }).join('');
  }

  function loadComments() {
    var cached = readCache();
    if (cached) {
      renderComments(cached);
    } else {
      listEl.innerHTML = '<p class="comments-loading">Loading comments…</p>';
    }

    if (!API_URL || API_URL.indexOf('REPLACE_WITH') === 0) {
      if (!cached) listEl.innerHTML = '<p class="comments-empty">Comments are not configured yet.</p>';
      return;
    }

    fetch(API_URL + '?post=' + encodeURIComponent(POST_ID))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var fresh = Array.isArray(data) ? data : [];
        if (JSON.stringify(fresh) !== JSON.stringify(cached)) {
          renderComments(fresh);
        }
        writeCache(fresh);
      })
      .catch(function () {
        if (!cached) {
          listEl.innerHTML = '<p class="comments-empty">Could not load comments right now.</p>';
        }
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (honeypot.value) return;

    var name = nameInput.value.trim();
    var comment = textInput.value.trim();
    if (!name || !comment) return;

    submitBtn.disabled = true;
    statusEl.textContent = 'Posting…';

    var payload = {
      post: POST_ID,
      title: POST_TITLE,
      name: name.slice(0, 50),
      comment: comment.slice(0, 1000),
      timestamp: new Date().toISOString()
    };

    resolveClientIp()
      .then(function (ip) {
        payload.ip = ip;
        return fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (!res || res.ok === false) throw new Error(res && res.error);
        statusEl.textContent = 'Posted!';
        renderComments(currentComments.concat([payload]));
        writeCache(currentComments);
        form.reset();
      })
      .catch(function () {
        statusEl.textContent = 'Something went wrong. Please try again.';
      })
      .then(function () {
        submitBtn.disabled = false;
        setTimeout(function () { statusEl.textContent = ''; }, 4000);
      });
  });

  loadComments();
})();
