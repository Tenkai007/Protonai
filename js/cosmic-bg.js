/* ============================================
   Proton — Cosmic Background Engine (3D)
   ============================================ */

export function initCosmicBG() {
  const canvas = document.querySelector('.cosmic-bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let time = 0;
  let scrollY = window.scrollY;
  let lastScrollY = window.scrollY;

  // Configuration
  const STAR_COUNT = 450;
  const PARTICLE_COUNT = 90;
  const NODE_COUNT = 12;

  let stars = [];
  let particles = [];
  let nodes = [];
  let nebulae = [];

  // Parallax speeds for layers
  const speeds = {
    grid: 0.05,
    nebula: 0.12,
    nodes: 0.2,      // AI nodes (Hero only)
    particles: 0.38  // Floating dust
  };

  // Helper to get document height
  function getDocHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    ) || 3000;
  }

  // Initialize background elements
  function initElements() {
    stars = [];
    particles = [];
    nodes = [];
    nebulae = [];

    const docHeight = getDocHeight();

    // 1. Stars in 3D Space
    // x, y coordinates normalized from -0.5 to 0.5 (representing angle relative to center)
    // z coordinate representing depth from 0.1 to 2.0
    for (let i = 0; i < STAR_COUNT; i++) {
      let layer = 0; // 0 = Distant, 1 = Mid, 2 = Close
      let rand = Math.random();
      if (rand > 0.85) {
        layer = 2;
      } else if (rand > 0.5) {
        layer = 1;
      }

      let baseSize = 0.5 + Math.random() * 0.8;
      if (layer === 1) baseSize = 1.0 + Math.random() * 0.8;
      if (layer === 2) baseSize = 1.8 + Math.random() * 1.0;

      // Color tints
      let colorType = 'white';
      const colorRand = Math.random();
      if (colorRand > 0.9) {
        colorType = 'blue';   // Violet/blue stars
      } else if (colorRand > 0.8) {
        colorType = 'gold';   // Warm gold stars
      }

      stars.push({
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() * 1.9 + 0.1,
        baseSize: baseSize,
        layer: layer,
        colorType: colorType,
        opacity: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.005 + Math.random() * 0.015
      });
    }

    // 2. Cosmic Dust Particles in 3D Space
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() * 1.9 + 0.1,
        baseSize: 1.5 + Math.random() * 2.5,
        opacity: 0.05 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        colorRgb: Math.random() > 0.45 ? '139, 92, 246' : '59, 130, 246' // Purple vs Blue
      });
    }

    // 3. AI Network Nodes in Hero section (first 20% of page height)
    for (let i = 0; i < NODE_COUNT; i++) {
      let bx = 0.15 + Math.random() * 0.7;
      let by = 0.05 + Math.random() * 0.15;
      nodes.push({
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        radiusX: 0.02 + Math.random() * 0.03,
        radiusY: 0.01 + Math.random() * 0.02,
        angle: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.004,
        size: 1.5 + Math.random() * 1.5
      });
    }

    // 4. Large Nebulae (anchored to document checkpoints, dynamic morphing)
    nebulae = [
      {
        x: 0.5,
        y: 0.08, // Hero
        baseRadius: 520,
        baseOpacity: 0.05,
        color: 'hsla(260, 80%, 55%, 0.05)'
      },
      {
        x: 0.25,
        y: 0.28, // Stats/Features
        baseRadius: 580,
        baseOpacity: 0.045,
        color: 'hsla(210, 85%, 50%, 0.045)'
      },
      {
        x: 0.75,
        y: 0.52, // Workflow/Integrations
        baseRadius: 550,
        baseOpacity: 0.04,
        color: 'hsla(230, 90%, 45%, 0.04)'
      },
      {
        x: 0.35,
        y: 0.75, // Pricing/Testimonials
        baseRadius: 500,
        baseOpacity: 0.038,
        color: 'hsla(280, 85%, 55%, 0.038)'
      },
      {
        x: 0.6,
        y: 0.92, // FAQ/Footer
        baseRadius: 560,
        baseOpacity: 0.045,
        color: 'hsla(180, 80%, 45%, 0.045)'
      }
    ];
  }

  // Handle Resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    }, 150);
  });

  // Render & Update loop
  function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // Get smoothed scroll from global scroll engine, fallback to window.scrollY
    scrollY = window.smoothScrollY !== undefined ? window.smoothScrollY : window.scrollY;
    
    const docHeight = getDocHeight();
    const winHeight = window.innerHeight;
    
    // Calculate scroll delta for camera travel
    const deltaScrollY = scrollY - lastScrollY;
    lastScrollY = scrollY;
    
    time += 1;

    // 1. Draw Subtle AI Grid (Layer 6)
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.006)';
    ctx.lineWidth = 1;
    const gridOffset = (scrollY * speeds.grid) % 120;
    
    // Vertical grid lines
    for (let x = 0; x < width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    // Horizontal grid lines
    for (let y = -gridOffset; y < height; y += 120) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw Large Nebulae & Ambient Glow (Dynamic Scaling & Morphing)
    for (let i = 0; i < nebulae.length; i++) {
      const neb = nebulae[i];
      const nebDocY = neb.y * docHeight;
      const diffY = nebDocY - scrollY;
      
      // Draw if in viewport range
      if (Math.abs(diffY) < winHeight * 1.5) {
        // Parallax speed translation
        const screenY = height / 2 + diffY * speeds.nebula;
        const screenX = neb.x * width;
        
        // Scale and fade depending on proximity to center of screen
        const distRatio = diffY / winHeight;
        const scale = 1.0 - distRatio * 0.15 + Math.sin(time * 0.001 + i) * 0.05;
        const rad = neb.baseRadius * scale;
        
        const opacity = Math.max(0, neb.baseOpacity * (1 - Math.min(1, Math.abs(distRatio) / 1.4)));
        
        const grad = ctx.createRadialGradient(
          screenX, screenY, 0,
          screenX, screenY, rad
        );
        
        const colorStr = neb.color.replace('0.0', '0.').replace(/0\.\d+\)/, `${opacity})`);
        const innerColorStr = neb.color.replace('0.0', '0.').replace(/0\.\d+\)/, `${opacity * 1.5})`);
        
        grad.addColorStop(0, innerColorStr);
        grad.addColorStop(0.5, colorStr);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(screenX, screenY, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Update & Draw 3D Starfield
    // deltaZ determines forward velocity. We drift by default, and scroll modulates speed.
    let deltaZ = 0.0003 + (deltaScrollY * 0.00015);
    // Clamp to prevent wild jumps on fast wheel spinning
    deltaZ = Math.max(-0.015, Math.min(0.015, deltaZ));

    const fov = width > 768 ? 420 : 260;
    const centerX = width / 2;
    const centerY = height / 2;

    for (let star of stars) {
      // Update Z coordinate
      star.z -= deltaZ;

      // Recycle stars when they go out of bounds (too close or too far)
      if (star.z < 0.1) {
        star.z = 2.0;
        star.x = Math.random() - 0.5;
        star.y = Math.random() - 0.5;
        star.opacity = 0.2 + Math.random() * 0.8;
      } else if (star.z > 2.0) {
        star.z = 0.1;
        star.x = Math.random() - 0.5;
        star.y = Math.random() - 0.5;
        star.opacity = 0.2 + Math.random() * 0.8;
      }

      // 3D Perspective Projection
      const screenX = centerX + (star.x * width * fov) / (star.z * 100);
      const screenY = centerY + (star.y * height * fov) / (star.z * 100);

      // Only draw if visible on canvas bounds
      if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
        // Size scale based on depth
        const size = star.baseSize / star.z;

        // Soft twinkle
        let twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.phase);
        
        // Edge fading to prevent sudden pops at borders
        let edgeFade = 1.0;
        if (star.z < 0.3) {
          edgeFade = (star.z - 0.1) / 0.2;
        } else if (star.z > 1.7) {
          edgeFade = (2.0 - star.z) / 0.3;
        }

        const finalOpacity = star.opacity * twinkle * edgeFade;

        // Choose color
        let color = `rgba(255, 255, 255, ${finalOpacity})`;
        if (star.colorType === 'blue') {
          color = `rgba(165, 180, 252, ${finalOpacity})`;
        } else if (star.colorType === 'gold') {
          color = `rgba(253, 224, 71, ${finalOpacity})`;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point flare on bright stars (proportionately scaled)
        if (star.layer >= 1 && size > 1.4 && finalOpacity > 0.45) {
          const flareSize = size * 2.8;
          ctx.strokeStyle = `rgba(255, 255, 255, ${finalOpacity * 0.45})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(screenX - flareSize, screenY);
          ctx.lineTo(screenX + flareSize, screenY);
          ctx.moveTo(screenX, screenY - flareSize);
          ctx.lineTo(screenX, screenY + flareSize);
          ctx.stroke();
        }
      }
    }

    // 4. Update & Draw AI Nodes (in Hero section background)
    // AI Nodes connect with lines in the Hero area and move parallax
    const activeNodes = [];
    for (let node of nodes) {
      node.angle += node.speed;
      const orbitX = node.baseX + Math.cos(node.angle) * node.radiusX;
      const orbitY = node.baseY + Math.sin(node.angle) * node.radiusY;
      
      const nodeDocY = orbitY * docHeight;
      const screenY = nodeDocY - scrollY * speeds.nodes;
      const screenX = orbitX * width;

      if (screenY > -50 && screenY < height + 50) {
        activeNodes.push({ x: screenX, y: screenY, size: node.size });
      }
    }

    // Node lines
    ctx.lineWidth = 0.75;
    for (let i = 0; i < activeNodes.length; i++) {
      for (let j = i + 1; j < activeNodes.length; j++) {
        const n1 = activeNodes[i];
        const n2 = activeNodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const lineAlpha = 0.05 * (1 - dist / 180);
          ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }

    // Node dots
    for (let node of activeNodes) {
      const pulse = 0.75 + 0.25 * Math.sin(time * 0.025 + node.x);
      ctx.fillStyle = `rgba(139, 92, 246, ${0.45 * pulse})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 255, 255, 0.85)`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Update & Draw 3D Cosmic Dust Particles (Layer 5)
    for (let p of particles) {
      p.z -= deltaZ;

      if (p.z < 0.1) {
        p.z = 2.0;
        p.x = Math.random() - 0.5;
        p.y = Math.random() - 0.5;
      } else if (p.z > 2.0) {
        p.z = 0.1;
        p.x = Math.random() - 0.5;
        p.y = Math.random() - 0.5;
      }

      const screenX = centerX + (p.x * width * fov) / (p.z * 100);
      const screenY = centerY + (p.y * height * fov) / (p.z * 100);

      if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
        const size = (p.baseSize / p.z) * 2.5;
        
        let edgeFade = 1.0;
        if (p.z < 0.3) {
          edgeFade = (p.z - 0.1) / 0.2;
        } else if (p.z > 1.7) {
          edgeFade = (2.0 - p.z) / 0.3;
        }

        const opacity = p.opacity * (0.6 + 0.4 * Math.sin(time * 0.012 + p.phase)) * edgeFade;

        const grad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size);
        grad.addColorStop(0, `rgba(${p.colorRgb}, ${opacity})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  // Run
  initElements();
  requestAnimationFrame(draw);
}
