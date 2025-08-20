export function cursor() {
    const cursor = document.querySelector('.cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Лёгкая задержка движения (0.15 — скорость приближения)
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animate);
    }

    animate();

// Реакция на кликабельные элементы
    document.querySelectorAll('a, button, [data-cursor="hover"]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '30px';
            cursor.style.height = '30px';
        });
    });
}

export function showNav() {

    const navLink = document.querySelector( '.show-nav');
    const nav = document.querySelector( '.top-block__nav');
    const spring = document.querySelector( '.top-block__spring');
    const content = document.querySelector( '.top-block__content');
    const closeLink = document.querySelector( '.nav__close');
    const headerInset = document.querySelector( 'header.inset')
    const html = document.documentElement;

    $(navLink).on('click', function() {
        $(navLink).toggleClass('active');
        $(nav).toggleClass('active');
        $(spring).toggleClass('hidden');
        $(content).toggleClass('hidden');
        $(headerInset).toggleClass('open');
        html.classList.add('no-scroll');
    });
    $(closeLink).on('click', function() {
        $(navLink).removeClass('active');
        $(nav).removeClass('active');
        $(spring).removeClass('hidden');
        $(content).removeClass('hidden');
        $(headerInset).removeClass('open');
        html.classList.remove('no-scroll');
    });

}


export function mainSlider() {
    const sliderEl = document.querySelector('.slider');
    if (!sliderEl) return;

    let sliderInstance = null;
    let isMobileConfig = null;

    const VISIBLE_PAGINATION_COUNT = 4;

    const commonOptions = {
        direction: 'horizontal',
        spaceBetween: 20,
        loop: true,
        speed: 600,
        allowTouchMove: true,
        navigation: {
            nextEl: '.slider__button--next',
            prevEl: '.slider__button--prev',
        },
        pagination: {},
    };

    const mobileOptions = {
        slidesPerView: 1,
        effect: 'fade',
        fadeEffect: { crossFade: true }
    };

    const desktopOptions = {
        slidesPerView: 'auto',
        effect: 'slide'
    };

    function mainPad2(n) { return String(n).padStart(2, '0'); }

    function initSlider() {
        const shouldUseMobile = window.innerWidth < 768;
        if (sliderInstance && isMobileConfig === shouldUseMobile) return;

        if (sliderInstance) {
            sliderInstance.destroy(true, true);
            sliderInstance = null;
        }

        // Пагинация: показываем все буллеты в треке, контейнер — viewport с overflow:hidden
        let visibleStartIndex = 0; // индекс левого видимого буллета
        let totalSlides = 0;
        let stepWidth = 0; // ширина шага (одной кнопки)

        const paginationEl = document.querySelector('.slider__pagination');
        const nextBtn = document.querySelector('.slider__button--next');
        const prevBtn = document.querySelector('.slider__button--prev');
        let lastActiveIndex = null; // для определения направления движения

        function buildPagination(swiper, current, total) {
            totalSlides = total;
            let html = '<div class="pagination-track">';
            for (let i = 0; i < totalSlides; i++) {
                const isActive = (i + 1) === current; // current — 1-based
                html += `<span class="swiper-pagination-bullet${isActive ? ' swiper-pagination-bullet-active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}">${mainPad2(i + 1)}</span>`;
            }
            html += '</div>';
            return html;
        }

        // Хелперы для циклического смещения окна пагинации
        function wrapIndexForward(nextIndex) {
            const maxStart = Math.max(0, totalSlides - VISIBLE_PAGINATION_COUNT);
            return nextIndex > maxStart ? 0 : nextIndex;
        }
        function wrapIndexBackward(prevIndex) {
            const maxStart = Math.max(0, totalSlides - VISIBLE_PAGINATION_COUNT);
            return prevIndex < 0 ? maxStart : prevIndex;
        }

        const customPagination = {
            el: '.slider__pagination',
            clickable: true,
            type: 'custom',
            renderCustom(swiper, current, total) {
                return buildPagination(swiper, current, total);
            }
        };

        sliderInstance = new Swiper('.slider', {
            ...commonOptions,
            ...(shouldUseMobile ? mobileOptions : desktopOptions),
            pagination: customPagination
        });

        function applyViewportStyles() {
            if (!paginationEl) return;
            paginationEl.style.overflow = 'hidden';
            paginationEl.style.display = 'inline-block';
            const track = paginationEl.querySelector('.pagination-track');
            if (!track) return;
            track.style.display = 'inline-flex';
            // track.style.transition = 'transform 0.3s ease';

            // Измеряем шаг
            const bullets = track.querySelectorAll('.swiper-pagination-bullet');
            if (bullets.length === 0) return;
            if (bullets.length === 1) {
                stepWidth = bullets[0].getBoundingClientRect().width;
            } else {
                const b0 = bullets[0].getBoundingClientRect();
                const b1 = bullets[1].getBoundingClientRect();
                stepWidth = Math.max(1, b1.left - b0.left); // включает маргины/геп
            }
            // Фиксируем ширину viewport на 4 кнопки
            paginationEl.style.width = (stepWidth * VISIBLE_PAGINATION_COUNT) + 'px';
            updateTrackPosition();
        }

        function updateTrackPosition() {
            if (!paginationEl) return;
            const track = paginationEl.querySelector('.pagination-track');
            if (!track) return;
            // Не ограничиваем maxStart — активный должен быть слева всегда
            if (visibleStartIndex < 0) visibleStartIndex = 0;
            const offset = visibleStartIndex * stepWidth;
            track.style.transform = `translateX(-${offset}px)`;
        }

        function setActiveAsLeft() {
            // Текущий активный индекс (0-based)
            const current = (sliderInstance.realIndex ?? sliderInstance.activeIndex) | 0;

            // Безопасно определим общее число буллетов, если ещё не знаем
            if (!totalSlides || totalSlides <= 0) {
                const bullets = paginationEl?.querySelectorAll('.swiper-pagination-bullet');
                if (bullets && bullets.length) {
                    totalSlides = bullets.length;
                }
            }

            const maxStart = Math.max(0, (totalSlides || 0) - VISIBLE_PAGINATION_COUNT);
            const SHIFT_START_IDX = 3; // номер 4 (0-based)

            if (lastActiveIndex !== null && current < lastActiveIndex) {
                // Движение назад: выравниваем так, чтобы активный был справа
                // Пример: при 7 активном окно 4–7; при 6 — 3–6; при 5 — 2–5; при 4 — 1–4; далее стоп на 1–4
                visibleStartIndex = Math.max(0, current - (VISIBLE_PAGINATION_COUNT - 1));
            } else {
                // Движение вперёд/первая инициализация: активный слева, сдвиг начинается с 4
                if (current < SHIFT_START_IDX) {
                    visibleStartIndex = 0; // окно 1–4
                } else {
                    visibleStartIndex = Math.min(current, maxStart);
                }
            }

            lastActiveIndex = current;

            if (sliderInstance.pagination && typeof sliderInstance.pagination.update === 'function') {
                sliderInstance.pagination.update();
            }
            requestAnimationFrame(() => applyViewportStyles());
        }

        // Обработчики
        const onPaginationClick = (e) => {
            const target = e.target.closest('[data-index]');
            if (!target) return;
            const idx = parseInt(target.getAttribute('data-index'), 10);
            if (Number.isNaN(idx)) return;
            // Переходим к слайду (активный станет левым на slideChange)
            if (typeof sliderInstance.slideToLoop === 'function') {
                sliderInstance.slideToLoop(idx);
            } else {
                sliderInstance.slideTo(idx);
            }
        };

        // Для стрелок: не двигаем вручную окно, дождёмся события slideChange
        const onNextClick = () => {/* noop: slideChange выровняет */};
        const onPrevClick = () => {/* noop: slideChange выровняет */};

        if (paginationEl) {
            paginationEl.onclick = onPaginationClick;
        }
        if (nextBtn) nextBtn.onclick = onNextClick;
        if (prevBtn) prevBtn.onclick = onPrevClick;

        // Применим стили после первой отрисовки пагинации
        requestAnimationFrame(() => applyViewportStyles());

        // При смене слайда (клик/стрелки/свайп) — активный номер ставим крайним левым
        sliderInstance.on('slideChange', setActiveAsLeft);

        // Удаляем сдвиги окна при свайпах: slideNextTransitionStart/slidePrevTransitionStart больше не требуются
        // (выравнивание выполняется единообразно в обработчике slideChange)
        isMobileConfig = shouldUseMobile;
    }

    initSlider();

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initSlider, 200);
    });

    const fullBtn = document.querySelector('.full-slider-btn');
    const prevBtnMain = document.querySelector('.slider__button--prev');
    const fullSlider = document.querySelector('.main-slider');
    const leftBlock = document.querySelector('.main-slider__left');
    const rightBlock = document.querySelector('.main-slider__right');

    if (fullBtn && leftBlock && rightBlock) {
        fullBtn.addEventListener('click', () => {
            fullBtn.classList.add('hidden');
            prevBtnMain && prevBtnMain.classList.remove('hidden');
            leftBlock.classList.add('hidden');
            rightBlock.classList.add('expanded');
            fullSlider && fullSlider.classList.add('expanded');
        });
    }
}

export function navEffect() {

document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav__item');
  const imagesItems = document.querySelectorAll('.nav__images-item');

  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const itemNum = item.getAttribute('data-link');
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
    const topCounter = document.querySelectorAll('.top-block-inset__counter-list');
    const sliderItems = document.querySelectorAll('.slider__item');
    const navItems = document.querySelectorAll('.nav__item');

    if (!mainBlock || !sliderItems.length) return;

    const mainDataValue = mainBlock.getAttribute('data-order');
    if (!mainDataValue) return;

    sliderItems.forEach(item => {
        const slideDataValue = item.getAttribute('data-slide');
        if (slideDataValue === mainDataValue) {
            item.classList.add('disabled');
        } else {
            item.classList.remove('disabled');
        }
    });

    topCounter.forEach(counter => {
        counter.classList.add('top-block-inset__counter-list--' + mainDataValue);

        const links = counter.querySelectorAll('a');
        links.forEach((link, idx) => {
            if ((idx + 1).toString() === mainDataValue) {
                link.classList.add('current');
            } else {
                link.classList.remove('current');
            }
        });
    });
}

export function compareDataLinks() {
    // Получаем все nav__item и все counter-item
    const navItems = document.querySelectorAll('.nav__item');
    const counterLinks = document.querySelectorAll('.top-block-inset__counter-item');
    const sliderItems = document.querySelectorAll('.slider__item');

    // Строим карту соответствий data-link -> href из навигации
    const navHrefByLink = new Map();
    navItems.forEach(navItem => {
        const itemNum = navItem.getAttribute('data-link');
        const href = navItem.getAttribute('href') || '';
        if (itemNum) navHrefByLink.set(itemNum, href);
    });

    // Проставляем href в счётчик по data-count
    counterLinks.forEach(counterLink => {
        const count = counterLink.getAttribute('data-count');
        if (!count) return;
        const href = navHrefByLink.get(count);
        if (href) counterLink.setAttribute('href', href);
    });

    // Проставляем href в слайды по data-slide
    sliderItems.forEach(slide => {
        const slideNum = slide.getAttribute('data-slide');
        if (!slideNum) return;
        const href = navHrefByLink.get(slideNum);
        if (href) slide.setAttribute('href', href);
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

export function removeCurrentSlideFromSlider() {
    const main = document.querySelector('main');
    if (!main) return;
    const currentOrder = main.getAttribute('data-order');
    if (!currentOrder) return;

    const wrapper = document.querySelector('.slider .slider__container');
    if (!wrapper) return;

    const slidesToRemove = wrapper.querySelectorAll(`.slider__item[data-slide="${currentOrder}"]`);
    if (slidesToRemove.length) {
        slidesToRemove.forEach((slide) => {
            slide.remove();
        });
    }

    // Переиндексируем классы slider__item--N для оставшихся слайдов
    const remainingSlides = wrapper.querySelectorAll('.slider__item');
    remainingSlides.forEach((slide, idx) => {
        const classes = Array.from(slide.classList);
        classes.forEach((cls) => {
            if (/^slider__item--\d+$/.test(cls)) {
                slide.classList.remove(cls);
            }
        });
        slide.classList.add(`slider__item--${idx + 1}`);
    });
}

export function ellipsBalls() {
  const balls = [
    { 
      el: document.querySelector(".spring__ball--1"), 
      size: 25, 
      a: 310 / 2, 
      b: 146 / 2, 
      theta: -10 * Math.PI / 180 
    },
    { 
      el: document.querySelector(".spring__ball--2"), 
      size: 47, 
      a: 310 / 2, 
      b: 146 / 2, 
      theta: -10 * Math.PI / 180 
    },
    { 
      el: document.querySelector(".spring__ball--3"), 
      size: 115, 
      a: 310 / 2, 
      b: 146 / 2, 
      theta: -10 * Math.PI / 180 
    },
    { 
      el: document.querySelector(".content__spring--2 .spring__ball--1"), 
      size: 25, 
      a: 300 / 2, 
      b: 140 / 2, 
      theta: 10 * Math.PI / 180 
    },
  ];

  let angle = 0;

  function animate() {
    balls.forEach((ball, i) => {
      if (!ball.el) return;

      const baseSize = ball.size;
      const r = baseSize / 2;

      const a = ball.a;
      const b = ball.b;
      const centerX = a;
      const centerY = b;
      const theta = ball.theta;

      // каждому шару своя фаза, чтобы они не шли "паровозиком"
      const phase = angle + (i * Math.PI * 2) / balls.length;

      // координаты на эллипсе
      const x = centerX + a * Math.cos(phase) * Math.cos(theta) - b * Math.sin(phase) * Math.sin(theta);
      const y = centerY + a * Math.cos(phase) * Math.sin(theta) + b * Math.sin(phase) * Math.cos(theta);

      // масштаб: внизу больше, наверху меньше
      const scale = 0.5 + 0.3 * (1 + Math.sin(phase)) / 2;
      const size = baseSize * scale;

      ball.el.style.left = `${x - size / 2}px`;
      ball.el.style.top = `${y - size / 2}px`;
      ball.el.style.width = `${size}px`;
      ball.el.style.height = `${size}px`;
    });

    angle += 0.02;
    requestAnimationFrame(animate);
  }

  animate();
}

