$(document).ready(function () {
    $('.init__slick').slick();
    initMarquee();
    initCarousel();
    initLazy();

//Begin Running line
    function initMarquee() {
        if (!$(".marquee").length) return;

        $(".marquee").marquee({
            duration: 30000,
            startVisible: true,
            gap: 0,
            delayBeforeStart: 0,
            direction: "left",
            duplicated: true
        });
    };
    //End running line


//Begin Parallax - движение изображения
    var elem = $('.content-title__inner'),         //    Контейнер, в котором будем проводить анимацию
        pos = elem.offset(),            //    Позиция элемента
        elem_left = pos.left,           //    Слева
        elem_top = pos.top,             //    Сверху
        elem_width = elem.width(),      //    Ширина элемента
        elem_height = elem.height(),    //    Высота элемента
        x_center,    //    Координаты центра по оси X
        y_center;    //    Координаты центра по оси Y

//    Обрабатываем событие перемещения курсора мыши
    $('.content-title__inner').mousemove(function (e) {

//    Определяем центр элемента (формула легко гуглится)
        x_center = (elem_width / 2) - (e.pageX - elem_left);
        y_center = (elem_height / 2) - (e.pageY - elem_top);

//    Проходим по всем блокам с изображениями)
        $('.parallax').each(function () {

            var speed = $(this).attr('data-speed'),     //    Определяем скорость
                xPos = Math.round(-1 * x_center / 20 * speed),//    Высчитываем позицию по оси X, движения будут инвертированы (-1). Формула подбиралась на глаз
                yPos = Math.round(y_center / 20 * speed);   //    Высчитываем позицию по оси Y

//    Перемещение по оси Y делаем до определенной точки, потом перемещение останавливаем
            if (yPos < 0)
                yPos = -2 * speed;

//    Непосредственно перенос
            $(this).css('transform', 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0px)');

        });
    });
//End Parallax


    //Begin filter select

    var fActive = '';

    function filterSpeaker(speaker) {
        if (fActive != speaker) {
            $('.speakers-block').filter('.' + speaker).slideDown();
            $('.speakers-block').filter(':not(.' + speaker + ')').slideUp();
            fActive = speaker;
        }
    }

    $('.speakers-one').click(function () {
        filterSpeaker('one');
        $('.speakers-inner').css('justify-content', 'center');
        $('.block-more__inner').css('justify-content', 'center');

    });

    $('.speakers-two').click(function () {
        filterSpeaker('two');

    });

    $('.speakers-three').click(function () {
        filterSpeaker('three');

    });

    $(document).mouseup(function (e) {
        var div4 = $(".speakers-characteristic");
        if (!div4.is(e.target) && div4.has(e.target).length === 0) {
        }
    });

//End filter select

//Begin text more
    $('.speaker-block__more-link').click(function () {
        $('.speaker-text__block-more').fadeToggle();

    });
//End text more

//Open select sell-popup
    $('.js__select-current').click(function () {
        $('.select-list').fadeToggle();
    });
//

//Open nav menu
    $('.header-nav__burger').click(function () {
        $('.header-navigation').fadeToggle();
    });
    $('.header-navigation__items-close').click(function () {
        $('.header-navigation').fadeOut();
    });

    $(function ($) {
        $(document).mouseup(function (e) { // событие клика по веб-документу
            var div = $(".header-navigation"); // тут указываем ID элемента
            if (!div.is(e.target) // если клик был не по нашему блоку
                && div.has(e.target).length === 0) { // и не по его дочерним элементам
                div.hide(); // скрываем его
            }
        });
    });
// end nav menu

//изначально установленная галочка в чекбоксе
    $("#checkbox1").attr("checked", "checked");
//

// Begin photogallery slider
    function initCarousel() {

        if (!$('div.slick-carousel').length) return;

        $(document).on('carousel.init', 'div.slick-carousel', function (event, slick) {
            var
                $carousel = $(this),
                defaults = {
                    infinite: true,
                    rows: 1,
                    arrows: true,
                    dots: false,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    mobileFirst: false,
                    appendArrows: ".photogallery",

                },
                options = {}
            ;

            if ($carousel.data('slick-options')) {
                options = eval('[' + $carousel.data('slick-options') + ']')[0];

                $.extend(defaults, options);
            }

            $carousel.slick(defaults);
        });

        $('div.slick-carousel').trigger('carousel.init');
    }

    function initLazy() {

        let
            lazyArr = [].slice.call(document.querySelectorAll('.lazy')),
            active = false,
            threshold = 200
        ;

        const lazyLoad = function (e) {
            if (active === false) {
                active = true;

                setTimeout(function () {
                    lazyArr.forEach(function (lazyObj) {
                        if ((lazyObj.getBoundingClientRect().top <= window.innerHeight +
                            threshold && lazyObj.getBoundingClientRect().bottom >= -threshold) &&
                            getComputedStyle(lazyObj).display !== 'none') {

                            if (lazyObj.dataset.src) {
                                let
                                    img = new Image(),
                                    src = lazyObj.dataset.src
                                ;
                                img.src = src;
                                img.onload = function () {
                                    if (!!lazyObj.parent) {
                                        lazyObj.parent.replaceChild(img, lazyObj);
                                    } else {
                                        lazyObj.src = src;
                                    }
                                }
                                lazyObj.removeAttribute('data-src');
                            }

                            if (lazyObj.dataset.srcset) {
                                lazyObj.srcset = lazyObj.dataset.srcset;
                                lazyObj.removeAttribute('data-srcset');
                            }

                            lazyObj.classList.remove('lazy');
                            lazyObj.classList.add('lazy-loaded');

                            lazyArr = lazyArr.filter(function (obj) {
                                return obj !== lazyObj;
                            });

                            if (lazyArr.length === 0) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationchange', lazyLoad);
                            }
                        }
                    });
                    active = false;
                }, 200);
            }
        };

        lazyLoad();

        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
    }
// end photogalery slider


// theme carousel
//     var
//         carousel = document.querySelector('.carousel'),
//         themes =  document.querySelector('.themes'),
//         figure = carousel.querySelector('figure'),
//         nav = themes.querySelector('nav'),
//         numImages = figure.childElementCount,
//         theta =  2 * Math.PI / numImages,
//         currImage = 0
//     ;
//
//     nav.addEventListener('click', onClick, true);
//
//     function onClick(e) {
//         e.stopPropagation();
//
//         var t = e.target;
//         if (t.tagName.toUpperCase() != 'BUTTON')
//             return;
//
//         if (t.classList.contains('next')) {
//             currImage++;
//         }
//         else {
//             currImage--;
//         }
//
//         figure.style.transform = `rotateY(${currImage * -theta}rad)`;
//     }
// end carousel

});











