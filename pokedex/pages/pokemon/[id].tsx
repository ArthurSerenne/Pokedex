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
    <div className="pokemon-detail-container">
      <div className="pokemon-detail-card">
        <img src={pokemon.image} alt={pokemon.name} className="pokemon-detail-img" />
        <h1 className="pokemon-detail-title">{pokemon.name}</h1>
        <div className="pokemon-detail-type-row">
          {pokemon.types && pokemon.types.length > 0 && (() => {
            const t = pokemon.types[0];
            const color = typeColors[t.name] || '#AAA';
            return (
              <span key={t.name} className="pokemon-type-badge" style={{ background: color }}>{t.name}</span>
            );
          })()}
        </div>
        <h3 className="pokemon-detail-section">Stats :</h3>
        <ul className="pokemon-detail-stats">
          {pokemon.stats.length === 0 ? (
            <li className="pokemon-detail-stat-empty">Aucune statistique trouvée pour ce Pokémon.</li>
          ) : (
            pokemon.stats.map((s) => (
              <li key={s.name} className="pokemon-detail-stat">
                <span className="stat-label">{s.name}</span>
                <div className="stat-bar-bg">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${Math.min(s.value, 100)}%`,
                      background: pokemon.types && pokemon.types.length > 0
                        ? typeColors[pokemon.types[0].name] || '#ef5350'
                        : '#ef5350',
                    }}
                  />
                </div>
                <span className="stat-value">{s.value}</span>
              </li>
            ))
          )}
        </ul>
        <h3 className="pokemon-detail-section">Évolutions :</h3>
        {pokemon.evolutions.length > 0 ? (
          <ul className="pokemon-detail-evolutions">
            {pokemon.evolutions.map((evo) => (
              <li key={evo.pokedexId || evo.name} className="pokemon-detail-evo">
                {evo.image ? (
                  <img src={evo.image} alt={evo.name} className="pokemon-detail-evo-img" />
                ) : (
                  <div className="pokemon-detail-evo-img evo-img-fallback">Pas d'image</div>
                )}
                <div>{evo.name}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="pokemon-detail-stat-empty">Pas d’évolution</p>
        )}
      </div>
      <button onClick={() => router.push('/')} className="btn-retour">Retour</button>
    </div>
  );
};

export default PokemonDetail;
