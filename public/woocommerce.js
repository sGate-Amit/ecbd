(function ($) {
    
    "use strict";

    $(document).ready(function () {

        $('.btn-fix-cart').each(function () {
            $(this).on("click", function (event) {
                event.stopPropagation();
                $('body').toggleClass('cart-open');
                $("#content-cart").toggleClass("active");
            })
        });

        ////

        // Ajax QuickView
        $('.quickview').on('click', function (e) {
            e.preventDefault();
            var productslug = $(this).data('productslug');
            $.ajax({
                url: woocommerce_params.ajax_url,
                data: {
                    action: 'plant_quickview',
                    productslug: productslug
                },
                type: 'GET',
                beforeSend: function () {
                },
                success: function (response) {
                    $('#pbr-quickview-modal .modal-body').html(response).hide().fadeIn();

                    $('#pbr-quickview-modal .js-slick-slider').not('.slick-initialized').slick({
                        slidesToShow  : 1,
                        slidesToScroll: 1,
                        asNavFor      : '.slider-nav',
                    });

                    $('#pbr-quickview-modal .slider-nav').not('.slick-initialized').slick({
                        slidesToShow  : 4,
                        slidesToScroll: 1,
                        focusOnSelect: true,
                        centerMode: true,
                        asNavFor      : '.js-slick-slider',
                    });
                    if (typeof wc_add_to_cart_variation_params !== 'undefined') {
                        $('.variations_form').wc_variation_form();
                        $('.variations_form .variations select').change();
                    }
                }
            });

        });

        $('#pbr-quickview-modal').on('hidden.bs.modal', function () {
            $(this).find('.modal-body').empty().append('<span class="spinner"></span>');
        });
        /////

        $('.widget_product_categories ul li.cat-item').each(function () {
            if ($(this).find('ul.children').length > 0) {
                $(this).append('<i class="closed fa fa-plus"></i>');
            }
            $(this).find('ul.children').hide();
        });
        $("body").on("click", '.widget_product_categories ul li.cat-item .closed', function () {
            $(this).parent().find('ul.children').first().show();
            $(this).removeClass('closed').removeClass('fa-plus').addClass('opened').addClass('fa-minus');
        });
        $("body").on("click", '.widget_product_categories ul li.cat-item .opened', function () {
            $(this).parent().find('ul.children').first().hide();
            $(this).removeClass('opened').removeClass('fa-minus').addClass('closed').addClass('fa-plus');
        });

        /*======== Quantity ===========*/
        $('.woocommerce').on('click', '.quantity_actions .btn', function () {
            var quantityContainer = $(this).closest('.quantity'),
                quantityInput = quantityContainer.find('.qty'),
                quantityVal = quantityInput.attr('value');

            $('.woocommerce-cart-form :input[name="update_cart"]').prop('disabled', false);

            if ($(this).hasClass('plus')) {
                quantityInput.attr('value', parseInt(quantityVal) + 1);
            } else if ($(this).hasClass('minus')) {
                if (quantityVal > 0) {
                    quantityInput.attr('value', parseInt(quantityVal) - 1);
                }
            }
        });
    });


})(jQuery)