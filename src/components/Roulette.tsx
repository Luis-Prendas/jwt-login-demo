import { useState, useRef } from 'react';

const coloresSuaves = [
  "#f87b8c", "#ffb366", "#ffe066", "#7ee6c8", "#7ecbff",
  "#6fa8ff", "#a68cff", "#ffb3c6", "#ffd6a5", "#b7e4c7"
];

interface ElementoRuleta {
  text: string;
  color: string;
}

function generarColorAleatorio(coloresExistentes: string[]): string {
  for (let i = 0; i < 24; i++) {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 18) + 72;
    const l = Math.floor(Math.random() * 16) + 60;
    const color = `hsl(${h},${s}%,${l}%)`;
    if (!coloresExistentes.includes(color)) return color;
  }
  return `hsl(${Math.floor(Math.random()*360)},78%,68%)`;
}

const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5);

const formatearFecha = (date: Date): string => {
  const pad = (n: number) => n < 10 ? '0' + n : n;
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const Ruleta = () => {
  const [elementos, setElementos] = useState<ElementoRuleta[]>(
    coloresSuaves.slice(0, 9).map(color => ({ text: '', color }))
  );
  const [rotacionActual, setRotacionActual] = useState(0);
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState('');
  const [nuevoTexto, setNuevoTexto] = useState('');
  const [historial, setHistorial] = useState<{ text: string, date: Date }[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [ascendente, setAscendente] = useState(true);

  const refRuleta = useRef<SVGSVGElement>(null);

  const agregarElemento = () => {
    if (!nuevoTexto.trim()) return;
    const color = generarColorAleatorio(elementos.map(e => e.color));
    setElementos([...elementos, { text: nuevoTexto.trim(), color }]);
    setNuevoTexto('');
    setResultado('');
  };

  const girar = () => {
    if (girando || elementos.length === 0) return;
    setGirando(true);
    setResultado('');

    const cantidad = elementos.length;
    const gradosPorElemento = 360 / cantidad;
    const vueltas = Math.floor(Math.random() * 2) + 6;
    const offset = Math.random() * 360;
    const gradosFinal = vueltas * 360 + offset;

    const duracion = 4200;
    const inicio = performance.now();
    const rotacionInicial = rotacionActual % 360;
    const cambioTotal = gradosFinal - rotacionInicial;

    const animar = (ahora: number) => {
      const transcurrido = ahora - inicio;
      const progreso = Math.min(transcurrido / duracion, 1);
      const suavizado = easeOutQuint(progreso);
      const angulo = rotacionInicial + cambioTotal * suavizado;
      if (refRuleta.current) {
        refRuleta.current.style.transform = `rotate(${angulo}deg)`;
      }
      if (progreso < 1) {
        requestAnimationFrame(animar);
      } else {
        const anguloFinal = offset % 360;
        const gradoPuntero = (360 - anguloFinal + 360) % 360;
        const indice = Math.floor(gradoPuntero / gradosPorElemento) % cantidad;
        const textoSeleccionado = elementos[indice].text;
        setRotacionActual(anguloFinal);
        setResultado(textoSeleccionado);
        setHistorial(h => [...h.slice(-49), { text: textoSeleccionado, date: new Date() }]);

        // Eliminar automáticamente el elemento seleccionado
        setElementos(prev => prev.filter((_, i) => i !== indice));

        setGirando(false);
      }
    };

    requestAnimationFrame(animar);
  };

  const cambiarTexto = (idx: number, valor: string) => {
    const copia = [...elementos];
    copia[idx].text = valor;
    setElementos(copia);
    setResultado('');
  };

  const eliminarElemento = (idx: number) => {
    const nuevos = elementos.filter((_, i) => i !== idx);
    setElementos(nuevos);
    setResultado('');
  };

  return (
    <div className="flex flex-col items-center gap-10 p-6 w-full max-w-screen-md mx-auto text-white">
      <div className="bg-gray-800 rounded-2xl p-6 w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Ruleta</h2>
        <div className="relative w-80 h-80 mb-4">
          <div className="absolute w-full h-full rounded-full bg-gray-700 shadow-inner"></div>
          <svg className="absolute z-10" ref={refRuleta} width="320" height="320" viewBox="0 0 320 320">
            {elementos.map((item, i) => {
              const cx = 160, cy = 160, r = 140;
              const angIni = (2 * Math.PI * i) / elementos.length - Math.PI / 2;
              const angFin = (2 * Math.PI * (i + 1)) / elementos.length - Math.PI / 2;
              const x1 = cx + r * Math.cos(angIni);
              const y1 = cy + r * Math.sin(angIni);
              const x2 = cx + r * Math.cos(angFin);
              const y2 = cy + r * Math.sin(angFin);
              const arco = ((angFin - angIni + 2 * Math.PI) % (2 * Math.PI)) > Math.PI ? 1 : 0;
              const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${arco} 1 ${x2} ${y2} Z`;
              const angText = (angIni + angFin) / 2;
              const tx = cx + r * 0.65 * Math.cos(angText);
              const ty = cy + r * 0.65 * Math.sin(angText);
              return (
                <g key={i}>
                  <path d={d} fill={item.color} stroke="#000" strokeWidth="0.6" />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#000"
                    fontSize={13}
                    fontWeight="bold"
                  >
                    {item.text}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 z-20">
            <svg width="44" height="36" viewBox="0 0 44 36">
              <polygon points="0,0 44,0 22,36" fill="#fff" />
            </svg>
          </div>
        </div>
        <button onClick={girar} className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl shadow hover:scale-105 transition">Girar ruleta</button>
        {resultado && <div className="text-green-400 text-lg font-bold mt-4">Resultado: {resultado}</div>}
        <button onClick={() => setMostrarModal(true)} className="mt-2 text-cyan-300 underline">Ver historial</button>
      </div>
      <div className="bg-gray-800 rounded-2xl p-6 w-full">
        <h2 className="text-xl font-bold mb-4">Editar elementos</h2>
        <div className="flex flex-col gap-2">
          {elementos.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item.text}
                onChange={e => cambiarTexto(idx, e.target.value)}
                className="flex-1 px-3 py-2 rounded border bg-gray-700 border-gray-600 text-white"
              />
              <button onClick={() => eliminarElemento(idx)} className="w-8 h-8 bg-red-600 text-white rounded-full hover:scale-110 transition">−</button>
            </div>
          ))}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              value={nuevoTexto}
              onChange={e => setNuevoTexto(e.target.value)}
              placeholder="Nuevo elemento"
              className="flex-1 px-3 py-2 border rounded bg-gray-700 border-gray-600 text-white"
            />
            <button onClick={agregarElemento} className="w-10 h-10 bg-cyan-600 text-white text-xl rounded-full hover:rotate-90 hover:scale-110 transition">+</button>
          </div>
        </div>
      </div>
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-2xl w-80 max-h-[80vh] overflow-y-auto relative">
            <button onClick={() => setMostrarModal(false)} className="absolute top-2 right-3 text-xl text-gray-300">×</button>
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Historial de resultados</h3>
            <div className="flex gap-2 mb-3">
              <button className={`px-3 py-1 rounded ${ascendente ? 'bg-cyan-500 text-white' : 'bg-gray-600'}`} onClick={() => setAscendente(true)}>Ascendente</button>
              <button className={`px-3 py-1 rounded ${!ascendente ? 'bg-cyan-500 text-white' : 'bg-gray-600'}`} onClick={() => setAscendente(false)}>Descendente</button>
            </div>
            <ol className="list-decimal pl-5 text-sm">
              {(ascendente ? historial : [...historial].reverse()).map((h, i) => (
                <li key={i} className="mb-2">
                  {h.text}
                  <div className="text-xs text-gray-400">{formatearFecha(h.date)}</div>
                </li>
              ))}
              {historial.length === 0 && <li>No hay historial aún.</li>}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ruleta;
