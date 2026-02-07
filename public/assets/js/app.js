document.addEventListener('DOMContentLoaded', function() {

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('header');
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      
      // Cambiar icono del botón
      const svg = mobileMenuBtn.querySelector('svg');
      const path = svg.querySelector('path');
      
      if (mobileMenu.classList.contains('hidden')) {
        // Mostrar icono de hamburguesa
        path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      } else {
        // Mostrar icono de X
        path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
      }
    });
    
    // Cerrar menú móvil al hacer clic en un enlace
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const path = mobileMenuBtn.querySelector('path');
        path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      });
    });
    
    // Scroll effect para el header
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        header.classList.add('backdrop-blur-sm', 'bg-opacity-95');
      } else {
        header.classList.remove('backdrop-blur-sm', 'bg-opacity-95');
      }
      
      // Ocultar menú móvil al hacer scroll
      if (Math.abs(currentScrollY - lastScrollY) > 50) {
        mobileMenu.classList.add('hidden');
        const path = mobileMenuBtn.querySelector('path');
        path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      }
      
      lastScrollY = currentScrollY;
    });

    // CONTADOR ANIMADO MEJORADO - Estilo CountUp.js
    class CountUp {
      constructor(target, endValue, options = {}) {
        this.target = target;
        this.endValue = endValue;
        this.startValue = options.startVal || 0;
        this.duration = options.duration || 2500; // 2.5 segundos por defecto
        this.decimals = options.decimals || 0;
        this.useEasing = options.useEasing !== false;
        this.separator = options.separator || ',';
        this.prefix = options.prefix || '';
        this.suffix = options.suffix || '';
        
        this.frameVal = this.startValue;
        this.rAF = null;
        this.startTime = null;
      }

      // Función easing para animación suave
      easeOutExpo(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
      }

      // Formatear número con separadores
      formatNumber(num) {
        const parts = num.toFixed(this.decimals).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.separator);
        return parts.join('.');
      }

      // Función de animación
      count(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        
        const progress = timestamp - this.startTime;
        const remaining = Math.max((this.duration - progress) / this.duration, 0);
        
        if (this.useEasing) {
          this.frameVal = this.endValue - this.easeOutExpo(remaining, 0, this.endValue - this.startValue, 1);
        } else {
          this.frameVal = this.endValue - (this.endValue - this.startValue) * remaining;
        }

        // Asegurar que no pase del valor final
        if (this.frameVal > this.endValue) this.frameVal = this.endValue;

        // Actualizar el elemento
        const displayValue = this.prefix + this.formatNumber(this.frameVal) + this.suffix;
        
        if (typeof this.target === 'string') {
          document.getElementById(this.target).textContent = displayValue;
        } else {
          this.target.textContent = displayValue;
        }

        // Continuar animación si no ha terminado
        if (progress < this.duration) {
          this.rAF = requestAnimationFrame((timestamp) => this.count(timestamp));
        } else {
          // Asegurar valor final exacto
          const finalValue = this.prefix + this.formatNumber(this.endValue) + this.suffix;
          if (typeof this.target === 'string') {
            document.getElementById(this.target).textContent = finalValue;
          } else {
            this.target.textContent = finalValue;
          }
        }
      }

      // Iniciar animación
      start() {
        this.reset();
        this.rAF = requestAnimationFrame((timestamp) => this.count(timestamp));
      }

      // Pausar animación
      pauseResume() {
        if (!this.rAF) {
          this.start();
        } else {
          cancelAnimationFrame(this.rAF);
          this.rAF = null;
        }
      }

      // Resetear contador
      reset() {
        cancelAnimationFrame(this.rAF);
        this.rAF = null;
        this.startTime = null;
        this.frameVal = this.startValue;
        
        const displayValue = this.prefix + this.formatNumber(this.startValue) + this.suffix;
        if (typeof this.target === 'string') {
          document.getElementById(this.target).textContent = displayValue;
        } else {
          this.target.textContent = displayValue;
        }
      }
    }

    // Inicializar contadores cuando la sección sea visible
    const statsSection = document.querySelector('.stats-section');
    let countersStarted = false;

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          
          // Configurar contadores
          const counters = [
            {
              element: document.getElementById('contador'),
              endValue: 50,
              options: { duration: 2000, useEasing: true }
            },
            {
              element: document.querySelector('[data-target="100"]'),
              endValue: 100,
              options: { duration: 2300, useEasing: true }
            },
            {
              element: document.querySelector('[data-target="1000"]'),
              endValue: 1000,
              options: { duration: 2800, useEasing: true }
            }
          ];

          // Iniciar animaciones con delay escalonado
          counters.forEach((counter, index) => {
            if (counter.element) {
              setTimeout(() => {
                const countUp = new CountUp(counter.element, counter.endValue, counter.options);
                countUp.start();
                
                // Añadir efecto visual durante la animación
                counter.element.classList.add('animating');
                setTimeout(() => {
                  counter.element.classList.remove('animating');
                }, counter.options.duration);
              }, index * 200); // Delay de 200ms entre cada contador
            }
          });
        }
      });
    }, observerOptions);

    // Comenzar a observar la sección de estadísticas
    if (statsSection) {
      observer.observe(statsSection);
    }



    // =============================================
    // GALERÍA DE FOTOS - GLightbox
    // =============================================
    // Array de fotos por galería. Solo agrega nombres de archivo aquí
    // y coloca las imágenes en la carpeta correspondiente.
    // Las 3 primeras se muestran en la página, las demás solo en el lightbox.
    const galerias = {
      'donacion-alimentos': {
        carpeta: 'assets/img/evento-1/',
        fotos: [
          'evento-1_1.jpeg',
          'evento-1_2.jpeg',
          'evento-1_3.jpeg',
          'evento-1_4.jpeg',
          'evento-1_5.jpeg',
          'evento-1_6.jpeg',
          'evento-1_7.jpeg',
          'evento-1_8.jpeg',
          'evento-1_9.jpeg',
          'evento-1_10.jpeg',
          'evento-1_11.jpeg',
          'evento-1_12.jpeg',
          'evento-1_13.jpeg',
          'evento-1_14.jpeg',
          'evento-1_15.jpeg',
          // Agrega más fotos aquí, ejemplo:
          // 'evento-1_4.jpeg',
          // 'evento-1_5.jpeg',
        ]
      }
      // Puedes agregar más galerías aquí:
      // 'talleres-educativos': {
      //   carpeta: 'assets/img/evento-2/',
      //   fotos: ['foto1.jpeg', 'foto2.jpeg']
      // }
    };

    // Generar enlaces ocultos para fotos adicionales (a partir de la 4ta)
    Object.keys(galerias).forEach(galeriaId => {
      const galeria = galerias[galeriaId];
      const contenedorOculto = document.getElementById('galeria-oculta-' + galeriaId);
      if (!contenedorOculto) return;

      // Las primeras 3 ya están en el HTML, agregar las demás como enlaces ocultos
      galeria.fotos.slice(3).forEach((foto, index) => {
        const enlace = document.createElement('a');
        enlace.href = galeria.carpeta + foto;
        enlace.classList.add('glightbox');
        enlace.setAttribute('data-gallery', galeriaId);
        enlace.setAttribute('data-description', '');
        contenedorOculto.appendChild(enlace);
      });
    });

    // Inicializar GLightbox
    const lightbox = GLightbox({
      touchNavigation: true,
      loop: true,
      zoomable: true,
      draggable: true,
      openEffect: 'fade',
      closeEffect: 'fade',
      cssEfects: {
        fade: { in: 'fadeIn', out: 'fadeOut' }
      }
    });

    document.querySelectorAll('a.scroll-link').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  

});