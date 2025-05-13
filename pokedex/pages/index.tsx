import { useEffect, useState } from 'react';
import { fetchPokemons, fetchTypes, fetchPokemonById } from '../lib/api';
import Navbar from '../components/Navbar';
import TypeFilter from '../components/TypeFilter';
import PokemonCard from '../components/PokemonCard';

interface PokemonType {
  name: string;
}

interface Pokemon {
  pokedexId: number;
  name: string;
  image: string;
  types: PokemonType[];
  stats?: { name: string; value: number }[];
  apiEvolutions?: { pokedexId: number; name: string }[];
}

const Home = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [types, setTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedType, setSelectedType] = useState<number | ''>('');
  const [limit, setLimit] = useState(50);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchTypes().then(res => setTypes(res.data));
  }, []);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const params: any = { limit, name: search };
        if (selectedType) params.types = [selectedType];
        const response = await fetchPokemons(params);
        const pokemonsWithDetails = await Promise.all(
          response.data.map(async (pokemon: any) => {
            try {
              const detail = await fetchPokemonById(pokemon.pokedexId);
              return { ...pokemon, stats: detail.data.stats, apiEvolutions: detail.data.apiEvolutions };
            } catch {
              return { ...pokemon, stats: [], apiEvolutions: [] };
            }
          })
        );
        setPokemons(pokemonsWithDetails);
        setHasMore(response.data.length === limit);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };
    loadPokemons();
  }, [search, selectedType, limit]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasMore
      ) {
        setLimit((prev) => prev + 50);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return (
    <div>
      <Navbar search={search} onSearchChange={setSearch} />
      <TypeFilter types={types} selectedType={selectedType} onTypeChange={setSelectedType} />
      <main>
        <h2 className='titreHome'>Bienvenue sur le Pokédex</h2>
        <div className="pokedex-grid">
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.pokedexId} pokemon={{
              pokedexId: pokemon.pokedexId,
              name: pokemon.name,
              image: pokemon.image,
              apiTypes: pokemon.types,
              stats: pokemon.stats,
              apiEvolutions: pokemon.apiEvolutions
            }} />
          ))}
        </div>
        {hasMore && (
          <div style={{ padding: '2rem', color: '#888' }}>Chargement...</div>
        )}
      </main>
      <footer>
        <p>Pokédex</p>
      </footer>
    </div>
  );
};

export default Home;
