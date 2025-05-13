import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchPokemonById } from '../../lib/api';
import typeColors from '../../lib/typeColors';

interface Stat { name: string; value: number; }
interface Evolution { pokedexId: number; name: string; image?: string; }

interface Pokemon {
  name: string;
  image: string;
  stats: Stat[];
  evolutions: Evolution[];
  types?: { name: string }[];
}

const PokemonDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    if (id) {
      fetchPokemonById(Number(id))
        .then(async (res: { data: any }) => {
          const data = res.data;
          const s = data.stats ?? {};
          const stats: Stat[] = [
            { name: 'HP', value: s.HP ?? s.hp },
            { name: 'Attack', value: s.attack },
            { name: 'Defense', value: s.defense },
            { name: 'Speed', value: s.speed },
            { name: 'Special Attack', value: s.specialAttack ?? s.special_attack },
            { name: 'Special Defense', value: s.specialDefense ?? s.special_defense },
          ].filter(stat => typeof stat.value === 'number' && !isNaN(stat.value));

          const evolutions = (data.evolutions ?? []).map((evo: any) => ({
            ...evo,
            image:
              evo.image ||
              evo.sprite ||
              (evo.pokedexId
                ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.pokedexId}.png`
                : undefined),
          }));

          setPokemon({
            name: data.name,
            image: data.image,
            stats,
            evolutions,
            types: data.types,
          });
        })
        .catch((error: unknown) => console.error('Error fetching Pokémon:', error));
    }
  }, [id]);

  if (!pokemon) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 12, background: '#fff', textAlign: 'center' }}>
      <button onClick={() => router.push('/')} style={{ marginBottom: 16, background: '#ef5350', color: 'white', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer' }}>Retour</button>
      <h1 style={{ color: '#000' }}>{pokemon.name}</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
        {pokemon.types && pokemon.types.length > 0 && (() => {
          const t = pokemon.types[0];
          const color = typeColors[t.name] || '#AAA';
          return (
            <span key={t.name} style={{ background: color, color: '#fff', borderRadius: 8, padding: '2px 10px', fontWeight: 600, fontSize: 14, boxShadow: '0 1px 4px #0001' }}>{t.name}</span>
          );
        })()}
      </div>
      <img src={pokemon.image} alt={pokemon.name} style={{ width: 180, margin: '1rem auto' }} />
      <h3>Stats :</h3>
      {pokemon.stats.length === 0 ? (
        <p style={{ color: '#888' }}>Aucune statistique trouvée pour ce Pokémon.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pokemon.stats.map((s) => (
            <li key={s.name} style={{ margin: '0.3rem 0' }}>{s.name}: {s.value}</li>
          ))}
        </ul>
      )}
      <h3>Évolutions :</h3>
      {pokemon.evolutions.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {pokemon.evolutions.map((evo) => (
            <li key={evo.pokedexId || evo.name} style={{ textAlign: 'center' }}>
              {evo.image ? (
                <img src={evo.image} alt={evo.name} style={{ width: 80, height: 80, objectFit: 'contain', background: '#f6f6f6', borderRadius: 8, marginBottom: 4 }} />
              ) : (
                <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee', borderRadius: 8, marginBottom: 4, color: '#aaa', fontSize: 12 }}>
                  Pas d'image
                </div>
              )}
              <div>{evo.name}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Pas d’évolution</p>
      )}
    </div>
  );
};

export default PokemonDetail;
