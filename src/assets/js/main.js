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
            const renderCountryOption = function (option) {
                if (!option.id) {
                    return option.text;
                }

                const flag = option.element?.dataset?.flag;

                if (!flag) {
                    return option.text;
                }

                return $(`
                    <span class="country-select-option">
                        <span class="country-select-option__flag">${flag}</span>
                        <span class="country-select-option__name">${option.text}</span>
                    </span>
                `);
            };

            $(select).wrap('<div class="select2-wrapper"></div>').select2({
                dropdownParent: $(select).closest('.select2-wrapper'),
                placeholder: $(select).data('placeholder') || '',
                minimumResultsForSearch: Infinity,
                templateResult: $(select).closest('.country-option').length ? renderCountryOption : undefined,
                templateSelection: $(select).closest('.country-option').length ? renderCountryOption : undefined
            });
        });
        /* ==================== Select2 Initialization JS End ==================== */

        /* ==================== Date Range Picker JS Start ==================== */
        if ($.fn.daterangepicker && typeof moment !== 'undefined') {
            $('[data-date-filter]').each(function () {
                const wrapper = $(this);
                const labelInput = wrapper.find('.date-range');
                const valueInput = wrapper.find('.date-range-value');

                if (!labelInput.length) return;

                const today = moment();
                let startDate = today.clone().subtract(6, 'days');
                let endDate = today.clone();
                const storedValue = valueInput.val();

                if (storedValue) {
                    const parts = storedValue.split(' - ');
                    if (parts.length === 2) {
                        const parsedStart = moment(parts[0], 'MMMM D, YYYY', true);
                        const parsedEnd = moment(parts[1], 'MMMM D, YYYY', true);

                        if (parsedStart.isValid() && parsedEnd.isValid()) {
                            startDate = parsedStart;
                            endDate = parsedEnd;
                        }
                    }
                }

                const updateDateRange = function (start, end) {
                    labelInput.val(`${start.format('MMM D')} - ${end.format('MMM D')}`);
                    valueInput.val(`${start.format('MMMM D, YYYY')} - ${end.format('MMMM D, YYYY')}`);
                };

                labelInput.daterangepicker({
                    autoUpdateInput: false,
                    startDate: startDate,
                    endDate: endDate,
                    opens: 'left',
                    locale: {
                        cancelLabel: 'Clear',
                    },
                });

                updateDateRange(startDate, endDate);

                labelInput.on('apply.daterangepicker', function (ev, picker) {
                    updateDateRange(picker.startDate, picker.endDate);
                });

                labelInput.on('cancel.daterangepicker', function () {
                    labelInput.val('');
                    valueInput.val('');
                });
            });
        }
        /* ==================== Date Range Picker JS End ==================== */
        /* ==================== chat-list Picker JS End ==================== */
             $('.chat-list').on('click', '.chat-list__item', function() {
                $(".empty-conversation").remove();
                $(".chatbox-area__body").removeClass('d-none');
                window.conversation_id = $(this).data('id');
                messagePage = 1;
                loadMessages();
                loadContact();

                $('.chat-list__item').removeClass('active');
                $(this).addClass('active');
                changeURL("conversation", window.conversation_id);
                $('.chatbox-area .chatbox-area__left').removeClass('show-sidebar');
                $('.sidebar-overlay').removeClass('show');
            });
        /* ==================== chat-list Picker JS End ==================== */

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
        // ========================= Slick Slider Js Start ==============
    (() => {
      const sliderConfig = {
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        speed: 1500,
        dots: true,
        pauseOnHover: true,
        arrows: false,
        prevArrow:
          '<button type="button" class="slick-prev"><i class="fas fa-long-arrow-left"></i></button>',
        nextArrow:
          '<button type="button" class="slick-next"><i class="fas fa-long-arrow-right"></i></button>',
      };

      $(".client-slider").slick({
        autoplay: true,
        autoplaySpeed: 0,
        speed: 15000,
        arrows: false,
        swipe: false,
        dots: false,
        slidesToShow: 6,
        cssEase: "linear",
        pauseOnFocus: false,
        pauseOnHover: false,

        responsive: [
          {
            breakpoint: 1399,
            settings: {
              slidesToShow: 5,
            },
          },
          {
            breakpoint: 991,
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
            breakpoint: 575,
            settings: {
              slidesToShow: 2,
              variableWidth: true,
            },
          },
        ],
      });

      $(".testimonial-slider").slick({
        infinite: true,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 15000,
        swipe: false,
        dots: false,
        cssEase: "linear",
        pauseOnFocus: false,
        pauseOnHover: false,
        variableWidth: true,
        arrows: false,
      });
    })();
    // ========================= Slick Slider Js End ===================


        

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

        /* ==================== Analytics Chart JS Start ====================== */
        function initAnalyticsChart() {
            const chartEl = document.querySelector('#analyticsPerformanceChart');

            if (!chartEl || typeof ApexCharts === 'undefined') return;

            if (chartEl._apexchart) {
                chartEl._apexchart.destroy();
            }

            const options = {
                chart: {
                    type: 'line',
                    height: 260,
                    toolbar: { show: false },
                    zoom: { enabled: false },
                    foreColor: '#a7b4c8',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    stacked: false,
                },
                series: [
                    {
                        name: 'Chat Volume',
                        type: 'bar',
                        data: [44, 52, 49, 68, 74, 70, 86],
                    },
                    {
                        name: 'Qualified Leads',
                        type: 'line',
                        data: [18, 22, 24, 31, 36, 34, 43],
                    },
                    {
                        name: 'Conversion Rate',
                        type: 'line',
                        data: [12, 14, 15, 18, 22, 21, 25],
                    },
                ],
                colors: ['#2dd36f', '#8fb7ff', '#ffd166'],
                plotOptions: {
                    bar: {
                        columnWidth: '42%',
                        borderRadius: 8,
                        borderRadiusApplication: 'end',
                    },
                },
                stroke: {
                    curve: 'smooth',
                    width: [0, 3, 3],
                },
                fill: {
                    type: ['solid', 'gradient', 'gradient'],
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.34,
                        opacityTo: 0.08,
                        stops: [0, 100],
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                markers: {
                    size: [0, 4, 4],
                    strokeWidth: 0,
                    hover: {
                        size: 6,
                    },
                },
                grid: {
                    borderColor: 'rgba(255,255,255,0.10)',
                    strokeDashArray: 4,
                    xaxis: {
                        lines: { show: false },
                    },
                    yaxis: {
                        lines: { show: true },
                    },
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    fontSize: '13px',
                    labels: {
                        colors: '#d9e2ef',
                    },
                    markers: {
                        width: 10,
                        height: 10,
                        radius: 12,
                    },
                },
                xaxis: {
                    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    labels: {
                        style: {
                            colors: '#8da0ba',
                        },
                    },
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                },
                yaxis: {
                    min: 0,
                    max: 90,
                    tickAmount: 5,
                    labels: {
                        formatter: function (value) {
                            return `${Math.round(value)}`;
                        },
                        style: {
                            colors: '#8da0ba',
                        },
                    },
                },
                tooltip: {
                    theme: 'dark',
                    shared: true,
                    intersect: false,
                },
                responsive: [
                    {
                        breakpoint: 576,
                        options: {
                            chart: {
                                height: 240,
                            },
                            plotOptions: {
                                bar: {
                                    columnWidth: '55%',
                                },
                            },
                            legend: {
                                position: 'bottom',
                            },
                        },
                    },
                ],
                annotations: {
                    points: [
                        {
                            x: 'Sun',
                            y: 43,
                            seriesIndex: 1,
                            marker: {
                                size: 5,
                                fillColor: '#8fb7ff',
                                strokeColor: '#8fb7ff',
                            },
                            label: {
                                borderColor: '#8fb7ff',
                                offsetY: -8,
                                style: {
                                    background: '#8fb7ff',
                                    color: '#0b1020',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                },
                                text: 'Peak lead day',
                            },
                        },
                    ],
                },
            };

            const chart = new ApexCharts(chartEl, options);
            chart.render();
            chartEl._apexchart = chart;
        }

        initAnalyticsChart();
        /* ==================== Analytics Chart JS End ======================== */

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
    $(window).on('load', () => {
        $('.preloader').fadeOut();
        AOS.init({
            offset: 0,
            once: true,
            disable() {
                var maxWidth = 1200; // breakpoint for mobile
                return window.innerWidth < maxWidth;
            },
        });
    });
    /* ==================== Preloader JS End ================================ */

})(jQuery);
