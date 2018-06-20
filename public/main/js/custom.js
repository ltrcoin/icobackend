$(document).ready(function() {
    "use strict";
    $('body').scrollspy({
        target: '#minify_nav',
        offset: 100
    });

    $('nav a[href^="#"]:not([href="#"]), .scroll').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 60
        }, 1500);
        event.preventDefault();
    });
    $(window).on("scroll touchmove", function() {
        $('#minify_nav').toggleClass('mini-nav', $(document).scrollTop() > 60);
    });
    $(window).scroll(function() {
        if ($(this).scrollTop() > 600) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }
    });

    $('.scrollup').on('click', function() {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });

    var clock = $('.clock').FlipClock(3600 * 24 * 70, {
        clockFace: 'DailyCounter',
        countdown: true,
		language:'vn'
    });
	clock.loadLanguage("vn");
    $('.fade-left').waypoint(function() {
        $('.fade-left').addClass('animated fadeInLeft');
    }, {
        offset: '50%'
    });


    $('.fade-right').waypoint(function() {
        $('.fade-right').addClass('animated fadeInRight');
    }, {
        offset: '100%'
    });
    new WOW().init();
});


$(".team-images").eq(0).addClass("current_dot");
$('.team-images').on('click', function(e) {
    $(".team-images").removeClass("current_dot");
    $(this).addClass("current_dot");
    $sync2.trigger('to.owl.carousel', [$(this).index(), duration, true]);
});


$('.video-play').magnificPopup({
    type: 'iframe',
    closeOnBgClick: false,
    iframe: {
        markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' + '<div class="mfp-title">Some caption</div>' + '</div>'
    },
    callbacks: {
        markupParse: function(template, values, item) {
            values.title = item.el.attr('title');
        }
    },
    removalDelay: 300,
    mainClass: 'mfp-fade'
});


//preloader
$(window).on('load', function(){
    $("body").css("overflow","auto");
    $(".preloader").fadeOut(1000,function(){
        $(this).remove();
    });
});