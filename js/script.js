$(document).ready(function () {
  // ==========================================
  // 1. Preloader & Loading Animation
  // ==========================================
  $(window).on('load', function () {
    $('#preloader').css({ opacity: 0, visibility: 'hidden' });
  });
  // Fallback in case window load event already fired or takes too long
  setTimeout(function() {
    $('#preloader').css({ opacity: 0, visibility: 'hidden' });
  }, 1500);

  // ==========================================
  // 2. Scroll Progress & Sticky Navbar
  // ==========================================
  $(window).on('scroll', function () {
    // Scroll progress bar
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height();
    const winHeight = $(window).height();
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    $('#scroll-progress').css('width', scrollPercent + '%');

    // Sticky Navbar
    if (scrollTop > 50) {
      $('.navbar').addClass('scrolled');
    } else {
      $('.navbar').removeClass('scrolled');
    }

    // Back to top button visibility
    if (scrollTop > 300) {
      $('#back-to-top').addClass('show');
    } else {
      $('#back-to-top').removeClass('show');
    }

    // Trigger animations and statistics counter on scroll
    checkAnimations();
    checkStatsCounter();
  });

  // Smooth scroll back to top
  $('#back-to-top').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  // ==========================================
  // 3. Theme Toggle (Dark / Light Mode)
  // ==========================================
  const currentTheme = localStorage.getItem('theme') || 'light';
  $('html').attr('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  $('#theme-toggle').on('click', function () {
    let theme = $('html').attr('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    $('html').attr('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = $('#theme-toggle i');
    if (theme === 'dark') {
      icon.removeClass('fa-moon').addClass('fa-sun');
    } else {
      icon.removeClass('fa-sun').addClass('fa-moon');
    }
  }

  // ==========================================
  // 4. Dynamic Current Year
  // ==========================================
  $('#current-year').text(new Date().getFullYear());

  // ==========================================
  // 5. Active Link Highlighting
  // ==========================================
  const path = window.location.pathname;
  const page = path.split("/").pop();
  
  $('.navbar-nav .nav-link').each(function () {
    const href = $(this).attr('href');
    if (page === href || (page === '' && href === 'index.html')) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });

  // ==========================================
  // 6. Statistics Counter Animation
  // ==========================================
  let statsAnimated = false;
  function checkStatsCounter() {
    const statSection = $('.stats-section');
    if (statSection.length === 0 || statsAnimated) return;

    const topOfWindow = $(window).scrollTop();
    const bottomOfWindow = topOfWindow + $(window).height();
    const topOfStat = statSection.offset().top;
    const bottomOfStat = topOfStat + statSection.outerHeight();

    if (bottomOfWindow > topOfStat && topOfWindow < bottomOfStat) {
      statsAnimated = true;
      $('.stat-number').each(function () {
        const $this = $(this);
        const countTo = parseInt($this.attr('data-count'), 10);
        
        $({ countNum: 0 }).animate({
          countNum: countTo
        },
        {
          duration: 2000,
          easing: 'swing',
          step: function () {
            $this.text(Math.floor(this.countNum));
          },
          complete: function () {
            // Append the '+' sign back to the display if requested
            const appendPlus = $this.attr('data-plus') === 'true';
            $this.text(this.countNum + (appendPlus ? '+' : ''));
          }
        });
      });
    }
  }

  // ==========================================
  // 7. Special Offers Countdown Timer
  // ==========================================
  function startCountdown() {
    const timerElement = $('#countdown-timer');
    if (timerElement.length === 0) return;

    // Default target: 7 days from now
    let expiryDate = timerElement.attr('data-expiry');
    let targetTime = expiryDate ? new Date(expiryDate).getTime() : new Date().getTime() + (7 * 24 * 60 * 60 * 1000);

    const interval = setInterval(function () {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        clearInterval(interval);
        timerElement.html('<h4 class="text-danger my-3">Offer Expired!</h4>');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      $('#days').text(days < 10 ? '0' + days : days);
      $('#hours').text(hours < 10 ? '0' + hours : hours);
      $('#minutes').text(minutes < 10 ? '0' + minutes : minutes);
      $('#seconds').text(seconds < 10 ? '0' + seconds : seconds);
    }, 1000);
  }
  startCountdown();

  // ==========================================
  // 8. Menu Page Filters & Search
  // ==========================================
  // Search bar logic
  $('#menu-search').on('keyup', function () {
    filterMenuItems();
  });

  // Tab filter logic
  $('.menu-filter-btn').on('click', function () {
    $('.menu-filter-btn').removeClass('active');
    $(this).addClass('active');
    filterMenuItems();
  });

  function filterMenuItems() {
    const query = $('#menu-search').val().toLowerCase().trim();
    const activeCategory = $('.menu-filter-btn.active').attr('data-filter');

    $('.menu-item-col').each(function () {
      const itemCategory = $(this).attr('data-category');
      const itemName = $(this).find('.card-title-custom').text().toLowerCase();
      const itemDesc = $(this).find('.card-desc').text().toLowerCase();

      const matchesCategory = activeCategory === 'all' || itemCategory === activeCategory;
      const matchesSearch = query === '' || itemName.includes(query) || itemDesc.includes(query);

      if (matchesCategory && matchesSearch) {
        $(this).fadeIn(300);
      } else {
        $(this).fadeOut(300);
      }
    });
  }

  // ==========================================
  // 9. Blog Page Search & Category Filter
  // ==========================================
  $('#blog-search').on('keyup', function () {
    filterBlogPosts();
  });

  $('.blog-cat-link').on('click', function (e) {
    e.preventDefault();
    $('.blog-cat-link').removeClass('active text-warning');
    $(this).addClass('active text-warning');
    filterBlogPosts();
  });

  function filterBlogPosts() {
    const query = $('#blog-search').val().toLowerCase().trim();
    const activeCategory = $('.blog-cat-link.active').attr('data-cat') || 'all';

    $('.blog-post-col').each(function () {
      const postCategory = $(this).attr('data-category');
      const postTitle = $(this).find('.card-title-custom').text().toLowerCase();
      const postExcerpt = $(this).find('.card-desc').text().toLowerCase();

      const matchesCategory = activeCategory === 'all' || postCategory === activeCategory;
      const matchesSearch = query === '' || postTitle.includes(query) || postExcerpt.includes(query);

      if (matchesCategory && matchesSearch) {
        $(this).fadeIn(300);
      } else {
        $(this).fadeOut(300);
      }
    });
  }

  // ==========================================
  // 10. Masonry Gallery Category Filtering
  // ==========================================
  $('.gallery-filter-btn').on('click', function () {
    $('.gallery-filter-btn').removeClass('active');
    $(this).addClass('active');

    const filterVal = $(this).attr('data-filter');

    if (filterVal === 'all') {
      $('.gallery-item-col').fadeIn(300);
    } else {
      $('.gallery-item-col').each(function () {
        if ($(this).attr('data-category') === filterVal) {
          $(this).fadeIn(300);
        } else {
          $(this).fadeOut(300);
        }
      });
    }
  });

  // ==========================================
  // 11. Lightbox Popup
  // ==========================================
  let galleryImages = [];
  let currentImageIndex = 0;

  // Compile list of visible images when a gallery item is clicked
  $(document).on('click', '.gallery-item', function () {
    galleryImages = [];
    currentImageIndex = 0;
    
    // Find all visible images in the gallery grid
    $('.gallery-item-col:visible').each(function (index) {
      const img = $(this).find('img');
      const src = img.attr('src');
      const title = $(this).find('.gallery-item-title').text();
      
      galleryImages.push({ src: src, title: title });
      
      if (img.attr('src') === src) {
        // Mark match
      }
    });

    const clickedSrc = $(this).find('img').attr('src');
    currentImageIndex = galleryImages.findIndex(img => img.src === clickedSrc);

    openLightbox();
  });

  function openLightbox() {
    if (galleryImages.length === 0) return;
    
    updateLightboxImage();
    $('#lightbox').addClass('show');
    $('body').css('overflow', 'hidden');
  }

  function updateLightboxImage() {
    const imgData = galleryImages[currentImageIndex];
    $('#lightbox-img').attr('src', imgData.src);
    $('#lightbox-caption').text(imgData.title);
  }

  $('.lightbox-close').on('click', function () {
    $('#lightbox').removeClass('show');
    $('body').css('overflow', 'auto');
  });

  $('.lightbox-prev').on('click', function () {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  });

  $('.lightbox-next').on('click', function () {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
  });

  // Close lightbox on click outside the image
  $('#lightbox').on('click', function (e) {
    if ($(e.target).is('#lightbox') || $(e.target).is('.lightbox-content')) {
      $('#lightbox').removeClass('show');
      $('body').css('overflow', 'auto');
    }
  });

  // Keyboard support for Lightbox
  $(document).on('keydown', function (e) {
    if (!$('#lightbox').hasClass('show')) return;
    
    if (e.key === 'Escape') {
      $('#lightbox').removeClass('show');
      $('body').css('overflow', 'auto');
    } else if (e.key === 'ArrowLeft') {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    } else if (e.key === 'ArrowRight') {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      updateLightboxImage();
    }
  });

  // ==========================================
  // 12. Button Ripple Effect
  // ==========================================
  $(document).on('click', '.ripple', function (e) {
    const button = $(this);
    
    // Remove existing ripple spans
    button.find('.ripple-effect').remove();
    
    const ripple = $('<span class="ripple-effect"></span>');
    button.append(ripple);
    
    const diameter = Math.max(button.outerWidth(), button.outerHeight());
    const radius = diameter / 2;
    
    const offset = button.offset();
    const x = e.pageX - offset.left - radius;
    const y = e.pageY - offset.top - radius;
    
    ripple.css({
      width: diameter + 'px',
      height: diameter + 'px',
      left: x + 'px',
      top: y + 'px'
    });
  });

  // ==========================================
  // 13. Form Validations
  // ==========================================
  
  // Custom alerts builder helper
  function showAlert(container, type, message) {
    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    container.html(alertHtml);
  }

  // A. Reservation Form Validation
  $('#reservation-form').on('submit', function (e) {
    e.preventDefault();
    const form = this;
    const alertContainer = $('#reservation-alert');
    alertContainer.html('');

    if (form.checkValidity() === false) {
      e.stopPropagation();
      $(form).addClass('was-validated');
      showAlert(alertContainer, 'danger', 'Please correct the highlighted fields before submitting.');
    } else {
      $(form).removeClass('was-validated');
      
      // Populate and trigger confirmation modal
      $('#confirm-name').text($('#res-name').val());
      $('#confirm-email').text($('#res-email').val());
      $('#confirm-phone').text($('#res-phone').val());
      $('#confirm-date').text($('#res-date').val());
      $('#confirm-time').text($('#res-time').val());
      $('#confirm-guests').text($('#res-guests').val() + ' Guests');
      
      const requests = $('#res-requests').val();
      $('#confirm-requests').text(requests ? requests : 'None');

      const modal = new bootstrap.Modal(document.getElementById('reservationConfirmModal'));
      modal.show();
    }
  });

  // When user clicks final confirm in reservation modal
  $('#btn-confirm-booking').on('click', function() {
    const modalEl = document.getElementById('reservationConfirmModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    // Reset Form
    $('#reservation-form')[0].reset();
    showAlert($('#reservation-alert'), 'success', 'Your reservation request has been received! A confirmation email will be sent shortly.');
  });

  // B. Contact Form Validation
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();
    const form = this;
    const alertContainer = $('#contact-alert');
    alertContainer.html('');

    if (form.checkValidity() === false) {
      e.stopPropagation();
      $(form).addClass('was-validated');
      showAlert(alertContainer, 'danger', 'Please fill in all required fields correctly.');
    } else {
      $(form).removeClass('was-validated');
      showAlert(alertContainer, 'success', 'Thank you! Your message has been sent successfully. We will get back to you soon.');
      form.reset();
    }
  });

  // C. Newsletter Sign Up Form Validation
  $('.newsletter-form').on('submit', function (e) {
    e.preventDefault();
    const emailInput = $(this).find('input[type="email"]');
    const emailVal = emailInput.val().trim();
    
    // Quick regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailVal === '' || !emailRegex.test(emailVal)) {
      alert('Please enter a valid email address.');
    } else {
      alert('Success! Thank you for subscribing to our newsletter.');
      emailInput.val('');
    }
  });

  // ==========================================
  // 14. Scroll Reveal Animations (Simplified Observer)
  // ==========================================
  function checkAnimations() {
    $('.animated').each(function () {
      const element = $(this);
      const topOfWindow = $(window).scrollTop();
      const bottomOfWindow = topOfWindow + $(window).height();
      const topOfElement = element.offset().top;
      
      // If element is visible in window view
      if (bottomOfWindow > topOfElement + 40) {
        element.addClass('show-anim');
      }
    });
  }

  // Initialize checks
  setTimeout(function() {
    checkAnimations();
    checkStatsCounter();
  }, 100);
});
