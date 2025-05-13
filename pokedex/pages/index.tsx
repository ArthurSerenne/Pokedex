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

  useEffect(() => {
    fetchTypes().then(res => setTypes(res.data));
  }, []);

  useEffect(() => {
    const loadPokemons = async () => {
      try {
        const params: any = { limit: 50, name: search };
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
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
    };
    loadPokemons();
  }, [search, selectedType]);

  return (
    <div>
      <Navbar search={search} onSearchChange={setSearch} />
      <TypeFilter types={types} selectedType={selectedType} onTypeChange={setSelectedType} />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>Bienvenue sur le Pokédex</h2>
        <p>Explorez les Pokémon et découvrez leurs détails.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
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
      </main>
      <footer style={{ padding: '1rem', backgroundColor: 'black', color: 'white', textAlign: 'center' }}>
        <p>© 2025 Pokédex</p>
      </footer>
    </div>
  );
};

export default Home;
