(function () {

    "use strict";

    jQuery(document).ready(function ($) {
        /*================ Load More Blog Posts =========*/
        $('.js-loadmore').each(function () {
            $(this).on('click', function (e) {
                var $this = $(this);
                var $paged = $(this).data('paged') + 1;
                var $display = $(this).data('display');
                var $max_num = $(this).data('max_num');
                var $limit = $(this).data('limit');

                $.ajax({
                    url: plantAjax.ajaxurl,
                    type: 'POST',
                    dataType: "JSON",
                    data: {
                        action: 'plant_load_more_posts',
                        paged: $paged,
                        display: $display,
                        limit: $limit
                    },
                    beforeSend: function () {
                        setTimeout(function () {
                            $this.button('loading');
                        }, 200);

                    },
                    success: function (response) {
                        $this.button('reset');
                        if (response.check == false)
                            $this.remove();
                        $this.data('paged', $paged);


                        if ($max_num >= $paged) {
                            if ($display == 'masony') {
                                var $grid_global = $('.gallery-isotope').imagesLoaded(function () {
                                    $grid_global.append(response.posts).each(function () {
                                        $grid_global.isotope('appended', response.posts);
                                        $grid_global.isotope('reloadItems');
                                    });
                                    $grid_global.isotope();
                                })
                            }
                            if ($display == 'zigzag') {
                                $('.load-more-content').append(response.posts).hide().fadeIn("slow");
                            }


                            if (($max_num) === $paged) {
                                $('.js-loadmore').fadeOut("slow");
                            }
                        }

                    }
                });
                return false;

            });
        });
        /**
         * Scroll To Top
         */
        /*scroll-top*/
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                $('.scrollToTop').fadeIn();
            } else {
                $('.scrollToTop').fadeOut();
            }
        });

        //Click event to scroll to top
        $('.scrollToTop').on("click", function () {
            $('html, body').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
        /**********************************************************************
         * Login Ajax

         **********************************************************************/

        $('#pbrlostpasswordform').hide();
        $('#modalLoginForm form .btn-cancel').on('click', function () {
            $('#modalLoginForm').modal('hide');
            $('#modalLoginForm .alert').remove();
        });

        // sign in proccess
        $('form.login-form').on('submit', function () {
            var $this = $(this);
            $('.alert', this).remove();
            $.ajax({
                url: plantAjax.ajaxurl,
                type: 'POST',
                dataType: 'json',
                data: $(this).serialize() + "&action=pbrajaxlogin"
            }).done(function (data) {
                if (data.loggedin) {
                    $this.prepend('<div class="alert alert-info">' + data.message + '</div>');
                    location.reload();
                } else {
                    $this.prepend('<div class="alert alert-danger">' + data.message + '</div>');
                }
            });
            return false;
        });

        //register
        $('form#opalrgtRegisterForm').on('submit', function () {
            var $this = $(this);
            $('.alert', this).remove();
            $.ajax({
                url: plantAjax.ajaxurl,
                type: 'POST',
                dataType: 'json',
                data: $(this).serialize() + "&action=opalajaxregister"
            }).done(function (data) {
                if (data.status == 1) {
                    $this.prepend('<div class="alert alert-info">' + data.msg + '</div>');
                    location.reload();
                } else {
                    $this.prepend('<div class="alert alert-warning">' + data.msg + '</div>');
                }
            });
            return false;
        });

        // lost password
        $('form.lostpassword-form').on('submit', function () {
            var $this = $(this);
            $('.alert', this).remove();
            $.ajax({
                url: plantAjax.ajaxurl,
                type: 'POST',
                dataType: 'json',
                data: $(this).serialize() + "&action=pbrajaxlostpass"
            }).done(function (data) {
                if (data.loggedin) {
                    $this.prepend('<div class="alert alert-info">' + data.message + '</div>');
                    location.reload();
                } else {
                    $this.prepend('<div class="alert alert-danger">' + data.message + '</div>');
                }
            });
            return false;
        });

        $('form .toggle-links').on('click', function () {
            $('.form-wrapper').hide();
            $($(this).attr('href')).show();
            return false;
        });

        //counter up

        // ENGO_CountDown
        $.fn.ENGO_CountDown = function (options) {
            return this.each(function () {
                new $.ENGO_CountDown(this, options);
            });
        }
        $.ENGO_CountDown = function (obj, options) {
            var ddiff, gsecs;
            this.options = $.extend({
                autoStart: true,
                LeadingZero: true,
                DisplayFormat: "<div><span>%%D%% :</span> Days</div><div><span>%%H%% :</span> Hours</div><div><span>%%M%% :</span> Mins</div><div><span>%%S%% :</span> Secs</div>",
                FinishMessage: "Expired",
                CountActive: true,
                TargetDate: null
            }, options || {});
            if (this.options.TargetDate == null || this.options.TargetDate == '') {
                return;
            }
            this.timer = null;
            this.element = obj;
            this.CountStepper = -1;
            this.CountStepper = Math.ceil(this.CountStepper);
            this.SetTimeOutPeriod = (Math.abs(this.CountStepper) - 1) * 1000 + 990;
            var dthen = new Date(this.options.TargetDate);
            var dnow = new Date();
            if (this.CountStepper > 0) {
                ddiff = new Date(dnow - dthen);
            } else {
                ddiff = new Date(dthen - dnow);
            }
            gsecs = Math.floor(ddiff.valueOf() / 1000);
            this.CountBack(gsecs, this);
        };
        $.ENGO_CountDown.fn = $.ENGO_CountDown.prototype;
        $.ENGO_CountDown.fn.extend = $.ENGO_CountDown.extend = $.extend;
        $.ENGO_CountDown.fn.extend({
            calculateDate: function (secs, num1, num2) {
                var s = ((Math.floor(secs / num1)) % num2).toString();
                if (this.options.LeadingZero && s.length < 2) {
                    s = "0" + s;
                }
                return "<b>" + s + "</b>";
            },
            CountBack: function (secs, self) {
                var DisplayStr;
                if (secs < 0) {
                    self.element.innerHTML = '<div class="labelexpired"> ' + self.options.FinishMessage + "</div>";
                    return;
                }
                clearInterval(self.timer);
                DisplayStr = self.options.DisplayFormat.replace(/%%D%%/g, self.calculateDate(secs, 86400, 100000));
                DisplayStr = DisplayStr.replace(/%%H%%/g, self.calculateDate(secs, 3600, 24));
                DisplayStr = DisplayStr.replace(/%%M%%/g, self.calculateDate(secs, 60, 60));
                DisplayStr = DisplayStr.replace(/%%S%%/g, self.calculateDate(secs, 1, 60));
                self.element.innerHTML = DisplayStr;
                if (self.options.CountActive) {
                    self.timer = null;
                    self.timer = setTimeout(function () {
                        self.CountBack((secs + self.CountStepper), self);
                    }, (self.SetTimeOutPeriod));
                }
            }
        });

        function init_countdown() {
            /** Countdown **/
            $('[data-countdown="countdown"]').each(function (index, el) {
                var $this = $(this);
                var $date = $this.data('date').split("-");
                $this.ENGO_CountDown({
                    TargetDate: $date[0] + "/" + $date[1] + "/" + $date[2] + " " + $date[3] + ":" + $date[4] + ":" + $date[5],
                    DisplayFormat: "<li><p>%%D%% <span></span> </p><span>days</span></li><li><p>%%H%% <span></span></p><span>HOURS</span></li><li><p>%%M%% <span></span> </p><span>mins</span></li><li><p>%%S%% </p><span>secs</span></li>",
                    FinishMessage: "Expired"
                });
            });
        }

        function init_countdown_prd() {
            $('[data-countdown="countdown_prd"]').each(function (index, el) {
                var $this = $(this);
                var $date = $this.data('date').split("-");
                $this.ENGO_CountDown({
                    TargetDate: $date[0] + "/" + $date[1] + "/" + $date[2] + " " + $date[3] + "-" + $date[4] + "-" + $date[5],
                    DisplayFormat: "<li><p>%%D%% <span>-</span> </p></li><li><p>%%H%% <span>-</span></p></li><li><p>%%M%% <span>-</span> </p</li><li><p>%%S%% </p></li>",
                    FinishMessage: "Expired"
                });
            });
        }

        init_countdown_prd();
        init_countdown();
        // End/ENGO_CountDown

        //Gallery photo
        $("a[rel^='prettyPhoto[pp_gal]']").prettyPhoto({
            animation_speed: 'normal',
            theme: 'light_square',
            social_tools: false,
        });


        //Offcanvas Menu
        $('[data-toggle="offcanvas"], .btn-offcanvas').on('click', function () {
            $('.row-offcanvas').toggleClass('active');
            $('#pbr-off-canvas').toggleClass('active');
        });

        //mobile click
        $('#main-menu-offcanvas .caret').on('click', function () {
            if (jQuery(this).parent().children().hasClass('show')) {
                jQuery(this).parent().children().removeClass('show');
            } else
                jQuery(this).parent().children().addClass('show');
        });

        $('.showright').on('click', function () {
            $('.offcanvas-showright').toggleClass('active');
        });


        /*---------------------------------------------- 
         *    Apply Filter        
         *----------------------------------------------*/
        jQuery('.isotope-filter li a').on('click', function () {

            var parentul = jQuery(this).parents('ul.isotope-filter').data('related-grid');
            jQuery(this).parents('ul.isotope-filter').find('li a').removeClass('active');
            jQuery(this).addClass('active');
            var selector = jQuery(this).attr('data-option-value');
            jQuery('#' + parentul).isotope({filter: selector}, function () {
            });

            return (false);
        });
        /* Modal-video*/
        $(".btn-play").each(function () {
            $(this).on("click", function (event) {
                var target = $(this).attr('href'),
                    url = $(target).data('video');

                var has_query_string = url.split('?', url);
                if (typeof has_query_string[1] == 'string') {
                    url += '&' + $(target).data('query-string');
                } else {
                    url += '?' + $(target).data('query-string');
                }
                $(target).find('iframe').attr('src', url);

                $(target).addClass('opened');
                $(target).on("click", function () {
                    $(this).removeClass('opened').attr('src', '');
                });

                event.preventDefault();
            });
        });

        /**
         *
         */
        $(".dropdown-toggle-overlay").on('click', function () {
            $($(this).data('target')).addClass("active");
        });

        $(".dropdown-toggle-button").on('click', function () {
            $($(this).data('target')).removeClass("active");
            return false;
        });


        $(".pbr-megamenu .dropdown-menu .container").removeClass().addClass("container-mega");
        $(window).on('load',function () {
            /**
             *
             * Automatic apply  Slick slider
             */
            $('.js-custom-slider').each(function () {
                $(this).on('init', function (e, slick) {
                    var $firstAnimatingElements = $('div.js-full-slide:first-child').find('[data-animation]');
                    doAnimations($firstAnimatingElements);
                });
                $(this).on('beforeChange', function (e, slick, currentSlide, nextSlide) {
                    var $animatingElements = $('div.js-full-slide[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
                    doAnimations($animatingElements);
                });
            });


            $('.js-slick-slider').each(function () {
                var slick = $(this);
                slick.slick();
            });
            $('.slider-nav').each(function () {
                var slick = $(this);
                slick.slick();
            });

            function doAnimations(elements) {
                var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                elements.each(function () {
                    var $this = $(this);
                    var $animationDelay = $this.data('delay');
                    var $animationType = 'animated ' + $this.data('animation');
                    $this.css({
                        'animation-delay': $animationDelay,
                        '-webkit-animation-delay': $animationDelay
                    });
                    $this.addClass($animationType).one(animationEndEvents, function () {
                        $this.removeClass($animationType);
                    });
                });
            }

            /*=============== Isotope =================*/
            if ($('.gallery').length) {
                $('.gallery').each(function (index, el) {
                    var $this = $(this),
                        $isotope = $this.find('.gallery-isotope'),
                        $filter = $this.find('.gallery-cat');

                    if ($isotope.length) {
                        var isotope_run = function (filter) {
                            $isotope.isotope({
                                itemSelector: '.item-isotope',
                                filter: filter,
                                percentPosition: true,
                                masonry: {
                                    columnWidth: '.item-size'
                                },
                                transitionDuration: '0.6s',
                                hiddenStyle: {
                                    opacity: 0
                                },
                                visibleStyle: {
                                    opacity: 1
                                }
                            });
                        }

                        $filter.on('click', 'a', function (event) {
                            event.preventDefault();
                            $(this).parents('ul').find('.active').removeClass('active');
                            $(this).parent('li').addClass('active');
                            isotope_run($(this).attr('data-filter'));
                        });

                        isotope_run('*');
                    }
                });
            }

            $('[data-toggle="filter"]').on("click", function(event) {
                event.stopPropagation();
                $('body').toggleClass('filter-open');
                $(".sidebar-fixed").toggleClass("filter-active");
            })
            $(document).bind("mouseup touchend", function(e) {
                var container = jQuery(".sidebar-fixed");
                if (!container.is(e.target) // if the target of the click isn't the container...
                    &&
                    container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    $(".sidebar-fixed").removeClass("filter-active");
                    $('body').removeClass('filter-open');
                }
            });

            $(".display-mode-default > button").on("click", function() {
                $(this).addClass('active').siblings().removeClass('active');;

                if ($(this).hasClass('btn-grid')) {
                    $(".products").addClass("products-grid");
                    $(".products").removeClass("products-list");

                    $(".products .item").removeClass("col-lg-12 col-md-12 col-sm-12");
                    $(".products .item").addClass("col-lg-3 col-md-6 col-sm-6");
                }
                if ($(this).hasClass('btn-list')) {
                    $(".products").addClass("products-list");
                    $(".products").removeClass("products-grid");

                    $(".products .item").removeClass("col-lg-3 col-md-6 col-sm-6");
                    $(".products .item").addClass("col-lg-12 col-md-12 col-sm-12");
                }
            });

            $(".display-mode-full > button").on("click", function() {
                $(this).addClass('active').siblings().removeClass('active');;

                if ($(this).hasClass('btn-grid')) {
                    $(".products").addClass("products-grid");
                    $(".products").removeClass("products-list");

                    $(".products .item").removeClass("col-lg-12 col-md-12 col-sm-12");
                    $(".products .item").addClass("col-lg-5 col-md-4 col-sm-6");
                }
                if ($(this).hasClass('btn-list')) {
                    $(".products").addClass("products-list");
                    $(".products").removeClass("products-grid");

                    $(".products .item").removeClass("col-lg-5 col-md-4 col-sm-6");
                    $(".products .item").addClass("col-lg-12 col-md-12 col-sm-12");
                }
            });

            // tabs menu
            var Accordion = function(el, multiple) {
                this.el = el || {};
                this.multiple = multiple || false;

                var dropdowndesc = this.el.find('.dropdowndesc');
                dropdowndesc.on('click',
                    { el: this.el, multiple: this.multiple },
                    this.dropdown);
            };
            Accordion.prototype.dropdown = function(e) {
                var $el = e.data.el,
                    $this = $(this),
                    $next = $this.next();

                $next.slideToggle();
                $this.parent().toggleClass('open');
                if(!e.data.multiple) {
                    $el.find('.dropdown-menu').not($next).slideUp().parent().removeClass('open');
                }
            }
            var accordion = new Accordion($('.navbar-tabs'), false);
        });




        /*=========== Menu Popup ================*/
        $('.burger-menu').each(function () {
            $(this).on("click", function (event) {
                $(this).toggleClass('active');
                $('.header-v2').toggleClass('menu-popup-open');
                $('#content_menu_popup').toggleClass('menu-popup-open');
                $('.logo').toggleClass('active');
                $('.header-right').toggleClass('active');
            });
        });


        /** Disable mouse scroll when focus gmap **/
        if ($('.wpb_map_wraper').length > 0) {
            $('.wpb_map_wraper').on('click', function () {
                $('.wpb_map_wraper iframe').css("pointer-events", "auto");
            });

            $(".wpb_map_wraper").on('mouseleave', function () {
                $('.wpb_map_wraper iframe').css("pointer-events", "none");
            });
        }
        // hide ads
        $('.btn-action').on('click', function () {
            $('.ads').toggleClass('hidden-ads');
            var text = $(this).text();
            var show = $(this).data('show');
            var hide = $(this).data('hide');

            if (text == show) {
                text = hide;
            } else {
                text = show;
            }
            $(this).text(text);
            return false;
        });

        // single product
        var oldOnsale = $('.single-product .product .onsale').html();
        $('.single-product .product > .onsale').remove();
        if (typeof oldOnsale != 'undefined') {
            $('.single-product .product .images').append('<span class="onsale">' + oldOnsale + '</span>');
        }

         jQuery(window).load(function(){
             if($('#popupNewsletterModal').length >0){
                 setTimeout(function(){
                     var hiddenmodal = getCookie('hiddenmodal');
                     if (hiddenmodal == "") {
                         jQuery('#popupNewsletterModal').modal('show');
                     }
                 }, 2000);
             }
         });
         jQuery(document).ready(function($){
             $('#popupNewsletterModal').on('hidden.bs.modal', function () {
                 setCookie('hiddenmodal', 1, 30);
             });
             $('.newsletter-close').on('click',function (e) {
                 jQuery('#popupNewsletterModal').modal('hide');
             })
         });


        // Multi Menu responsive
        $('#main-header ul.dropdown-menu li.dropdown').mouseover(function(){
            let dropdown = $(this).parent();
            let x = $(window).width() - (dropdown.offset().left + dropdown.innerWidth());
            if (x < dropdown.innerWidth()) {
                $(this).children('.dropdown-menu').css({
                    'left': 'auto',
                    'right' : '100%'
                });
            }
        });

    });
})(jQuery);

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
} 