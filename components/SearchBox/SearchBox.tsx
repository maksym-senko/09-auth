'use client';

import React from 'react';
import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  return (
    <div className={css.container}>
      <input
        className={css.input}
        placeholder="Search notes..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};