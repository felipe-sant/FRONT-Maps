### [Veja o projeto rodando aqui.](https://front-maps.vercel.app/)

Site que gera dois pontos geográficos aleatórios dentro do território brasileiro e simula uma rota de voo entre eles, considerando com precisão a curvatura da Terra. O sistema integra a API do IBGE para gerenciar as coordenadas geográficas e identificar os estados brasileiros atravessados pela aeronave durante a simulação.

O projeto é divido com varias partes, envolvendo a **renderização do mapa**, **calculo de distancia e posição** de pontos entre coordenadas, utilização de uma **API interna** para comunicação com o backend da aplicação e utilização de **css modules**.

## Renderização do Mapa

Para renderizar o mapa foi utilizado a biblioteca **Leaflet** pelo seguinte conjunto de código:

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
> O contexto inteiro do código está disponivel no arquivo de [renderização de mapa](https://github.com/felipe-sant/FRONT-Maps/blob/main/src/pages/maps.tsx).

## Marcações

Há 3 pontos de destaque no mapa, o ponto inicial, ponto final e o ponto de localização atual (representado pelo aviãozinho). Os pontos inicial e final são gerados aleatóriamente escolhendo coordenadas dentro do território brasileiro, utilizando o microserviço criado como backend da aplicação, segue a função utilizada pra isso abaixo:

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

Esta função tem a entrada opcional de um estado brasileiro, caso essa entrada seja nula, ele utilizara o contexto do brasil inteiro. No retorno da função, caso de algum erro ele retonara `undefined`, caso contrario é retornado um objeto `CoordinateClass`, uma classe para guardar latitude e longitude.

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

## Menu Lateral

No canto inferior direito, há um menu com a alternativa do usuário inserir as coordenadas iniciais e finais manualmente, seja digitando ou selecionando com o mouse. Também a o botão "Viajar!", ele tem a função de iniciar a viagem do ponto inicial até o ponto final, alternando o menu para um de visualização de informações sobre o ponto atual.

## Calculo de distancia entre pontos

Para trabalhar com o mapa mundi, não é possivel utilizar calculos utilizados no plano cartesiano, pois é necessario levar em consideração a curvatura terrestre, foi utilizado a seguinte função para calcular a posição do ponto atual:

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

A função recebe como entrada o ponto inicial como um `CoordinateClass`, ponto final como um `CoordinateClass` e o tempo como um `number` sendo um número de 0 a 1. A função retorna uma coordenada dependendo do tempo, então do ponto 1, para o ponto 2 com o tempo 0.5, é retornado a coordenada correspondente a metade do caminho entre o primeiro e o segundo ponto, levando em consideração a curvatura da terra.

## Informações sobre a localização atual

A cada tick de movimentação do ponto, é requisitado ao backend a informação sobre aquele ponto, mostrando informações de estado, município, microregião e macroregião. É utilizado a seguinte função de conexão:

```ts
public static async getLocation(coord: CoordinateClass): Promise<Locality | undefined> {
    try {
        const query = {
            lat: coord.latitude,
            lon: coord.longitude
        }
        const response = await get(BackendConnection.routes.coord_location, query)
        if (!response) return undefined
        
        const locality: Locality = {
            country: response.country,
            state: response.state,
            municipality: response.municipality,
            microregion: response.microregion,
            mesoregion: response.mesoregion
        }
        return locality
    } catch (error) {
        console.log(error)
        return undefined
    }
}
```

A função entre com a classe de coordenada e retorna um objeto do tipo de `locality`.

```ts
type Locality = {
    country: string;
    state?: string;
    municipality?: string;
    microregion?: string;
    mesoregion?: string;
};
```

<hr>

<div align="center">
    developed by <a href="https://github.com/felipe-sant?tab=followers">@felipe-sant</a>
</div>
