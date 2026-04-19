'use strict';
(function ($) {
    /* ==================== Ready Function Start ========================== */
    $(document).ready(function () {
        /* ==================== Header Navbar Collapse JS Start ===================== */
        const navbarCollapse = $('.navbar-collapse');

        if (navbarCollapse.length) {
            function hideNavbarCollapse() {
                new bootstrap.Collapse(navbarCollapse[0]).hide();
                navbarCollapse.trigger('hide.bs.collapse');
            }

            navbarCollapse.on({
                'show.bs.collapse': function () {
                    $('body').addClass('scroll-hide');
                    $('.body-overlay').addClass('show').on('click', hideNavbarCollapse);
                },
                'hide.bs.collapse': function () {
                    $('body').removeClass('scroll-hide');
                    $('.body-overlay').removeClass('show').off('click', hideNavbarCollapse);
                },
            });
        }
        /* ==================== Header Navbar Collapse JS End ======================= */

        

        /* ==================== Offcanvas Sidebar JS Start ======================== */
        $('[data-toggle="offcanvas-sidebar"]').each(function (index, toggler) {
            let id = $(toggler).data('target');
            let sidebar = $(id);
            let sidebarClose = sidebar.find('.btn--close');
            let sidebarOverlay = $('.sidebar-overlay');

            let hideSidebar = function () {
                sidebar.removeClass('show');
                sidebarOverlay.removeClass('show');
                $(toggler).removeClass('active');
                $('body').removeClass('scroll-hide');
                $(document).off('keydown', escSidebar);
            };

            let escSidebar = function (e) {
                if (e.keyCode === 27) {
                    hideSidebar();
                }
            };

            let showSidebar = function () {
                $(toggler).addClass('active');
                sidebar.addClass('show');
                sidebarOverlay.addClass('show');
                $('body').addClass('scroll-hide');
                $(document).on('keydown', escSidebar);
            };

            $(toggler).on('click', showSidebar);
            $(sidebarOverlay).on('click', hideSidebar);
            $(sidebarClose).on('click', hideSidebar);
        });

        $('.dashboard-sidebar__body').on('scroll', function () {
            if ($(this).scrollTop() > 0) {
                $(this).addClass('scrolling');
            } else {
                $(this).removeClass('scrolling');
            }
        });
        /* ==================== Offcanvas Sidebar JS End ========================== */

        /*===================== Dynamically Add Active Class JS Start ============================== */
        function dynamicActiveMenuClass(selector) {
            if (!selector.length) return;

            let fileName = window.location.pathname.split('/').reverse()[0];

            selector.find('li').each(function () {
                let anchor = $(this).find('a').first();
                if ($(anchor).attr('href') === fileName) {
                    $(this).addClass('active');
                }
            });

            if (fileName === '' || fileName === '/') {
                selector.find('li').eq(0).addClass('active');
            }
        }

        dynamicActiveMenuClass($('.header-menu'));
        dynamicActiveMenuClass($('.header-offcanvas__menu'));
        dynamicActiveMenuClass($('.dashboard-sidebar-menu'));
        /*===================== Dynamically Add Active Class JS End ================================ */

        /* ==================== Dynamically Add BG Image JS Start ====================== */
        $('.bg-img').css('background-image', function () {
            return `url(${$(this).data('background-image')})`;
        });
        /* ==================== Dynamically Add BG Image JS End ========================= */

        /* ==================== Dynamically Add Mask Image JS Start ====================== */
        $('.mask-img').css('mask-image', function () {
            return `url(${$(this).data('mask-image')})`;
        });
        /* ==================== Dynamically Add Mask Image JS End ======================== */

        /* ==================== Add A Class In Select Input JS Start ===================== */
        $('.form-select.form--select').each((index, select) => {
            if ($(select).val()) {
                $(select).addClass('selected');
            }

            $(select).on('change', function () {
                if ($(this).val()) {
                    $(this).addClass('selected');
                } else {
                    $(this).removeClass('selected');
                }
            });
        });
        /* ==================== Add A Class In Select Input JS End ======================== */

        /* ==================== Select2 Initialization JS Start ==================== */
        $('.select2').each((index, select) => {
            $(select).wrap('<div class="select2-wrapper"></div>').select2({
                dropdownParent: $(select).closest('.select2-wrapper'),
                placeholder: $(select).data('placeholder') || '',
                minimumResultsForSearch: Infinity
            });
        });
        /* ==================== Select2 Initialization JS End ==================== */

        /* ==================== Slick Slider Initialization JS Start ==================== */
        if ($('.brand-slider').length && !$('.brand-slider').hasClass('slick-initialized')) {
            $('.brand-slider').slick({
                infinite: true,
                slidesToShow: 5,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 0,
                speed: 3500,
                cssEase: 'linear',
                pauseOnHover: false,
                pauseOnFocus: false,
                swipe: false,
                draggable: false,
                touchMove: false,
                arrows: false,
                dots: false,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 4,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 3,
                        },
                    },
                    {
                        breakpoint: 576,
                        settings: {
                            slidesToShow: 2,
                        },
                    },
                ],
            });
        }

        if ($('.home-testimonial-slider').length && !$('.home-testimonial-slider').hasClass('slick-initialized')) {
            $('.home-testimonial-slider').slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                autoplay: false,
                speed: 700,
                arrows: true,
                dots: false,
                appendArrows: $('.testimonials__arrows'),
                prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
                nextArrow: '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 2,
                            arrows: false,
                            dots: true,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            arrows: false,
                            dots: true,
                        },
                    },
                ],
            });
        }
        /* ==================== Slick Slider Initialization JS End ====================== */

        /* ==================== Odometer JS Start ====================== */
        $('.odometer').each(function () {
            $(this).html('0');
        });

        const odometerEls = $('.odometer');
        const runOdometer = function (el) {
            if (!$(el).data('odometer-loaded')) {
                $(el).data('odometer-loaded', true);
                $(el).html($(el).data('odometer-final'));
            }
        };

        if (odometerEls.length) {
            if ('IntersectionObserver' in window) {
                const odometerObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            runOdometer(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });

                odometerEls.each((index, el) => odometerObserver.observe(el));
            } else {
                const checkOdometerInView = function () {
                    odometerEls.each((index, el) => {
                        const rect = el.getBoundingClientRect();
                        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
                            runOdometer(el);
                        }
                    });
                };

                checkOdometerInView();
                $(window).on('scroll', checkOdometerInView);
            }
        }
        /* ==================== Odometer JS End ====================== */

        /* ==================== Pricing Toggle JS Start ====================== */
        const pricingToggleButtons = $('.pricing-toggle__btn');
        const pricingPlans = $('[data-pricing-plans]');

        if (pricingToggleButtons.length && pricingPlans.length) {
            const setBilling = function (billing) {
                pricingToggleButtons.removeClass('active');
                pricingToggleButtons.filter(`[data-billing=\"${billing}\"]`).addClass('active');
                pricingPlans.attr('data-billing', billing);

                pricingPlans.find('[data-monthly][data-annual]').each(function () {
                    const monthlyPrice = $(this).data('monthly');
                    const annualPrice = $(this).data('annual');
                    $(this).text(billing === 'annual' ? annualPrice : monthlyPrice);
                });
            };

            pricingToggleButtons.on('click', function () {
                setBilling($(this).data('billing'));
            });

            setBilling('monthly');
        }
        /* ==================== Pricing Toggle JS End ======================== */

        /* ==================== Widget Customization Swatch JS Start ====================== */
        const widgetLab = $('.widget-customization__lab');
        const widgetSwatches = $('.widget-customization__swatches button');

        if (widgetLab.length && widgetSwatches.length) {
            widgetSwatches.on('click', function () {
                const color = $(this).data('lab');
                widgetLab[0].style.setProperty('--lab-bg', color);
                widgetSwatches.removeClass('is-active');
                $(this).addClass('is-active');
            });
        }
        /* ==================== Widget Customization Swatch JS End ======================== */

        /* ==================== Password Toggle JS Start ================================ */
        $('.input--group-password').each(function (index, inputGroup) {
            let inputGroupBtn = $(inputGroup).find('.input-group-btn');
            let formControl = $(inputGroup).find('.form-control.form--control');

            inputGroupBtn.on('click', function () {
                if (formControl.attr('type') === 'password') {
                    formControl.attr('type', 'text');
                    $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
                } else {
                    formControl.attr('type', 'password');
                    $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
                }
            });
        });
        /* ==================== Password Toggle JS End ================================== */

        /* ==================== Input Group Copy JS Start =============================== */
        $('.input--group-copy').each((index, element) => {
            let copyBtn = $(element).find('.copy-btn');
            let copyInput = $(element).find('.copy-input');

            copyBtn.on('click', function () {
                copyInput.select();
                copyInput[0].setSelectionRange(0, 99999);

                if (navigator.clipboard.writeText(copyInput.val())) {
                    $(this).addClass('copied');

                    let timer = setTimeout(() => {
                        $(this).removeClass('copied');
                        clearTimeout(timer);
                    }, 1000);
                }
            });

        });
        /* ==================== Input Group Copy JS End ================================= */

        /* ==================== Dashboard Collapse JS Start ==================== */
        $('.dashboard-collapse').on({
            'show.bs.collapse': function (e) {
                $('.dashboard-collapse').each((index, collapse) => {
                    if (e.target !== collapse && $(collapse).hasClass('show')) {
                        new bootstrap.Collapse(collapse).hide();
                    }
                });
            }
        });
        /* ==================== Dashboard Collapse JS End ====================== */
    });
    /* ==================== Ready Function End ============================ */

    /* ==================== Header Fixed JS Start ========================= */
    $(window).on('scroll', function () {
        if ($(window).scrollTop() >= 120) {
            $('.header').addClass('fixed-header');
        } else {
            $('.header').removeClass('fixed-header');
        }
    });
    /* ==================== Header Fixed JS End ============================= */




   // ========================= Scroll Reveal Js Start ===================
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 1500,
  delay: 100,
  reset: false,
})

// Top reveal
sr.reveal('.banner__content, .why-viserchat__content, .heading-animation, .features-overview__intro-card, .ai-chat__checklist, .visitor-tracking__feature-panel, .live-chat__window, .team-inbox__feature-grid, .widget-customization__list, .analytics__dashboard, .analytics__quick-kpis, .analytics__insights, .cta-banner__shell, .faq__intro, .accordion-item, .blog-card, .newsletter__shell, .mobile-app__mockup, .chatbot-builder', {
  delay: 100,
  origin: 'top',
})

// Bottom reveal (FIXED)
sr.reveal('.banner__thumb, .why-viserchat__panel, .ai-chat__thumb, .visitor-tracking__board, .live-chat__window, .live-chat__capabilities, .team-inbox__workspace, .widget-customization__lab, .security__grid', {
  delay: 100,
  origin: 'bottom',
})

// Stagger animation
sr.reveal('.features-overview-card, .how-it-works__step, .counter__item, .use-cases__card', {
  delay: 100,
  interval: 100,
  origin: 'bottom',
})
  // ========================= Scroll Reveal Js End ===================

    /* ==================== Scroll To Top Button JS Start ==================== */
    let scrollTopBtn = $('.scroll-top');

    if (scrollTopBtn.length) {
        let progressPath = scrollTopBtn.find('.scroll-top-progress path');
        let pathLength = progressPath[0].getTotalLength();
        let offset = 250;
        let duration = 550;

        progressPath.css({
            transition: 'none',
            WebkitTransition: 'none',
            strokeDasharray: `${pathLength} ${pathLength}`,
            strokeDashoffset: pathLength,
            transition: 'stroke-dashoffset 10ms linear',
            WebkitTransition: 'stroke-dashoffset 10ms linear',
        });

        function updateProgress() {
            let scroll = $(window).scrollTop();
            let height = $(document).height() - $(window).height();
            let progress = pathLength - (scroll * pathLength / height);
            progressPath.css('strokeDashoffset', progress);
        }

        updateProgress();

        $(window).on('scroll', function () {
            updateProgress();
            if ($(this).scrollTop() > offset) {
                scrollTopBtn.addClass('active');
            } else {
                scrollTopBtn.removeClass('active');
            }
        });

        scrollTopBtn.on('click', function (e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, duration);
            return false;
        });
    }

    if ($(scrollTopBtn).next(':is(.page-wrapper)').find('.account').length) {
        $(scrollTopBtn).hide();
    }
    /* ==================== Scroll To Top Button JS End ==================== */

    /* ==================== Preloader JS Start ============================== */
    $(window).on('load', () => $('.preloader').fadeOut());
    /* ==================== Preloader JS End ================================ */

})(jQuery);
