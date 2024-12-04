import Coordenada from "../types/Coordenada";

export default function moverPonto(pontoInicial: Coordenada, pontoFinal: Coordenada, t: number): Coordenada {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  // Converter coordenadas para radianos
  const lat1 = toRadians(pontoInicial.latitude);
  const lon1 = toRadians(pontoInicial.longitude);
  const lat2 = toRadians(pontoFinal.latitude);
  const lon2 = toRadians(pontoFinal.longitude);

  // Calcular o ângulo entre os dois pontos
  const deltaSigma = Math.acos(
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
  );

  // Se os pontos forem idênticos, retorne o ponto inicial
  if (deltaSigma === 0) {
    return new Coordenada(pontoInicial.latitude, pontoInicial.longitude);
  }

  // Calcular os coeficientes da interpolação esférica
  const a = Math.sin((1 - t) * deltaSigma) / Math.sin(deltaSigma);
  const b = Math.sin(t * deltaSigma) / Math.sin(deltaSigma);

  // Coordenadas interpoladas
  const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
  const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
  const z = a * Math.sin(lat1) + b * Math.sin(lat2);

  // Converter de volta para latitude/longitude
  const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
  const lon = Math.atan2(y, x);

  return new Coordenada(toDegrees(lat), toDegrees(lon));
}
