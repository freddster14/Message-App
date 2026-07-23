import styles from "../styles/Modal.module.css";

export default function Modal({ title, subtitle, onClose, footer, children }) {
  const stop = (e) => e.stopPropagation();

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.card} onClick={stop}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
