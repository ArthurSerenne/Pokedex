import axios from 'axios';

const API_BASE = 'https://nestjs-pokedex-api.vercel.app';

export const fetchPokemons = (params = {}) =>
  axios.get(`${API_BASE}/pokemons`, { params });

export const fetchPokemonById = (id: number) =>
  axios.get(`${API_BASE}/pokemons/${id}`);

export const fetchTypes = () =>
  axios.get(`${API_BASE}/types`);