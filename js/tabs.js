/**
 * Tabs switching behavior — ported from Butterfly theme
 * Handles tabs, subtabs, and subsubtabs with independent nesting
 */
$(document).ready(function() {
  // For each tabs block, set up click handlers independently
  $('.tabs').each(function() {
    var $tabs = $(this);

    $tabs.find('.nav-tabs .tab').on('click', function() {
      var $clicked = $(this);
      var $navTabs = $clicked.closest('.nav-tabs');
      var $tabContents = $navTabs.next('.tab-contents');
      var index = $navTabs.find('.tab').index($clicked);

      // Deactivate all tabs in this group
      $navTabs.find('.tab').removeClass('active');
      $tabContents.find('.tab-item-content').removeClass('active');

      // Activate the clicked tab and corresponding content
      $clicked.addClass('active');
      $tabContents.find('.tab-item-content').eq(index).addClass('active');
    });

    // "to top" button scrolls to the top of this tabs block
    $tabs.find('.tab-to-top button').on('click', function() {
      $('html, body').animate({ scrollTop: $tabs.offset().top - 20 }, 'fast');
    });
  });
});
