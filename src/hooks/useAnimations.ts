import { useEffect, useRef, useState } from 'react';

export function useFadeIn(duration = 500, delay = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    ref,
    style: {
      opacity: isVisible ? 1 : 0,
      transition: `opacity ${duration}ms ease-in-out`,
      transitionDelay: `${delay}ms`
    }
  };
}

export function useSlideIn(direction: 'left' | 'right' | 'up' | 'down' = 'up', duration = 500, delay = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const transforms = {
    left: isVisible ? 'translateX(0)' : 'translateX(-30px)',
    right: isVisible ? 'translateX(0)' : 'translateX(30px)',
    up: isVisible ? 'translateY(0)' : 'translateY(30px)',
    down: isVisible ? 'translateY(0)' : 'translateY(-30px)'
  };

  return {
    ref,
    style: {
      opacity: isVisible ? 1 : 0,
      transform: transforms[direction],
      transition: `all ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`
    }
  };
}

export function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { ref, isHovered };
}

export function useScale(scale = 1.05, duration = 200) {
  const { ref, isHovered } = useHover();

  return {
    ref,
    style: {
      transform: isHovered ? `scale(${scale})` : 'scale(1)',
      transition: `transform ${duration}ms ease-out`
    }
  };
}

export function useRipple() {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const addRipple = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return { ripples, addRipple };
}

export function useStaggeredAnimation(count: number, delay = 100) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    for (let i = 0; i < count; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, i]));
      }, i * delay);
      timers.push(timer);
    }

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [count, delay]);

  return (index: number) => ({
    opacity: visibleItems.has(index) ? 1 : 0,
    transform: visibleItems.has(index) ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.5s ease-out'
  });
}

export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      setOffset((rect.top + scrolled) * speed);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return {
    ref,
    style: {
      transform: `translateY(${offset}px)`
    }
  };
}

export function useCountUp(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    const increment = (end - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        setCount(end);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, end, duration, isAnimating]);

  const startAnimation = () => setIsAnimating(true);
  const reset = () => {
    setCount(start);
    setIsAnimating(false);
  };

  return { count, startAnimation, reset, isAnimating };
}
