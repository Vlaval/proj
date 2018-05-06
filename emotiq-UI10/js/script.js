$(document).ready(function () {
    var body = $('body');
    var executed = false;
    var inAnimFlag = false;

    checkWidth();

    if($(window).width() >= 1300) {
        $( ".associate" )
       .mouseover(function() {
           if(inAnimFlag) return;
           inAnimFlag = true;
           // removeFlag();
           $(this).addClass('active');
           $(this).find('.more-info').show('400').removeClass('fadeOutRight').addClass('fadeInRight');
       })
       .mouseout(function() {
           if(inAnimFlag) return;
           inAnimFlag = true;
           // removeFlag();
           $(this).removeClass('active');
           $(this).find('.more-info').hide('400').removeClass('fadeInRight').addClass('fadeOutRight');
       });

        if($('#team').length && $(document).scrollTop() > ($('#team').offset().top-400) && !executed){
           showAssoc();
        }

        if($('#platform').lenght && $(document).scrollTop() > ($('#platform').offset().top-300)){
           setTimeout(function(){$('#platform').removeClass('invisible').addClass('animated fadeInUp')}, 300)
        }
        if($('#footer').lenght && $(document).scrollTop()+$(window).height() > ($('#footer').offset().top-400)){
            $('#footer').removeClass('invisible').addClass('animated fadeInUp');
        }
        if($('#tge').length && $(document).scrollTop() > ($('#tge').offset().top-550)){
            $('#tge-top').removeClass('invisible').addClass('animated fadeInRight');
            setTimeout(function(){$('#tge-bottom').removeClass('invisible').addClass('animated fadeInUp')}, 300);
        }
        if($('#whitepaper').length && $(document).scrollTop() > ($('#whitepaper').offset().top-750)){
            $('#whitepaper-top').removeClass('invisible').addClass('animated fadeInLeft');
            setTimeout(function(){$('#whitepaper-bottom').removeClass('invisible').addClass('animated fadeInUp')}, 300);
        }

        showNav();

        function showNav() {
            var nav = $('.page-header-nav-item');
            nav.each(function(key){
                var obj = $(this);
                setTimeout(function(){
                    obj.removeClass('invisible').addClass('animated fadeInUp');
                },300+300*key);
            });
        }

        $(window).scroll(function(){
            if($('#team').length && $(document).scrollTop() > ($('#team').offset().top-600) && !executed){
               showAssoc();
            }

            if($('#platform').length && $(document).scrollTop() > ($('#platform').offset().top-500)){
               setTimeout(function(){$('#platform').removeClass('invisible').addClass('animated fadeInUp')}, 300)
            }

            if($('#footer').length && $(document).scrollTop()+$(window).height() > ($('#footer').offset().top-500)){
               $('#footer').removeClass('invisible').addClass('animated fadeInUp')
            }

            if($('#tge').length && $(document).scrollTop() > ($('#tge').offset().top-500)){
                $('#tge-top').removeClass('invisible').addClass('animated fadeInRight');
                setTimeout(function(){$('#tge-bottom').removeClass('invisible').addClass('animated fadeInUp')}, 300);
            }
            if($('#whitepaper').length && $(document).scrollTop() > ($('#whitepaper').offset().top-750)){
                $('#whitepaper-top').removeClass('invisible').addClass('animated fadeInLeft');
                setTimeout(function(){$('#whitepaper-bottom').removeClass('invisible').addClass('animated fadeInUp')}, 300);
            }
        });
    } else {
        $('body').addClass('turnOff');
    }

    $(window).resize(function(){
        checkWidth();
    });


    setTimeout(function() {
        if (location.hash) {
            /* we need to scroll to the top of the window first, because the browser will always jump to the anchor first before JavaScript is ready, thanks Stack Overflow: http://stackoverflow.com/a/3659116 */
            window.scrollTo(0, 0);
            target = location.hash.split('#');
            smoothScrollTo($('#'+target[1]));
        }
    }, 1);

    // taken from: https://css-tricks.com/snippets/jquery/smooth-scrolling/
    $('a[href*=\\#]:not([href=\\#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            smoothScrollTo($(this.hash));
            return false;
        }
    });

    function checkScrollbar() {
        var el = $('<div style="width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;"/>'),
            elDom = el.get(0);

        el.appendTo('body');

        if (elDom.offsetWidth === elDom.clientWidth) {
            $('.wrapper').addClass('no-shift');
        }

        el.remove();
    }

    checkScrollbar();
    function showAssoc() {
        executed = true;
        $('.associate').each(function(key){
            var animate = 'fadeInLeft';
            if((key + 1 + 3 - 2) % 3 === 0) animate = 'fadeInDown';
            if((key + 1) % 3 === 0) animate = 'fadeInRight';
            var obj = $(this);
            setTimeout(function(){
                obj.removeClass('invisible').addClass('animated ' + animate);
            },150*key);
        });
    }
    function freezePage() {
        $('.wrapper').addClass('no-scroll');
    }

    function unfreezePage() {
        $('.wrapper').removeClass('no-scroll');
    }

    function showPopUpsWrapper() {
        $('.pop-ups-wrapper').addClass('visible');
    }

    function hidePopUpsWrapper() {
        $('.pop-ups-wrapper').removeClass('visible');
    }

    function getOuterWidth(el) {
        var elStyle = window.getComputedStyle(el);
        return elStyle.display == 'none' ? 0 : parseFloat(elStyle.width) + parseFloat(elStyle.marginRight);
    }

    function hideOverlay() {
        $('.overlay').removeClass('visible');
    }

    function showOverlay() {
        $('.overlay').addClass('visible');
    }

    /* slider platform mobile*/
    //$('.platform-slider').owlCarousel({
    //    items: 1,
    //    //touchDrag: false,
    //    //mouseDrag: false
    //});
    $('.platform-slider').bxSlider({
        speed: 700,
        mode: 'horizontal',
        pagerCustom: '.platform-slider-nav',
        //auto: true,
        nextText: '',
        prevText: '',
        prevSelector:'#platform-slider-left',
        nextSelector:'#platform-slider-right',
        infiniteLoop: true,
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 1,
        slideMargin: 10
    });
    ///* slider nav */
    //$('.platform-slider-nav').on('click', '.platform-slider-nav-item', function () {
    //    $(this).addClass('selected').siblings('.selected').removeClass('selected');
    //    $('.platform-slider').trigger('to.owl.carousel', $(this).data('index'));
    //});

    // posts slider
    // $('.post-slider').bxSlider({
    //     mode: 'fade',
    //     pager: false,
    //     // slideWidth: 200,
    //     infiniteLoop: true,
    //     minSlides: 3,
    //     maxSlides: 3
    // });

      setTimeout(() => {
        $('.post-slider').owlCarousel({
          margin: 30,
          nav: true,
          navText: ["<a href=\"javascript:void(0)\">&larr;</a>","<a href=\"javascript:void(0)\">&rarr;</a>"],
          navContainer: ".slider-controls-list",
          dotsContainer: ".slider-controls-dots",
          dots: true,
          onInitialized: function() {
            $('.post-slider').css('visibility', 'visible');
          },
          responsive : {
            0 : {
              items: 1
            },
            600 : {
              items: 2
            },
            960 : {
              items: 3
            }
          }
        });
      }, 1000);


    // $('.post-slider').owlCarousel({
    //   margin: 30,
    //   nav: true,
    //   navText: ["<a href=\"javascript:void(0)\">&larr;</a>","<a href=\"javascript:void(0)\">&rarr;</a>"],
    //   navContainer: ".slider-controls-list",
    //   dotsContainer: ".slider-controls-dots",
    //   dots: true,
    //   responsive : {
    //     // breakpoint from 0 up
    //     0 : {
    //       items: 1
    //     },
    //     // breakpoint from 480 up
    //     600 : {
    //       items: 2
    //     },
    //     // breakpoint from 768 up
    //     960 : {
    //       items: 3
    //     }
    //   }
    // });

    var pageHeaderMenu = (function () {
        var openBtn = $('.menu-open-btn'),
            closeBtn = $('.menu-close-btn'),
            pageHeader = $('.page-header'),
            categories = $('.page-header-categories-wrapper'),
            hiddenElements = document.getElementsByClassName('hidden-elements-list')[0];

        var init = function () {
            openBtn.on('click', openMenu);
            closeBtn.on('click', closeMenu);

            pageHeader.find('.nav-toogle').on('click', function (e) {
                if ($(this).is('.active')) {
                    hideHiddenElements();
                }
                else {
                    e.stopImmediatePropagation();

                    showHiddenElements();

                    $(window).one('click', clickOutsideHndlr);
                }

                $(this).toggleClass('active');
            });


            pageHeader.on('mouseover', '.page-header-nav-item.open-menu-item', function () {
                if (window.matchMedia('(min-width: 1200px)').matches) {
                    showCategories();
                }
            });

            pageHeader.on('mouseout', '.page-header-nav-item', function (e) {
                if (window.matchMedia('(min-width: 1200px)').matches) {
                    var relTarget = $(e.relatedTarget);

                }
            });
            $(".page-header-nav-item a").click(function() {
                var lnk = $(this).attr('href');
                if($(this).closest('.page-header').hasClass('menu-opened')){
                    closeMenu();
                    window.location = lnk;
                }
                $('html, body').animate({
                    scrollTop: $(lnk).offset().top
                }, 1000);
                return false;
            });
        };

        function openMenu() {
            pageHeader.addClass('menu-opened');
            freezePage();
        }

        function closeMenu() {
            pageHeader.removeClass('menu-opened');
            unfreezePage();
        }

        function showHiddenElements() {
            pageHeader.find('.hidden-elements').addClass('visible');
        }

        function hideHiddenElements() {
            pageHeader.find('.hidden-elements').removeClass('visible');
        }

        function clickOutsideHndlr(e) {
            if ($(e.target).closest('.hidden-elements').length) {
            }
            else {
                hideHiddenElements();
                pageHeader.find('.nav-toogle').removeClass('active');
                $(window).off('click', clickOutsideHndlr);
            }
        }
        return {
            init: init
        };
    }()).init();

    /*Открытие попапов*/
    $('[data-pop-up-open]').on('click', function () {
        $('[data-pop-up]').removeClass('visible');
        $('[data-pop-up="' + $(this).data('pop-up-open') + '"]').addClass('visible');
        freezePage();
        showPopUpsWrapper();
    });
    /*Закрытие попапов*/
    $('.pop-up-close-button').on('click', function () {
        $(this).closest('.pop-up').removeClass('visible');
        if (!$('.page-header').is('.menu-opened')) {
            unfreezePage();
        }
        hidePopUpsWrapper();
    });

    if($('#faq-list').length) {
        $('.faq-list--toggle').on('click', function () {
            if (!$(this).hasClass('active')){
                $('.faq-list--toggle').removeClass('active');
                $('.faq-list--item-content').slideUp('normal');
                $(this).next('.faq-list--item-content').stop(true,true).slideToggle('normal');
                $(this).toggleClass('active');
            } else {
                $(this).removeClass('active');
                $(this).next('.faq-list--item-content').slideUp('normal');
            }
            return false;
        });
    }
});
function smoothScrollTo(target) {
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

    if (target.length) {
        $('html,body').animate({
            scrollTop: target.offset().top
        }, 1000);
    }
}
function checkWidth() {
    var windowWidth = $(window).width();
    if(windowWidth > 960 && windowWidth <= 960) {
        var siteWidth = 960;
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', user-scalable=no');
    } else {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
    }
}