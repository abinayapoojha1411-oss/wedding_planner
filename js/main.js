/**
 * ETERNAL MOMENTS WEDDINGS - MAIN INTERACTIVE LOGIC
 * Features:
 * - Sticky Navigation & Mobile Drawer
 * - Filterable Portfolio & Working Lightbox with Keyboard & Touch controls
 * - Real Testimonial Carousel with Auto-play & Dots
 * - Interactive Inquiry Form with Validation, URL param pre-selection, and Success Modal
 * - Floating WhatsApp Button & Back-To-Top
 * - FAQ Accordions & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initActiveNavLink();
  initBackToTop();
  initTestimonialSlider();
  initPortfolioGallery();
  initInquiryForm();
  initFaqAccordions();
  initNewsletterForm();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL EFFECTS
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!mobileToggle || !mobileDrawer || !mobileOverlay) return;

  const openDrawer = () => {
    mobileDrawer.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  mobileToggle.addEventListener('click', openDrawer);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeDrawer);
  mobileOverlay.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   3. ACTIVE NAV LINK DETECTION
   ========================================================================== */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Normalize both
    const linkPath = href.split('/').pop();
    if (
      linkPath === currentPath ||
      (currentPath === '' && linkPath === 'index.html') ||
      (currentPath === '/' && linkPath === 'index.html')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   5. TESTIMONIAL SLIDER / CAROUSEL
   ========================================================================== */
function initTestimonialSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoPlayInterval = null;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  };

  const goToSlide = (index) => {
    currentIndex = index;
    showSlide(currentIndex);
    resetAutoPlay();
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 6500);
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  // Hover to pause
  const sliderEl = document.querySelector('.testimonial-slider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', stopAutoPlay);
    sliderEl.addEventListener('mouseleave', startAutoPlay);
  }

  showSlide(0);
  startAutoPlay();
}

/* ==========================================================================
   6. PORTFOLIO FILTERABLE GALLERY & LIGHTBOX
   ========================================================================== */
function initPortfolioGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightboxModal = document.querySelector('.lightbox-modal');

  if (!galleryItems.length) return;

  // 1. FILTERING
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 2. LIGHTBOX
  if (!lightboxModal) return;

  const lightboxImg = lightboxModal.querySelector('.lightbox-img');
  const captionTitle = lightboxModal.querySelector('.lightbox-caption-title');
  const captionDesc = lightboxModal.querySelector('.lightbox-caption-desc');
  const counterEl = lightboxModal.querySelector('.lightbox-counter');
  const closeBtn = lightboxModal.querySelector('.lightbox-close');
  const prevBtn = lightboxModal.querySelector('.lightbox-prev');
  const nextBtn = lightboxModal.querySelector('.lightbox-next');

  let visibleItems = [];
  let currentLightboxIndex = 0;

  const updateVisibleItems = () => {
    visibleItems = galleryItems.filter(item => item.style.display !== 'none');
  };

  const openLightbox = (index) => {
    updateVisibleItems();
    if (!visibleItems.length) return;
    
    currentLightboxIndex = index;
    renderLightboxItem();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  const renderLightboxItem = () => {
    const item = visibleItems[currentLightboxIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const coupleName = item.getAttribute('data-couple') || item.querySelector('.gallery-item-couple')?.innerText || 'Celebration of Love';
    const location = item.getAttribute('data-location') || item.querySelector('.gallery-item-location')?.innerText || 'Luxury Wedding';
    const story = item.getAttribute('data-story') || 'An unforgettable celebration of eternal love and breathtaking elegance.';

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = coupleName;
    }

    if (captionTitle) captionTitle.innerText = coupleName;
    if (captionDesc) captionDesc.innerText = `${location} — ${story}`;
    if (counterEl) counterEl.innerText = `${currentLightboxIndex + 1} of ${visibleItems.length}`;
  };

  const lightboxNext = () => {
    if (!visibleItems.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
    renderLightboxItem();
  };

  const lightboxPrev = () => {
    if (!visibleItems.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
    renderLightboxItem();
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const itemIndex = visibleItems.indexOf(item);
      if (itemIndex !== -1) {
        openLightbox(itemIndex);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', lightboxNext);
  if (prevBtn) prevBtn.addEventListener('click', lightboxPrev);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft') lightboxPrev();
  });
}

/* ==========================================================================
   7. INQUIRY FORM WITH VALIDATION, URL PRE-SELECTION & SUCCESS MODAL
   ========================================================================== */
function initInquiryForm() {
  const inquiryForm = document.getElementById('weddingInquiryForm');
  const serviceSelect = document.getElementById('serviceSelect');
  const successModal = document.getElementById('inquirySuccessModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const successDetailsEl = document.getElementById('successDetailsPreview');
  const directWhatsAppConfirmBtn = document.getElementById('directWhatsAppConfirm');

  // 1. Auto-select package or service from URL query params (e.g. ?package=Premium or ?service=destination)
  if (serviceSelect) {
    const params = new URLSearchParams(window.location.search);
    const packageParam = params.get('package');
    const serviceParam = params.get('service');

    if (packageParam) {
      const match = Array.from(serviceSelect.options).find(opt => 
        opt.value.toLowerCase().includes(packageParam.toLowerCase()) ||
        opt.text.toLowerCase().includes(packageParam.toLowerCase())
      );
      if (match) {
        serviceSelect.value = match.value;
      }
    } else if (serviceParam) {
      const match = Array.from(serviceSelect.options).find(opt => 
        opt.value.toLowerCase().includes(serviceParam.toLowerCase()) ||
        opt.text.toLowerCase().includes(serviceParam.toLowerCase())
      );
      if (match) {
        serviceSelect.value = match.value;
      }
    }
  }

  if (!inquiryForm) return;

  // 2. Real-time validation helper
  const validateField = (input) => {
    const isRequired = input.hasAttribute('required');
    let isValid = true;
    const value = input.value.trim();

    if (isRequired && !value) {
      isValid = false;
    } else if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    } else if (input.type === 'tel' && value) {
      // Allow phone with at least 10 digits
      const digits = value.replace(/\D/g, '');
      isValid = digits.length >= 10;
    }

    if (!isValid) {
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
    return isValid;
  };

  // Add live listeners
  const inputs = inquiryForm.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
    input.addEventListener('blur', () => {
      validateField(input);
    });
  });

  // 3. Form submit handler
  inquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isAllValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isAllValid = false;
      }
    });

    if (!isAllValid) {
      // Focus first error
      const firstError = inquiryForm.querySelector('.form-control.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Capture values
    const fullName = document.getElementById('fullName')?.value.trim() || '';
    const phone = document.getElementById('phone')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const weddingDate = document.getElementById('weddingDate')?.value || 'To be decided';
    const venue = document.getElementById('venueLocation')?.value.trim() || 'Undecided / Open to recommendations';
    const guestCount = document.getElementById('guestCount')?.value || 'Undecided';
    const service = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'General Inquiry';
    const message = document.getElementById('messageNotes')?.value.trim() || 'No specific notes provided.';

    const inquiryRecord = {
      id: 'EMW-' + Date.now().toString().slice(-6),
      fullName,
      phone,
      email,
      weddingDate,
      venue,
      guestCount,
      service,
      message,
      submittedAt: new Date().toISOString()
    };

    // Store in localStorage
    try {
      const past = JSON.parse(localStorage.getItem('eternal_moments_inquiries') || '[]');
      past.unshift(inquiryRecord);
      localStorage.setItem('eternal_moments_inquiries', JSON.stringify(past));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Populate success modal preview
    if (successDetailsEl) {
      successDetailsEl.innerHTML = `
        <p><strong>Ref Code:</strong> ${inquiryRecord.id}</p>
        <p><strong>Couple / Name:</strong> ${fullName}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Tentative Date:</strong> ${weddingDate}</p>
        <p><strong>Location:</strong> ${venue}</p>
      `;
    }

    // Pre-fill WhatsApp confirmation button with client's inquiry summary
    if (directWhatsAppConfirmBtn) {
      const waText = encodeURIComponent(
        `Hello Eternal Moments Weddings, I just submitted an inquiry (${inquiryRecord.id}) for our wedding. ` +
        `Name: ${fullName}, Service: ${service}, Date: ${weddingDate}. Looking forward to connecting!`
      );
      directWhatsAppConfirmBtn.href = `https://wa.me/919876543213?text=${waText}`;
    }

    // Show modal
    if (successModal) {
      successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      alert("Thank you for reaching out! We will contact you within 24 hours.");
    }

    // Reset form
    inquiryForm.reset();
  });

  // Close modal
  const hideSuccessModal = () => {
    if (successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (closeSuccessModalBtn) closeSuccessModalBtn.addEventListener('click', hideSuccessModal);
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) hideSuccessModal();
    });
  }
}

/* ==========================================================================
   8. FAQ ACCORDIONS
   ========================================================================== */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. NEWSLETTER SUBSCRIPTION FORM
   ========================================================================== */
function initNewsletterForm() {
  const form = document.querySelector('.footer-newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.footer-newsletter-input');
    if (!input || !input.value.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      alert('Please enter a valid email address.');
      input.focus();
      return;
    }

    const email = input.value.trim();
    input.value = '';
    alert(`Thank you! A bridal inspiration guide has been sent to ${email}.`);
  });
}
