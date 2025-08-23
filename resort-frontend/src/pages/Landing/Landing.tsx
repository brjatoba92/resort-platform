import React from 'react';
import {
  HeroSection,
  FeaturesSection,
  RoomShowcase,
  TestimonialsSection,
} from '../../components/landing';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Room Showcase */}
      <RoomShowcase />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <section className={styles.contact}>
        <div className={styles.contactContent}>
          <h2 className={styles.contactTitle}>
            Entre em Contato
          </h2>
          <p className={styles.contactSubtitle}>
            Estamos aqui para ajudar você a planejar sua estadia perfeita
          </p>
          <form className={styles.contactForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Seu nome completo"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                className={styles.input}
                placeholder="seu@email.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Mensagem</label>
              <textarea
                rows={4}
                className={styles.textarea}
                placeholder="Como podemos ajudar?"
              />
            </div>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Landing;