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
  <Link href={`/pokemon/${pokemon.pokedexId}`} className="no-underline">
    <div className="pokemon-card">
      <img src={pokemon.image} alt={pokemon.name} />
      <h3 style={{ margin: '0.5rem 0', color: '#000', fontWeight: 700 }}>{pokemon.name}</h3>
      <div>
        {pokemon.apiTypes[0] && (
          <span
            key={pokemon.apiTypes[0].name}
            className="pokemon-type-badge"
            style={{ background: typeColors[pokemon.apiTypes[0].name] || '#000' }}
          >
            {pokemon.apiTypes[0].name}
          </span>
        )}
      </div>
    </div>
  </Link>
);

export default PokemonCard;
