// Description: set sticky header
// ==
(function () {
  let $header = $('header');

  function stickHeader() {
    let scroll = $(window).scrollTop();

    if (scroll >= 1) {
      $header.addClass('sticky');
    }

    else {
      $header.removeClass('sticky');
    }
  }

  stickHeader();
  $(window).on('scroll', stickHeader);
})();
// ==
// Description: toggle sort list
// ==
(function () {
  
  // *Variables*
  let $wrapper = $('.header__sort'),
      $toggle  = $('.header__sort--name'),
      $list    = $('.header__sort--list'),
      $links   = $('.header__sort--link');

  // Status
  var isBinded, isOpen;

  // Focus manager
  var wrapper = document.querySelector('.header__sort'),
      toggle  = document.querySelector('.header__sort--name');


  // *Functions*
  function toggleSortList() {
    // Change open status
    isOpen = !isOpen;

    // Toggle sort list
    $list.stop().fadeToggle(300).css('display', 'flex');

    // Focus manager
    if (isOpen) {
      focusManager.capture(wrapper);
    } else {
      focusManager.release(toggle);
    }
  }
  
  function functionBinder() {
    // Take window width
    let windowWidth = $(window).width();
    
    // If tablet resolution
    if (windowWidth <= 768) {
      // Remove disable attribute from toggle
      $toggle.removeAttr('disabled');

      // Bind toggle functions
      if (!isBinded) {
        $toggle.on('click', toggleSortList);
        $links.on('click', toggleSortList);
        $(document).on('mouseup', sortListCloser);
        // change status
        isBinded = true;
      }
    } else {
      // Set disable attribute to toggle
      $toggle.attr('disabled', 'disabled');

      // Unbind toggle functions
      $toggle.off('click', toggleSortList);
      $links.off('click', toggleSortList);
      $(document).off('mouseup', sortListCloser);
      // change status
      isBinded = false;
    }
  }

  function sortListCloser(event) {
    if (!$wrapper.is(event.target) && $wrapper.has(event.target).length === 0 && isOpen) {
      // Close list
      $list.stop().fadeOut(300);
      
      // Release focus managar
      focusManager.release();
      isOpen = false;
    }
  }

  
  // *Events*
  functionBinder();
  $(window).on('resize', functionBinder);
})();