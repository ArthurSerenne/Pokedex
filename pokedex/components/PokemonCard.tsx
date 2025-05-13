import Link from 'next/link';
import typeColors from '../lib/typeColors';

interface Props {
  pokemon: {
    pokedexId: number;
    name: string;
    image: string;
    apiTypes: { name: string }[];
  };
}

const PokemonCard = ({ pokemon }: Props) => (
  <Link href={`/pokemon/${pokemon.pokedexId}`} style={{ textDecoration: 'none' }}>
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: 12,
        padding: 16,
        textAlign: 'center',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer',
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="pokemon-card"
    >
      <img src={pokemon.image} alt={pokemon.name} style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: 8 }} />
      <h3 style={{ margin: '0.5rem 0', color: '#000', fontWeight: 700 }}>{pokemon.name}</h3>
      <div style={{ marginTop: 4, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        {pokemon.apiTypes[0] && (
          <span
            key={pokemon.apiTypes[0].name}
            style={{
              background: typeColors[pokemon.apiTypes[0].name] || '#ef5350',
              color: 'white',
              borderRadius: 12,
              padding: '0.2rem 0.7rem',
              fontSize: '0.85rem',
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            {pokemon.apiTypes[0].name}
          </span>
        )}
      </div>
    </div>
  </Link>
);

export default PokemonCard;
