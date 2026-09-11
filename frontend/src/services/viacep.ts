import axios from "axios";

const viaCepClient = axios.create({
  baseURL: "https://viacep.com.br/ws",
});

export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchAddressByCep(cep: string, signal?: AbortSignal): Promise<ViaCepAddress | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  const { data } = await viaCepClient.get<ViaCepAddress>(`/${digits}/json/`, { signal });
  if (data.erro) return null;
  return data;
}
