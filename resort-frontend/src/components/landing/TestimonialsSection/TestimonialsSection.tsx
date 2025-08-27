import React, { useState, useEffect } from 'react';
import styles from './TestimonialsSection.module.css';

interface Testimonial {
  id: string;
  author: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
  autoplayInterval?: number;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title,
  subtitle,
  testimonials,
  autoplayInterval = 5000
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isAutoplay, testimonials.length, autoplayInterval]);

  const handleTestimonialClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoplay(false);
  };

  const handleNext = () => {
    setActiveIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
    setIsAutoplay(false);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    setIsAutoplay(false);
  };

  return (
    <section className={styles.testimonials}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.carousel}>
        <button
          className={`${styles.control} ${styles.prev}`}
          onClick={handlePrev}
          aria-label="Previous testimonial"
        >
          ←
        </button>

        <div className={styles.content}>
          <div className={styles.avatar}>
            <img
              src={testimonials[activeIndex].avatar}
              alt={testimonials[activeIndex].author}
            />
          </div>

          <div className={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`${styles.star} ${
                  index < testimonials[activeIndex].rating ? styles.filled : ''
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <blockquote className={styles.quote}>
            {testimonials[activeIndex].content}
          </blockquote>

          <div className={styles.author}>
            <strong>{testimonials[activeIndex].author}</strong>
            <span>{testimonials[activeIndex].role}</span>
          </div>
        </div>

        <button
          className={`${styles.control} ${styles.next}`}
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>

      <div className={styles.indicators}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === activeIndex ? styles.active : ''
            }`}
            onClick={() => handleTestimonialClick(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
