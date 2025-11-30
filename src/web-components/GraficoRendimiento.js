class GraficoRendimiento extends HTMLElement {
    constructor() {
        super();
        // Variables de estado
        this.graficoPrincipal = null;
        this.serieArea = null;
        this.graficoMini = null;
        this.serieMini = null;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        // 1. ESTRUCTURA Y ESTILOS
        // IMPORTANTE: Aquí definimos alturas fijas (300px y 60px) para asegurar que se vea.
        shadow.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            background: linear-gradient(180deg, #162c46 0%, #0f1f33 100%);
                            border-radius: 8px;
                            padding: 20px;
                            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                            font-family: sans-serif;
                        }

                        /* Header con textos */
                        .cabecera { margin-bottom: 20px; }
                        h2 { margin: 0 0 5px 0; font-size: 14px; color: #64748b; font-weight: normal; }
                        .info-texto { font-size: 18px; font-weight: bold; color: #f1f5f9; }

                        /* Contenedor del gráfico principal */
                        #zona-grafico-principal {
                            width: 100%;
                            height: 300px; /* <--- ALTURA FIJA OBLIGATORIA */
                            position: relative;
                        }

                        /* Contenedor de la barra inferior (mini mapa) */
                        #zona-barra-seleccion {
                            width: 100%;
                            height: 60px; /* <--- ALTURA FIJA */
                            margin-top: 15px;
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 4px;
                            position: relative;
                            overflow: hidden;
                            border-left: 4px solid white;  /* Simulamos los bordes del slider */
                            border-right: 4px solid white;
                        }
                    </style>

                    <div class="cabecera">
                        <h2>Rendimiento de carga</h2>
                        <div class="info-texto">Min 3 kbps • Max 150 Kbps • Último 4 Kbps</div>
                    </div>

                    <div id="zona-grafico-principal"></div>
                    <div id="zona-barra-seleccion"></div>
                `;

        // 2. INICIALIZAR GRÁFICOS
        // Usamos requestAnimationFrame para asegurar que el HTML ya existe en pantalla
        requestAnimationFrame(() => {
            this.iniciarGraficos(
                shadow.getElementById('zona-grafico-principal'),
                shadow.getElementById('zona-barra-seleccion')
            );
        });
    }

    iniciarGraficos(divPrincipal, divMini) {
        // --- CONFIGURACIÓN COMÚN EN ESPAÑOL ---
        const colorLinea = '#22d3ee'; // Azul cyan neon
        const fondoTransparente = 'rgba(0,0,0,0)';

        // 1. Crear Gráfico Principal (Arriba)
        this.graficoPrincipal = LightweightCharts.createChart(divPrincipal, {
            width: divPrincipal.clientWidth,
            height: 300, // Forzamos altura coincidente con CSS
            layout: {
                background: { color: fondoTransparente },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { color: 'rgba(255,255,255,0.05)' }
            },
            rightPriceScale: { visible: false }, // Ocultar escala derecha
            leftPriceScale: { visible: true, borderVisible: false }, // Mostrar escala izquierda
            timeScale: { borderVisible: false, timeVisible: true }
        });

        // Crear Serie de Área (Efecto degradado)
        this.serieArea = this.graficoPrincipal.addAreaSeries({
            topColor: 'rgba(34, 211, 238, 0.5)',   // Color fuerte arriba
            bottomColor: 'rgba(34, 211, 238, 0.0)', // Transparente abajo
            lineColor: colorLinea,
            lineWidth: 3
        });

        // 2. Crear Gráfico Mini (Abajo / Barra)
        this.graficoMini = LightweightCharts.createChart(divMini, {
            width: divMini.clientWidth,
            height: 60,
            layout: { background: { color: fondoTransparente } },
            grid: { vertLines: { visible: false }, horzLines: { visible: false } },
            rightPriceScale: { visible: false },
            leftPriceScale: { visible: false },
            timeScale: { visible: false },
            handleScale: { scroll: false, scale: false } // Bloqueado, no se mueve
        });

        this.serieMini = this.graficoMini.addAreaSeries({
            topColor: 'rgba(255, 255, 255, 0.2)',
            bottomColor: 'rgba(255, 255, 255, 0.0)',
            lineColor: 'transparent',
            lineWidth: 0
        });

        // 3. CARGAR DATOS DE EJEMPLO
        this.cargarDatosDemo();

        // 4. RESPONSIVIDAD (Si cambias el tamaño de la ventana)
        window.addEventListener('resize', () => {
            this.graficoPrincipal.applyOptions({ width: divPrincipal.clientWidth });
            this.graficoMini.applyOptions({ width: divMini.clientWidth });
        });
    }

    cargarDatosDemo() {
        // Generamos datos matemáticos para que se vea una curva bonita
        const datos = [];
        let fechaBase = new Date(2023, 0, 1).getTime() / 1000; // Timestamp UNIX
        let valor = 50;

        for (let i = 0; i < 200; i++) {
            // Random walk simple
            valor = valor + (Math.random() - 0.5) * 10;
            if (valor < 10) valor = 10;

            datos.push({ time: fechaBase + (i * 300), value: valor });
        }

        // Asignamos los datos a ambas series
        this.serieArea.setData(datos);
        this.serieMini.setData(datos);

        // Ajustar la vista para que entren todos los datos
        this.graficoPrincipal.timeScale().fitContent();
        this.graficoMini.timeScale().fitContent();
    }
}

customElements.define('grafico-rendimiento', GraficoRendimiento);