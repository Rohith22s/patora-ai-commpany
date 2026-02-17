(function () {
  // Elements to animate
  var observeElements = document.querySelectorAll('.reveal-up, .stagger-parent');

  // Progress Bar
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar); // Add to body

  // Scroll Progress and Parallax Logic
  window.addEventListener('scroll', function () {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";

    // Header transformation
    var header = document.querySelector('.site-header');
    if (header) {
      if (winScroll > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    // Simple Parallax for hero shapes
    var shapes = document.querySelectorAll('[data-speed]');
    shapes.forEach(function (shape) {
      var speed = parseFloat(shape.getAttribute('data-speed'));
      var yPos = winScroll * speed;
      shape.style.transform = 'translateY(' + yPos + 'px)';
    });
  });

  // Intersection Observer for Animations
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target); // Run once
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    observeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback
    observeElements.forEach(function (el) {
      el.classList.add('in');
    });
  }
  // Theme Toggle removed

  // Asteroid Field Animation
  var canvas = document.getElementById('hero-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var asteroids = [];
    var asteroidCount = 15;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Asteroid {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 20 + 10;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.vertices = [];
        this.vertexCount = Math.floor(Math.random() * 5) + 7;

        // Generate irregular shape
        for (let i = 0; i < this.vertexCount; i++) {
          var a = (i / this.vertexCount) * Math.PI * 2;
          var r = this.radius + (Math.random() - 0.5) * (this.radius * 0.4);
          this.vertices.push({
            x: Math.cos(a) * r,
            y: Math.sin(a) * r
          });
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.rotationSpeed;

        // Wrap around screen
        if (this.x < -100) this.x = canvas.width + 100;
        if (this.x > canvas.width + 100) this.x = -100;
        if (this.y < -100) this.y = canvas.height + 100;
        if (this.y > canvas.height + 100) this.y = -100;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
          ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();

        ctx.strokeStyle = 'rgba(100, 255, 218, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = 'rgba(17, 34, 64, 0.5)';
        ctx.fill();

        ctx.restore();
      }
    }

    function init() {
      asteroids = [];
      for (let i = 0; i < asteroidCount; i++) {
        asteroids.push(new Asteroid());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      asteroids.forEach(asteroid => {
        asteroid.update();
        asteroid.draw();
      });

      requestAnimationFrame(animate);
    }

    init();
    animate();
  }
})();
