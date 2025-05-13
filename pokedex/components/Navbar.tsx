import React from 'react';

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ search, onSearchChange }) => {
  return (
    <nav style={{ background: '#ef5350', padding: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <h1 style={{ color: 'white', margin: 0, fontWeight: 700, fontSize: '1.7rem', letterSpacing: 2 }}>Pokédex</h1>
      <input
        type="text"
        placeholder="Rechercher un Pokémon..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        style={{
          borderRadius: '8px',
          border: 'none',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          outline: 'none',
          minWidth: '220px',
        }}
      />
    </nav>
  );
};

export default Navbar;
