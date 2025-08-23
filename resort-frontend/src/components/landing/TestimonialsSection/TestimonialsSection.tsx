import React from 'react';
import * as Fa from 'react-icons/fa';
import styles from './TestimonialsSection.module.css';

const testimonials = [
  {
    name: 'John Smith',
    location: 'New York, USA',
    comment: 'An absolutely amazing experience! The staff was incredibly attentive and the facilities were world-class.',
    rating: 5
  },
  {
    name: 'Maria Garcia',
    location: 'Madrid, Spain',
    comment: 'The perfect getaway. Beautiful rooms, excellent service, and the spa treatments were heavenly.',
    rating: 5
  },
  {
    name: 'David Chen',
    location: 'Singapore',
    comment: 'Exceeded all expectations. The ocean view suite was breathtaking and the restaurant was exceptional.',
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className={styles.testimonials}>
      <h2 className={styles.title}>Guest Experiences</h2>
      <div className={styles.grid}>
        {testimonials.map((testimonial, index) => (
          <article key={index} className={styles.testimonial}>
            <div className={styles.quoteIcon}>
              <Fa.FaQuoteRight />
            </div>
            <blockquote>
              <p className={styles.comment}>{testimonial.comment}</p>
            </blockquote>
            <div className={styles.rating}>
              {[...Array(testimonial.rating)].map((_, i) => (
                <Fa.FaStar key={i} className={styles.star} />
              ))}
            </div>
            <footer className={styles.author}>
              <p className={styles.name}>{testimonial.name}</p>
              <p className={styles.location}>{testimonial.location}</p>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}