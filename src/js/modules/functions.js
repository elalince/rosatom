
export function showNav() {

    const navbarBtn = document.querySelector( '.navbar-btn');
    const navbarList = document.querySelector( '.navbar');
    const navbarHeader = document.querySelector( 'header');
    const navbarLink = document.querySelectorAll( '.navbar__item');

    $(navbarBtn).on('click', function() {
        $(navbarBtn).toggleClass('navbar-btn_close')
        $(navbarList).toggleClass('navbar_open')
        $(navbarHeader).toggleClass('nav-open')
    });
    $(navbarLink).on('click', function() {
        $(navbarBtn).removeClass('navbar-btn_close')
        $(navbarList).removeClass('navbar_open')
        $(navbarHeader).removeClass('nav-open')
    });

    // document.addEventListener( 'click', (e) => {
    //     const withinBoundaries = e.composedPath().includes(navbarList);
    //     const withinLink = e.composedPath().includes(navbarLink);
    //
    //     if ( ! withinBoundaries && ! withinLink ) {
    //         $(navbarList).removeClass('navbar_open')
    //     }
    // })
}
export function scrollTo () {
    const anchors = document.querySelectorAll('a[href*="#"]')

    for (let anchor of anchors) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()

            const blockID = anchor.getAttribute('href').substr(1)

            document.getElementById(blockID).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        })
    }
}


export function mainSlider() {
    const slider = new Swiper('.slider', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        slidesToScroll: 1,
        loop: true,
        simulateTouch: true,
        autoplay: true,
        speed: 3000,
        allowTouchMove: true,
        breakpoints: {
           768: {
               slidesPerView: 3,
               spaceBetween: 30,
               centeredSlides: true
            }
        }
    });
}

export function addResume() {

    $('.main-form__input_hidden').click(function(){
        $(".main-form__input_hidden").click();
    });

    $('.main-form__input_hidden').change(function() {
        $('.main-form__selected-file').addClass('visible').text($('.main-form__input_hidden')[0].files[0].name);
    });



}
// export function scrollAnimation() {
//     const animItems = document.querySelector('.main-info__decor');
//
//     if (animItems.length > 0){
//         function  animOnScroll(){
//             for (let index = 0; index < animItems.length; index++) {
//                 const animItem = animItems[index];
//                 const animItemHeight = animItem.offsetHeight;
//                 const animItemOffset = offset(animItem).top;
//                 const animStart = 4;
//
//                 let animItemPoint = window.innerHeight - animItemHeight / animStart;
//
//                 if (animItemHeight > window.innerHeight) {
//                     animItemPoint = window.innerHeight - window.innerHeight / animStart;
//                 }
//
//                 if((scrollY >  animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)) {
//                     animItem.classList.add('_move');
//                 } else {
//                     animItem.classList.add('_move');
//                 }
//
//             }
//
//
//         }
//     }
//     function offset(el) {
//         var rect = el.getBoundingClientRect(),
//             scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
//             scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//         return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
//     }
//     animOnScroll();
//     console.log(animItems.length);
// }
// export function textSlice() {
//
//     var sliced = document.querySelector('.slider__text').slice(0,10);
//     if (sliced.length < text.length) {
//         sliced += '...';
//     }
// }

export function starMouseFollow() {
    const star = document.querySelector('.top-block__star');
    
    if (!star) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let starX = 0;
    let starY = 0;
    
    // Добавляем плавный переход для создания эффекта задержки
    star.style.transition = 'transform 0.2s ease-out';
    
    // Получаем начальную позицию звезды
    const starRect = star.getBoundingClientRect();
    const centerX = starRect.left + starRect.width / 2;
    const centerY = starRect.top + starRect.height / 2;
    
    // Обработчик движения мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Функция анимации с задержкой
    function animateStar() {
        // Вычисляем расстояние от курсора до центра звезды
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        
        // Ограничиваем движение для деликатности
        const maxOffset = 8;
        const sensitivity = 0.02;
        
        // Вычисляем смещение с учетом чувствительности (инвертируем движение)
        starX = -deltaX * sensitivity;
        starY = -deltaY * sensitivity;
        
        // Ограничиваем максимальное смещение
        starX = Math.max(-maxOffset, Math.min(maxOffset, starX));
        starY = Math.max(-maxOffset, Math.min(maxOffset, starY));
        
        // Применяем трансформацию с плавной анимацией
        star.style.transform = `translate(${starX}px, ${starY}px) rotate(${starX * 0.5}deg)`;
        
        // Продолжаем анимацию
        requestAnimationFrame(animateStar);
    }
    
    // Запускаем анимацию
    animateStar();
    
    // Добавляем плавность при возврате в исходное положение
    document.addEventListener('mouseleave', () => {
        star.style.transition = 'transform 0.8s ease-out';
        star.style.transform = 'translate(0px, 0px) rotate(0deg)';
        
        // Убираем transition после анимации
        setTimeout(() => {
            star.style.transition = '';
        }, 800);
    });
}

export function springScrollEffect() {
    const springItems = document.querySelectorAll('.spring__item');
    
    if (!springItems.length) return;
    
    let lastScrollY = window.scrollY;
    let isCompressed = false;
    
    // Функция сжатия пружины
    function compressSpring() {
        if (isCompressed) return;
        
        isCompressed = true;
        
        springItems.forEach((item, index) => {
            // Добавляем задержку для каждого элемента (эффект волны)
            setTimeout(() => {
                // Быстрое сжатие
                item.style.transition = 'transform 0.15s ease-out';
                item.style.transform = 'scaleY(0.7)';
                
                // Мгновенный отскок обратно
                setTimeout(() => {
                    item.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    item.style.transform = 'scaleY(1.1)';
                    
                    // Возврат к нормальному размеру
                    setTimeout(() => {
                        item.style.transition = 'transform 0.2s ease-out';
                        item.style.transform = 'scaleY(1)';
                    }, 300);
                }, 150);
            }, index * 50); // Задержка 50ms между элементами
        });
        
        // Сбрасываем состояние через некоторое время
        setTimeout(() => {
            isCompressed = false;
        }, 1000);
    }
    
    // Обработчик скролла
    function handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        
        // Если скролл достаточно большой, запускаем эффект пружины
        if (scrollDelta > 10 && !isCompressed) {
            compressSpring();
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Добавляем обработчик скролла с throttling
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

