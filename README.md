# ✈️ Simulador de Rotas Aéreas no Território Brasileiro

### 🔗 Veja o projeto rodando: https://front-maps.vercel.app/

Este projeto gera dois pontos geográficos aleatórios dentro do território brasileiro e simula uma rota aérea entre eles, levando em consideração a curvatura da Terra para calcular um trajeto realista. A aplicação integra a API do IBGE para identificar os estados atravessados pela aeronave e utiliza um backend próprio para fornecer coordenadas e informações geográficas detalhadas.

A aplicação é dividida nas seguintes partes:

- Renderização interativa do mapa
- Geração, armazenamento e manipulação de coordenadas
- Comunicação com o backend para dados geográficos
- Cálculo preciso de posições usando esferometria (curvatura terrestre)
- Estilização utilizando CSS Modules

## 🗺️ Renderização do Mapa

A renderização do mapa é feita utilizando a biblioteca Leaflet, possibilitando zoom, rotação, interatividade e marcação de pontos.

```tsx
<MapContainer
    center={currentCoord.toArray()}
    zoom={6}
    className={css.map}
>
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        errorTileUrl="https://upload.wikimedia.org/wikipedia/commons/e/e0/Error.svg"
    />
    <Marker position={initialCoord.toArray()} icon={Icons.startIcon} />
    <Marker position={finalCoord.toArray()} icon={Icons.endIcon} />
    <Marker position={currentCoord.toArray()} icon={isIlhabela ? Icons.boomIcon : Icons.airplaneIcon} />  
    <LocationClicked />  {/* Função para captar o clique do usuário */}
    <Menu
        moveOn={moveOn}
        info={{
            currentCoord: currentCoord
        }}
    />
</MapContainer>
```

> [!NOTE]
> O contexto completo dessa parte está disponível no arquivo [`src/pages/maps.tsx`](https://github.com/felipe-sant/FRONT-Maps/blob/main/src/pages/maps.tsx).

## 📍 Marcações no Mapa

O sistema exibe três pontos principais:

- Ponto inicial
- Ponto final
- Posição atual da aeronave

Os pontos inicial e final são obtidos através do backend, que retorna coordenadas válidas dentro do território nacional. O ponto atual é atualizado em tempo real durante a simulação.

```ts
public static async getRandomCoord(state?: BrazilianStates): Promise<CoordinateClass | undefined> {
    try {
        const query = {state: state}
        const response = await get(BackendConnection.routes.coord_random, query)
        const coord = new CoordinateClass(response)
        return coord
    } catch (error) {
        console.log(error)
    }
}
```

A função retorna uma classe chamada `CoordinateClass`, que possui dentro atributos de latitude e longitude.

```ts
class CoordinateClass {
    public latitude: number;
    public longitude: number;

    constructor(coordinateType: CoordinateType) {
        this.latitude = coordinateType.latitude;
        this.longitude = coordinateType.longitude;
    }

    public toArray(): [latidute: number, longitude: number] {
        return [this.latitude, this.longitude];
    }
}
```

## 📋 Menu Lateral

No canto inferior direito há um menu que permite:

- Inserir coordenadas manualmente (digitando ou clicando no mapa)
- Iniciar a simulação da rota com o botão "Viajar!"
- Alternar a interface para visualizar informações detalhadas da posição atual durante o voo

## 📐 Cálculo de Posição com Curvatura Terrestre

Os cálculos de deslocamento não são feitos em plano cartesiano, pois o objetivo do projeto é representar trajetos reais na superfície esférica do planeta.

Para isso, é utilizada uma função baseada em interpolação esférica (Slerp), que determina a posição intermediária ao longo da menor rota entre duas coordenadas (arco do círculo máximo).

```ts
function positionBetweenRadianPoints(start: CoordinateClass, end: CoordinateClass, time: number): CoordinateClass {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const toDegrees = (rad: number) => (rad * 180) / Math.PI;

    const lat1 = toRadians(start.latitude);
    const lon1 = toRadians(start.longitude);
    const lat2 = toRadians(end.latitude);
    const lon2 = toRadians(end.longitude);

    const deltaSigma = Math.acos(
        Math.sin(lat1) * Math.sin(lat2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
    );

    if (deltaSigma === 0) {
        return new CoordinateClass({latitude: start.latitude, longitude: start.longitude});
    }

    const a = Math.sin((1 - time) * deltaSigma) / Math.sin(deltaSigma);
    const b = Math.sin(time * deltaSigma) / Math.sin(deltaSigma);

    const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
    const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);

    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);

    return new CoordinateClass({latitude: toDegrees(lat), longitude: toDegrees(lon)});
}
```

Essa função recebe:

- Ponto inicial
- Ponto final
- Um valor entre 0 e 1 representando o progresso do voo

E retorna a coordenada exata correspondente naquele ponto da rota, considerando a curvatura terrestre.

## 🌍 Informações Geográficas da Localização Atual

A cada atualização de posição, o frontend solicita ao backend os seguintes dados sobre o ponto atual:

- País
- Estado
- Município
- Microregião
- Mesorregião

Essas informações são retornadas em um objeto `Locality` e exibidas ao usuário no painel lateral durante o voo.

```ts
type Locality = {
    country: string;
    state?: string;
    municipality?: string;
    microregion?: string;
    mesoregion?: string;
};
```

<div align="center">
developed by <a href="https://github.com/felipe-sant?tab=followers">@felipe-sant</a>
</div>
