export function showNav() {

    const navLink = document.querySelector( '.show-nav');
    const nav = document.querySelector( '.top-block__nav');
    const spring = document.querySelector( '.top-block__spring');
    const content = document.querySelector( '.top-block__content');
    const closeLink = document.querySelector( '.nav__close')
    $(navLink).on('click', function() {
        $(navLink).toggleClass('active');
        $(nav).toggleClass('active');
        $(spring).toggleClass('hidden');
        $(content).toggleClass('hidden')
    });
    $(closeLink).on('click', function() {
        $(navLink).removeClass('active');
        $(nav).removeClass('active');
        $(spring).removeClass('hidden');
        $(content).removeClass('hidden')
    });

}


export function mainSlider() {
    const slider = new Swiper('.slider', {
        direction: 'horizontal',
        slidesPerView: 'auto',
        spaceBetween: 20,
        loop: true,
        speed: 600,
        allowTouchMove: true,
        navigation: {
            nextEl: '.slider__button--next',
            prevEl: '.slider__button--prev',
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
    const prevBtn = document.querySelector('.slider__button--prev');
    const fullSlider = document.querySelector('.main-slider');
    const leftBlock = document.querySelector('.main-slider__left');
    const rightBlock = document.querySelector('.main-slider__right');

    if (fullBtn && leftBlock && rightBlock) {
        fullBtn.addEventListener('click', () => {
            fullBtn.classList.add('hidden');
            prevBtn.classList.remove('hidden');
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
    const decorElements = document.querySelectorAll('.decor');

    if (!decorElements.length) return;

    let mouseX = 0;
    let mouseY = 0;

    // Обработчик движения мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Функция анимации для одного элемента
    function animateDecor(element) {
        // Получаем позицию элемента
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Вычисляем расстояние от курсора до центра элемента
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        // Ограничиваем движение для деликатности
        const maxOffset = 8;
        const sensitivity = 0.02;

        // Вычисляем смещение с учетом чувствительности (инвертируем движение)
        const elementX = -deltaX * sensitivity;
        const elementY = -deltaY * sensitivity;

        // Ограничиваем максимальное смещение
        const limitedX = Math.max(-maxOffset, Math.min(maxOffset, elementX));
        const limitedY = Math.max(-maxOffset, Math.min(maxOffset, elementY));

        // Применяем трансформацию с плавной анимацией
        element.style.transform = `translate(${limitedX}px, ${limitedY}px) rotate(${limitedX * 0.5}deg)`;
    }

    // Функция анимации для всех элементов
    function animateAllDecor() {
        decorElements.forEach(element => {
            animateDecor(element);
        });
        requestAnimationFrame(animateAllDecor);
    }

    // Добавляем плавный переход для каждого элемента
    decorElements.forEach(element => {
        element.style.transition = 'transform 0.2s ease-out';
    });

    // Запускаем анимацию
    animateAllDecor();

    // Добавляем плавность при возврате в исходное положение
    document.addEventListener('mouseleave', () => {
        decorElements.forEach(element => {
            element.style.transition = 'transform 0.8s ease-out';
            element.style.transform = 'translate(0px, 0px) rotate(0deg)';
        });

        // Убираем transition после анимации
        setTimeout(() => {
            decorElements.forEach(element => {
                element.style.transition = '';
            });
        }, 800);
    });
}

export function springScrollEffect() {
    const springItem = document.querySelector('.spring');
    
    if (!springItem) return;

    let lastScrollY = window.scrollY;
    let isCompressed = false;
    let originalHeight = springItem.offsetHeight;

    // Функция сжатия пружины
    function compressSpring() {
        if (isCompressed) return;

        isCompressed = true;

        // Быстрое сжатие на 20%
        springItem.style.transition = 'height 0.15s ease-out';
        springItem.style.height = (originalHeight * 0.8) + 'px';

        // Мгновенный отскок обратно с небольшой задержкой
        setTimeout(() => {
            springItem.style.transition = 'height 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            springItem.style.height = (originalHeight * 1.05) + 'px';

            // Возврат к нормальной высоте
            setTimeout(() => {
                springItem.style.transition = 'height 0.2s ease-out';
                springItem.style.height = originalHeight + 'px';
            }, 300);
        }, 150);

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

export function compareDataAttributes() {
    const mainBlock = document.querySelector('main');
    const sliderItems = document.querySelectorAll('.slider__item');
    
    if (!mainBlock || !sliderItems.length) return;
    
    // Получаем значение data-main у блока main
    const mainDataValue = mainBlock.getAttribute('data-main');
    
    if (!mainDataValue) return;
    
    // Проходим по всем элементам slider__item
    sliderItems.forEach(item => {
        const slideDataValue = item.getAttribute('data-slide');
        
        // Если значения совпадают, добавляем класс disabled
        if (slideDataValue === mainDataValue) {
            item.classList.add('disabled');
        } else {
            // Если не совпадают, убираем класс disabled
            item.classList.remove('disabled');
        }
    });
}

export function toTopButton() {
    const toTopBtn = document.querySelector('.to-top');
    
    if (!toTopBtn) return;
    
    // Вычисляем 1vh в пикселях
    const oneVh = window.innerHeight * 0.01;
    
    // Функция проверки видимости кнопки
    function toggleButtonVisibility() {
        if (window.scrollY > oneVh) {
            toTopBtn.classList.add('active');
        } else {
            toTopBtn.classList.remove('active');
        }
    }
    
    // Обработчик скролла
    window.addEventListener('scroll', toggleButtonVisibility);
    
    // Обработчик клика по кнопке
    toTopBtn.addEventListener('click', () => {
        // Плавный скролл вверх
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Проверяем начальное состояние
    toggleButtonVisibility();
}

export function scrollReveal() {
    const elements = document.querySelectorAll('.content__title, .content__text');
    const quoteBlocks = document.querySelectorAll('.quote');
    
    if (!elements.length && !quoteBlocks.length) return;
    
    // Функция проверки видимости элемента
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Элемент считается видимым, когда его верхняя граница находится в пределах экрана
        // с небольшим отступом для более раннего срабатывания
        return rect.top <= windowHeight * 0.8;
    }
    
    // Функция анимации появления для content элементов
    function revealElement(element) {
        if (element.classList.contains('revealed')) return;
        
        element.classList.add('revealed');
    }
    
    // Функция активации для quote блоков
    function activateQuote(quote) {
        if (quote.classList.contains('active')) return;
        
        quote.classList.add('active');
    }
    
    // Функция проверки всех элементов
    function checkElements() {
        // Проверяем content элементы
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                revealElement(element);
            }
        });
        
        // Проверяем quote блоки
        quoteBlocks.forEach(quote => {
            if (isElementInViewport(quote)) {
                activateQuote(quote);
            }
        });
    }
    
    // Обработчик скролла с throttling для производительности
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                checkElements();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Добавляем обработчик скролла
    window.addEventListener('scroll', requestTick);
    
    // Проверяем элементы при загрузке страницы
    checkElements();
}

