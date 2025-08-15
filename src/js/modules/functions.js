export function showNav() {

    const navLink = document.querySelector( '.show-nav');
    const nav = document.querySelector( '.top-block__nav');
    const spring = document.querySelector( '.top-block__spring');
    const content = document.querySelector( '.top-block__content')
    $(navLink).on('click', function() {
        $(navLink).toggleClass('active');
        $(nav).toggleClass('active');
        $(spring).toggleClass('hidden');
        $(content).toggleClass('hidden')
    });

}


export function mainSlider() {
    const slider = new Swiper('.slider', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        loop: false,
        speed: 600,
        allowTouchMove: true,
        navigation: {
            nextEl: '.slider__button-next',
            prevEl: '.slider__button-prev',
        },
        pagination: {
            el: '.slider__pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return `<span class="${className}">${(index + 1).toString().padStart(2, '0')}</span>`;
            }
        },
    });

    const fullBtn = document.querySelector('.full-slider-btn');
    const fullSlider = document.querySelector('.main-slider');
    const leftBlock = document.querySelector('.main-slider__left');
    const rightBlock = document.querySelector('.main-slider__right');

    if (fullBtn && leftBlock && rightBlock) {
        fullBtn.addEventListener('click', () => {
            leftBlock.classList.add('hidden');
            rightBlock.classList.add('expanded');
            fullSlider.classList.add('expanded');
        });
    }
}

export function navEffect() {

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav__item');
  const imagesItems = document.querySelectorAll('.nav__images-item');

  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const itemNum = item.getAttribute('data-item');
      imagesItems.forEach(img => {
        if (img.getAttribute('data-image') === itemNum) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    });
    item.addEventListener('mouseleave', () => {
      imagesItems.forEach(img => img.classList.remove('active'));
    });
  });
});

}

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

export function setMainSliderLeftPadding() {
    const content = document.querySelector('.top-block__content');
    const sliderLeft = document.querySelector('.main-slider');
    if (!content || !sliderLeft) return;

    function updatePadding() {
        const rect = content.getBoundingClientRect();
        sliderLeft.style.paddingLeft = rect.left + 'px';
    }

    updatePadding();
    window.addEventListener('resize', updatePadding);
}

