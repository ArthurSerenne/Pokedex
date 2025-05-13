import React from 'react';

interface Type {
  id: number;
  name: string;
}

interface TypeFilterProps {
  types: Type[];
  selectedType: number | '';
  onTypeChange: (typeId: number | '') => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ types, selectedType, onTypeChange }) => {
  return (
    <select
      value={selectedType}
      onChange={e => onTypeChange(e.target.value ? Number(e.target.value) : '')}
      style={{ borderRadius: 8, padding: '0.5rem 1rem', marginLeft: 16 }}
    >
      <option value="">Tous les types</option>
      {types.map(type => (
        <option key={type.id} value={type.id}>{type.name}</option>
      ))}
    </select>
  );
};

export default TypeFilter;
