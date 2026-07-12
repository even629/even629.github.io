document.addEventListener('DOMContentLoaded', function () {
  var ele = document.getElementById('post-outdate-notice');
  if (!ele) return;

  var limitDay = parseInt(ele.getAttribute('data-limit-day'), 10);
  var messagePrev = ele.getAttribute('data-message-prev');
  var messageNext = ele.getAttribute('data-message-next');
  var postUpdate = ele.getAttribute('data-post-update');

  var updateDate = new Date(postUpdate);
  var now = new Date();
  var diffDay = Math.floor((now - updateDate) / (1000 * 60 * 60 * 24));

  if (diffDay >= limitDay) {
    ele.textContent = messagePrev + ' ' + diffDay + ' ' + messageNext;
    ele.hidden = false;
  }
});
