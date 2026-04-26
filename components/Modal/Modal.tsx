'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';


interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!mounted) return null;

  const modalRoot = document.getElementById('modal-root');
  
  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          className={css.closeBtn} 
          onClick={onClose} 
          type="button"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}