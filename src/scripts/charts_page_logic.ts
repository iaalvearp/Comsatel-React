// Interfaces
interface MonthData {
    nombre: string;
    dias: number;
    etiqueta: string;
}

interface ChartDataPoint {
    time: number;
    value: number;
    isLabel?: boolean;
    x?: number;
    y?: number;
}

interface ChartConfig {
    totalMinutes: number;
    labelStepMinutes: number;
    windowDefaultPct: number;
}

interface ChartState {
    isDragging: boolean;
    isResizingLeft: boolean;
    isResizingRight: boolean;
    startX: number;
    startLeft: number;
    startWidth: number;
    trackWidth: number;
    windowLeftPct: number;
    windowWidthPct: number;
    minWidthPct: number;
    maxWidthPct: number;
}

// Global Logic
// Graficos de consumo
// Estructura de datos de meses con días correctos
const MESES_DATA: Record<string, MonthData> = {
    abr: { nombre: "ABR", dias: 30, etiqueta: "Abril" },
    may: { nombre: "MAY", dias: 31, etiqueta: "Mayo" },
    jun: { nombre: "JUN", dias: 30, etiqueta: "Junio" },
    jul: { nombre: "JUL", dias: 31, etiqueta: "Julio" },
    ago: { nombre: "AGO", dias: 31, etiqueta: "Agosto" },
    sep: { nombre: "SEP", dias: 30, etiqueta: "Septiembre" },
    "oct-nov": { nombre: "OCT", dias: 31, etiqueta: "Octubre" },
};

// Datos de ejemplo de consumo (GB)
const CONSUMO_EJEMPLO: Record<string, number[]> = {
    "oct-nov": [
        0.1, 0.2, 0.4, 0.3, 0.5, 0.2, 0.1, 0.3, 0.4, 0.6, 0.2, 0.3, 0.5, 0.4, 0.3,
        0.2, 0.4, 0.5, 0.3, 0.2, 0.1, 0.3, 0.4, 0.2, 0.5, 0.3, 0.2, 0.4, 0.3, 0.2,
        0.1,
    ],
    abr: Array(30)
        .fill(0)
        .map(() => Math.random() * 0.5),
    may: Array(31)
        .fill(0)
        .map(() => Math.random() * 0.5),
    jun: Array(30)
        .fill(0)
        .map(() => Math.random() * 0.5),
    jul: Array(31)
        .fill(0)
        .map(() => Math.random() * 0.5),
    ago: Array(31)
        .fill(0)
        .map(() => Math.random() * 0.5),
    sep: Array(30)
        .fill(0)
        .map(() => Math.random() * 0.5),
};

let mesActual = "oct-nov";

// Inicializar el gráfico cuando la página cargue
document.addEventListener("DOMContentLoaded", function () {
    inicializarGrafico();
    initAccordions();
});

function inicializarGrafico() {
    // Configurar event listeners para los botones de meses
    document.querySelectorAll(".btn-mes").forEach((btn) => {
        btn.addEventListener("click", function (this: HTMLElement) {
            const mes = this.getAttribute("data-mes");
            if (mes) seleccionarMes(mes);
        });
    });

    // Generar el gráfico inicial (OCT-NOV)
    generarBarras(mesActual);
}

function seleccionarMes(mes: string) {
    // Actualizar estado visual de botones
    document.querySelectorAll(".btn-mes").forEach((btn) => {
        btn.classList.remove("active");
    });
    const btn = document.getElementById(`btn-mes-${mes}`);
    if (btn) btn.classList.add("active");

    // Actualizar mes actual
    mesActual = mes;

    // Regenerar barras
    generarBarras(mes);
}

function generarBarras(mes: string) {
    const mesInfo = MESES_DATA[mes];
    if (!mesInfo) return;
    const dias = mesInfo.dias;
    const consumoDatos = CONSUMO_EJEMPLO[mes] || [];
    const maxConsumo = 10; // 10 GB es el máximo en la escala

    const contenedorBarras = document.getElementById("barras-consumo");
    const contenedorEtiquetas = document.getElementById("etiquetas-dias");

    if (!contenedorBarras || !contenedorEtiquetas) return;

    // Limpiar contenido anterior
    contenedorBarras.innerHTML = "";
    contenedorEtiquetas.innerHTML = "";

    // Generar barras para cada día
    for (let dia = 1; dia <= dias; dia++) {
        const barra = document.createElement("div");
        const consumo = consumoDatos[dia - 1] || 0;

        if (consumo > 0) {
            // Barra con consumo
            barra.className = "barra-dia consumo";
            const altura = (consumo / maxConsumo) * 100;
            barra.style.height = `${Math.max(altura, 2)}%`; // Mínimo 2% para visibilidad

            // Atributos de datos para el tooltip
            barra.setAttribute("data-dia", String(dia));
            barra.setAttribute("data-consumo", consumo.toFixed(1));
            barra.setAttribute("data-mes", mesInfo.nombre);

            // Event listeners para el tooltip
            barra.addEventListener("mouseenter", function (this: HTMLElement) {
                mostrarTooltip(this);
            });
            barra.addEventListener("mouseleave", ocultarTooltip);
        } else {
            // Barra tick (día sin consumo)
            barra.className = "barra-dia tick";
        }

        contenedorBarras.appendChild(barra);
    }

    // Generar etiquetas de días (primer y último día)
    const etiquetaPrimera = document.createElement("span");
    etiquetaPrimera.className = "etiqueta-dia";
    etiquetaPrimera.textContent = `${mesInfo.nombre} 1`;

    const etiquetaUltima = document.createElement("span");
    etiquetaUltima.className = "etiqueta-dia";
    etiquetaUltima.textContent = `${mesInfo.nombre} ${dias}`;

    contenedorEtiquetas.appendChild(etiquetaPrimera);
    contenedorEtiquetas.appendChild(etiquetaUltima);
}

function mostrarTooltip(barraElement: HTMLElement) {
    const tooltip = document.getElementById("tooltip-consumo");
    if (!tooltip) return;

    const dia = barraElement.getAttribute("data-dia");
    const consumo = barraElement.getAttribute("data-consumo");
    const mes = barraElement.getAttribute("data-mes");

    // Actualizar contenido del tooltip
    const fechaEl = document.getElementById("tooltip-fecha");
    const valorEl = document.getElementById("tooltip-valor");
    if (fechaEl) fechaEl.textContent = `${mes} ${dia}`;
    if (valorEl) valorEl.textContent = `${consumo} GB`;

    // Posicionar tooltip cerca de la barra
    const barraRect = barraElement.getBoundingClientRect();
    const parent = barraElement.parentElement;
    if (!parent) return;

    const contenedorRect = parent.getBoundingClientRect();

    const posicionRelativa = barraRect.left - contenedorRect.left;
    const anchoContenedor = contenedorRect.width;

    // Calcular posición (mantener dentro del contenedor)
    let leftPercent = (posicionRelativa / anchoContenedor) * 100;
    leftPercent = Math.max(15, Math.min(85, leftPercent)); // Limitar entre 15% y 85%

    tooltip.style.left = `${leftPercent}%`;

    // Mostrar tooltip
    tooltip.classList.add("visible");
}

function ocultarTooltip() {
    const tooltip = document.getElementById("tooltip-consumo");
    if (tooltip) tooltip.classList.remove("visible");
}

// Exponer funciones para uso externo (API)
interface Window {
    graficoConsumo: any;
}

window.graficoConsumo = {
    seleccionarMes,
    actualizarDatos: function (mes: string, datos: number[]) {
        CONSUMO_EJEMPLO[mes] = datos;
        if (mes === mesActual) {
            generarBarras(mes);
        }
    },
    obtenerMesActual: function () {
        return mesActual;
    },
};

function initAccordions() {
    document.querySelectorAll(".accordion-header").forEach((header) => {
        header.addEventListener("click", function (this: HTMLElement) {
            toggleAccordion(this);
        });
    });
}

function toggleAccordion(element: HTMLElement) {
    const item = element.parentElement;
    if (item) {
        item.classList.toggle("active");
    }
}

// Graficos de rendimiento
document.addEventListener("DOMContentLoaded", function () {
    initPerformanceCharts();
});

// 1. Capturar "Ahora" una vez para consistencia
const REFERENCE_NOW = new Date();
let currentRange = "15m";
const navigators: ChartNavigator[] = [];

// ChartNavigator Class
class ChartNavigator {
    index: number;
    graphCard: HTMLElement;
    track: HTMLElement | null;
    windowEl: HTMLElement | null;
    handleLeft: HTMLElement | null;
    handleRight: HTMLElement | null;
    navWrapper: HTMLElement | null;
    graphArea: HTMLElement | null;
    xAxis: HTMLElement | null;
    config: ChartConfig;
    state: ChartState;
    fullData: ChartDataPoint[];

    constructor(graphCard: HTMLElement, index: number) {
        this.index = index;
        this.graphCard = graphCard;
        this.track = graphCard.querySelector(".navigator-track");
        this.windowEl = graphCard.querySelector(".navigator-window");
        this.handleLeft = graphCard.querySelector(".handle-left");
        this.handleRight = graphCard.querySelector(".handle-right");
        this.navWrapper = graphCard.querySelector(".navigator-canvas-wrapper");

        this.graphArea = graphCard.querySelector(".graph-area");
        this.xAxis = graphCard.querySelector(".graph-x-axis");

        // Configuración inicial
        this.config = {
            totalMinutes: 120, // Default 15m (2h total)
            labelStepMinutes: 15,
            windowDefaultPct: 12.5,
        };

        this.state = {
            isDragging: false,
            isResizingLeft: false,
            isResizingRight: false,
            startX: 0,
            startLeft: 0,
            startWidth: 0,
            trackWidth: 0,
            windowLeftPct: 100 - 12.5,
            windowWidthPct: 12.5,
            minWidthPct: 5,
            maxWidthPct: 100,
        };

        this.fullData = []; // Initialize fullData

        this.initEvents();
        this.updateTrackWidth();
    }

    initEvents() {
        if (
            !this.track ||
            !this.windowEl ||
            !this.handleLeft ||
            !this.handleRight
        )
            return;

        this.startDrag = this.startDrag.bind(this);
        this.startResizeLeft = this.startResizeLeft.bind(this);
        this.startResizeRight = this.startResizeRight.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.stopInteraction = this.stopInteraction.bind(this);

        this.windowEl.addEventListener("mousedown", this.startDrag);
        this.handleLeft.addEventListener("mousedown", this.startResizeLeft);
        this.handleRight.addEventListener("mousedown", this.startResizeRight);

        this.windowEl.addEventListener("touchstart", this.startDrag);
        this.handleLeft.addEventListener("touchstart", this.startResizeLeft);
        this.handleRight.addEventListener("touchstart", this.startResizeRight);

        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.stopInteraction);
        document.addEventListener("touchmove", this.handleMouseMove);
        document.addEventListener("touchend", this.stopInteraction);

        const resizeObserver = new ResizeObserver(() => {
            this.updateTrackWidth();
            this.updateChart();
            // Re-renderizar navigator al cambiar tamaño para evitar deformaciones
            if (this.navWrapper && this.fullData.length > 0) {
                this.navWrapper.innerHTML = "";
                // Usamos isMini=true para el navigator
                renderSvgChart(
                    this.navWrapper,
                    this.fullData.map((d) => d.value),
                    this.index,
                    true,
                );
            }
        });
        if (this.track) resizeObserver.observe(this.track);
    }

    updateTrackWidth() {
        if (this.track) this.state.trackWidth = this.track.offsetWidth;
    }

    getClientX(e: MouseEvent | TouchEvent): number {
        return (e as TouchEvent).touches
            ? (e as TouchEvent).touches[0].clientX
            : (e as MouseEvent).clientX;
    }

    startDrag(e: MouseEvent | TouchEvent) {
        if ((e.target as HTMLElement).classList.contains("handle")) return;
        e.preventDefault();
        this.state.isDragging = true;
        this.state.startX = this.getClientX(e);
        this.state.startLeft = this.state.windowLeftPct;
    }

    startResizeLeft(e: MouseEvent | TouchEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.state.isResizingLeft = true;
        this.state.startX = this.getClientX(e);
        this.state.startLeft = this.state.windowLeftPct;
        this.state.startWidth = this.state.windowWidthPct;
    }

    startResizeRight(e: MouseEvent | TouchEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.state.isResizingRight = true;
        this.state.startX = this.getClientX(e);
        this.state.startWidth = this.state.windowWidthPct;
    }

    handleMouseMove(e: MouseEvent | TouchEvent) {
        if (
            !this.state.isDragging &&
            !this.state.isResizingLeft &&
            !this.state.isResizingRight
        )
            return;

        const currentX = this.getClientX(e);
        const deltaX = currentX - this.state.startX;
        const deltaPct = (deltaX / this.state.trackWidth) * 100;

        if (this.state.isDragging) {
            let newLeft = this.state.startLeft + deltaPct;
            if (newLeft < 0) newLeft = 0;
            if (newLeft + this.state.windowWidthPct > 100)
                newLeft = 100 - this.state.windowWidthPct;
            this.state.windowLeftPct = newLeft;
        } else if (this.state.isResizingLeft) {
            let newLeft = this.state.startLeft + deltaPct;
            let newWidth = this.state.startWidth - deltaPct;

            if (newLeft < 0) {
                newLeft = 0;
                newWidth = this.state.startWidth + this.state.startLeft;
            }
            if (newWidth < this.state.minWidthPct) {
                newWidth = this.state.minWidthPct;
                newLeft =
                    this.state.startLeft +
                    this.state.startWidth -
                    this.state.minWidthPct;
            }
            this.state.windowLeftPct = newLeft;
            this.state.windowWidthPct = newWidth;
        } else if (this.state.isResizingRight) {
            let newWidth = this.state.startWidth + deltaPct;
            if (newWidth < this.state.minWidthPct)
                newWidth = this.state.minWidthPct;
            if (this.state.windowLeftPct + newWidth > 100)
                newWidth = 100 - this.state.windowLeftPct;
            this.state.windowWidthPct = newWidth;
        }

        this.updateUI();
        this.updateChart();
    }

    stopInteraction() {
        this.state.isDragging = false;
        this.state.isResizingLeft = false;
        this.state.isResizingRight = false;
    }

    updateUI() {
        if (this.windowEl) {
            this.windowEl.style.left = `${this.state.windowLeftPct}%`;
            this.windowEl.style.width = `${this.state.windowWidthPct}%`;
        }
    }

    setRange(range: string) {
        // Configurar según rango
        if (range === "15m") {
            this.config = {
                totalMinutes: 120,
                labelStepMinutes: 15,
                windowDefaultPct: (15 / 120) * 100,
            };
        } else if (range === "3h") {
            this.config = {
                totalMinutes: 1440,
                labelStepMinutes: 180,
                windowDefaultPct: (180 / 1440) * 100,
            };
        } else if (range === "1d") {
            this.config = {
                totalMinutes: 10080,
                labelStepMinutes: 1440,
                windowDefaultPct: (1440 / 10080) * 100,
            };
        } else if (range === "7d") {
            this.config = {
                totalMinutes: 129600,
                labelStepMinutes: 10080,
                windowDefaultPct: (10080 / 129600) * 100,
            };
        } else if (range === "30d") {
            this.config = {
                totalMinutes: 259200,
                labelStepMinutes: 43200,
                windowDefaultPct: (43200 / 259200) * 100,
            };
        }

        // Reset visual state
        this.state.windowWidthPct = 100;
        this.state.windowLeftPct = 0;

        // --- GENERACIÓN DE DATOS (FULL DATA) ---
        // Generamos los datos una sola vez aquí. Estos serán la "verdad absoluta"
        // tanto para el Navigator (que los muestra todos) como para el Chart (que muestra una parte).
        this.fullData = [];
        const now = REFERENCE_NOW.getTime();
        const start = now - this.config.totalMinutes * 60000;

        // Usamos suficientes puntos para que la curva sea suave (200 es un buen equilibrio)
        const pointCount = 200;
        const step = (now - start) / (pointCount - 1);

        // Algoritmo "Random Walk" suave para evitar picos agresivos
        let prevVal = Math.floor(Math.random() * 40) + 30;
        for (let i = 0; i < pointCount; i++) {
            const t = start + i * step;
            // Variación pequeña para curvas suaves
            let change = (Math.random() - 0.5) * 10;
            let val = prevVal + change;

            // Mantener dentro de límites lógicos
            if (val < 5) val = 5 + Math.random() * 5;
            if (val > 95) val = 95 - Math.random() * 5;
            prevVal = val;

            this.fullData.push({ time: t, value: val });
        }

        // --- RENDERIZADO DEL NAVIGATOR ---
        // Aquí ocurre la "clonación" visual. Usamos fullData directamente.
        if (this.navWrapper) {
            this.navWrapper.innerHTML = "";
            // Pasamos solo los valores para el modo mini, pero derivados del mismo fullData
            renderSvgChart(
                this.navWrapper,
                this.fullData.map((d) => d.value),
                this.index,
                true,
            );
        }

        this.updateUI();
        this.updateChart();
    }

    updateChart() {
        // 1. Calcular rango de tiempo visible
        const visibleDurationMinutes =
            (this.state.windowWidthPct / 100) * this.config.totalMinutes;

        const trackStartTime = new Date(
            REFERENCE_NOW.getTime() - this.config.totalMinutes * 60000,
        );
        const visibleStartTime = new Date(
            trackStartTime.getTime() +
            (this.state.windowLeftPct / 100) * this.config.totalMinutes * 60000,
        );
        const visibleEndTime = new Date(
            visibleStartTime.getTime() + visibleDurationMinutes * 60000,
        );

        // 2. Generar Etiquetas (Labels)
        const labels: { time: Date; text: string }[] = [];
        const labelTimestamps: number[] = [];
        const stepMs = this.config.labelStepMinutes * 60000;
        let currentTime = REFERENCE_NOW.getTime();
        const minVisible = visibleStartTime.getTime();
        const maxVisible = visibleEndTime.getTime();

        let iterations = 0;
        // Generar etiquetas hacia atrás desde NOW
        while (currentTime >= trackStartTime.getTime() && iterations < 1000) {
            if (currentTime >= minVisible && currentTime <= maxVisible) {
                labels.push({
                    time: new Date(currentTime),
                    text: formatSmartLabel(
                        new Date(currentTime),
                        this.config.totalMinutes,
                    ),
                });
                labelTimestamps.push(currentTime);
            }
            currentTime -= stepMs;
            iterations++;
        }

        labels.sort((a, b) => a.time.getTime() - b.time.getTime());
        labelTimestamps.sort((a, b) => a - b);

        // 3. Actualizar Eje X DOM
        if (this.xAxis && this.graphArea) {
            this.xAxis.innerHTML = labels
                .map((l) => {
                    const timeInWindow = l.time.getTime() - minVisible;
                    const windowDurationMs = maxVisible - minVisible;
                    const pct = (timeInWindow / windowDurationMs) * 100;

                    let style = `left: ${pct}%;`;
                    if (pct < 5) style += ` transform: translateX(0%);`;
                    else if (pct > 95) style += ` transform: translateX(-100%);`;
                    else style += ` transform: translateX(-50%);`;

                    return `<span class="x-label" style="${style}">${l.text}</span>`;
                })
                .join("");

            // 4. Actualizar Visual del Gráfico Principal
            const existingWrapper = this.graphArea.querySelector(
                ".chart-visual-wrapper",
            );
            if (existingWrapper) existingWrapper.remove();

            const chartWrapper = document.createElement("div");
            chartWrapper.className = "chart-visual-wrapper";
            chartWrapper.style.position = "relative";
            chartWrapper.style.flex = "1";
            chartWrapper.style.width = "100%";
            chartWrapper.style.minHeight = "100px";
            chartWrapper.style.overflow = "hidden";

            const baseline = this.graphArea.querySelector(".graph-baseline");
            if (baseline) {
                this.graphArea.insertBefore(chartWrapper, baseline);
            } else {
                this.graphArea.insertBefore(chartWrapper, this.xAxis);
            }

            // Filtrar fullData para mostrar solo lo visible + un pequeño buffer para suavizar bordes
            const buffer = (maxVisible - minVisible) * 0.2;
            const renderStart = minVisible - buffer;
            const renderEnd = maxVisible + buffer;

            // Datos para el gráfico principal (Subconjunto de fullData)
            let chartData: ChartDataPoint[] = this.fullData
                .filter((d) => d.time >= renderStart && d.time <= renderEnd)
                .map((d) => ({ time: d.time, value: d.value, isLabel: false }));

            // Interpolación para asegurar que los puntos blancos de las etiquetas caigan exactamente en la línea
            labelTimestamps.forEach((ts) => {
                const nextIdx = this.fullData.findIndex((d) => d.time >= ts);
                let val = 0;
                if (nextIdx > 0 && nextIdx < this.fullData.length) {
                    const p1 = this.fullData[nextIdx - 1];
                    const p2 = this.fullData[nextIdx];
                    const ratio = (ts - p1.time) / (p2.time - p1.time);
                    val = p1.value + (p2.value - p1.value) * ratio;
                } else if (nextIdx === 0 && this.fullData.length > 0) {
                    val = this.fullData[0].value;
                } else if (nextIdx === -1 && this.fullData.length > 0) {
                    val = this.fullData[this.fullData.length - 1].value;
                }
                chartData.push({ time: ts, value: val, isLabel: true });
            });

            chartData.sort((a, b) => a.time - b.time);

            // Renderizar Gráfico Principal
            renderSvgChart(
                chartWrapper,
                chartData,
                this.index,
                false,
                labelTimestamps,
                minVisible,
                maxVisible,
            );
        }
    }
}

function initPerformanceCharts() {
    const timeButtons = document.querySelectorAll(".time-btn");
    const graphCards = document.querySelectorAll(".graph-card");

    graphCards.forEach((card, index) => {
        const nav = new ChartNavigator(card as HTMLElement, index);
        navigators.push(nav);
    });

    navigators.forEach((nav) => nav.setRange(currentRange));

    timeButtons.forEach((btn) => {
        btn.addEventListener("click", function (this: HTMLElement) {
            timeButtons.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            const text = this.textContent?.trim().toLowerCase() || "";
            if (text.includes("3 horas")) currentRange = "3h";
            else if (text.includes("1 día")) currentRange = "1d";
            else if (text.includes("7 días")) currentRange = "7d";
            else if (text.includes("30 días")) currentRange = "30d";
            else currentRange = "15m";

            navigators.forEach((nav) => nav.setRange(currentRange));
        });
    });
}

// Helper Functions
// --- Funciones Auxiliares ---

function formatSmartLabel(date: Date, totalMinutes: number) {
    const formatTime = (d: Date) => {
        let hours = d.getHours();
        const minutes = d.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strMinutes = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}:${strMinutes} <small>${ampm}</small>`;
    };

    const formatDate = (d: Date) => {
        const day = d.getDate();
        const months = [
            "ENE",
            "FEB",
            "MAR",
            "ABR",
            "MAY",
            "JUN",
            "JUL",
            "AGO",
            "SEP",
            "OCT",
            "NOV",
            "DIC",
        ];
        const month = months[d.getMonth()];
        return `${day} <small>${month}</small>`;
    };

    if (totalMinutes <= 1440) {
        return formatTime(date);
    } else {
        return formatDate(date);
    }
}

// Función de renderizado SVG (Curvas Bezier)
function renderSvgChart(
    container: HTMLElement,
    data: any[],
    chartIndex: number,
    isMini = false,
    labelTimestamps: number[] = [],
    explicitMinTime: number | null = null,
    explicitMaxTime: number | null = null,
) {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    // ID único para gradientes
    const gradientId = `chartGradient-${chartIndex}-${isMini ? "mini" : "main"}-${Math.random().toString(36).substr(2, 9)}`;

    const xmlns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(xmlns, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.zIndex = "1";
    svg.style.overflow = "visible";

    const defs = document.createElementNS(xmlns, "defs");
    const linearGradient = document.createElementNS(xmlns, "linearGradient");
    linearGradient.setAttribute("id", gradientId);
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("x2", "0%");
    linearGradient.setAttribute("y2", "100%");

    const stop1 = document.createElementNS(xmlns, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#00d2ff");
    // Opacidad sutilmente menor para el mini gráfico
    stop1.setAttribute("stop-opacity", isMini ? "0.4" : "0.6");

    const stop2 = document.createElementNS(xmlns, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#00d2ff");
    stop2.setAttribute("stop-opacity", "0");

    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2);
    defs.appendChild(linearGradient);
    svg.appendChild(defs);

    // Preparar Puntos X,Y
    let points: ChartDataPoint[] = [];
    if (isMini) {
        // Modo Mini: Mapear valores simples a coordenadas
        const stepX = width / (data.length - 1);
        points = data.map((val, i) => ({
            time: 0, // Dummy
            value: val,
            x: i * stepX,
            y: height - (val / 100) * height, // Escala 0-100% de la altura
        }));
    } else {
        // Modo Principal: Mapear Tiempo a coordenadas
        if (data.length < 2) return;
        let minTime, maxTime, timeRange;

        if (explicitMinTime !== null && explicitMaxTime !== null) {
            minTime = explicitMinTime;
            maxTime = explicitMaxTime;
        } else {
            minTime = data[0].time;
            maxTime = data[data.length - 1].time;
        }
        timeRange = maxTime - minTime;

        points = data.map((d) => ({
            time: d.time,
            value: d.value,
            x: ((d.time - minTime) / timeRange) * width,
            y: height - (d.value / 100) * (height * 0.8), // Escala al 80% para dejar aire arriba
            isLabel: d.isLabel,
        }));
    }

    if (points.length < 2) return;

    // Lógica de Curvas Bezier Suaves
    const getControlPoint = (
        current: ChartDataPoint,
        previous: ChartDataPoint,
        next: ChartDataPoint,
        reverse: boolean,
    ) => {
        const p = previous || current;
        const n = next || current;
        // Factor de suavizado (0.2 da curvas agradables, 0 sería líneas rectas)
        const smoothing = 0.2;

        const oX = (n.x || 0) - (p.x || 0);
        const oY = (n.y || 0) - (p.y || 0);

        const angle = Math.atan2(oY, oX) + (reverse ? Math.PI : 0);
        const length = Math.sqrt(Math.pow(oX, 2) + Math.pow(oY, 2)) * smoothing;

        const x = (current.x || 0) + Math.cos(angle) * length;
        const y = (current.y || 0) + Math.sin(angle) * length;
        return { x, y };
    };

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];

        const pPrev = points[i - 1] || p0;
        const pNext = points[i + 2] || p1;

        const cp1 = getControlPoint(p0, pPrev, p1, false);
        const cp2 = getControlPoint(p1, p0, pNext, true);

        pathD += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p1.x} ${p1.y}`;
    }

    // Dibujar Área (Relleno Degradado)
    const areaPathData = `${pathD} L ${width} ${height} L 0 ${height} Z`;
    const areaPath = document.createElementNS(xmlns, "path");
    areaPath.setAttribute("d", areaPathData);
    areaPath.setAttribute("fill", `url(#${gradientId})`);
    areaPath.setAttribute("stroke", "none");
    svg.appendChild(areaPath);

    // Dibujar Línea (Borde Cyan)
    const linePath = document.createElementNS(xmlns, "path");
    linePath.setAttribute("d", pathD);
    linePath.setAttribute("fill", "none");
    linePath.setAttribute("stroke", "#00d2ff");
    linePath.setAttribute("stroke-width", isMini ? "1" : "2"); // Línea más fina en navigator
    linePath.setAttribute("stroke-linecap", "round");
    linePath.setAttribute("stroke-linejoin", "round");
    svg.appendChild(linePath);

    if (!isMini) {
        // Círculos blancos solo en el gráfico principal donde hay etiquetas
        points.forEach((p) => {
            if (p.isLabel) {
                const circle = document.createElementNS(xmlns, "circle");
                circle.setAttribute("cx", String(p.x));
                circle.setAttribute("cy", String(p.y));
                circle.setAttribute("r", "3");
                circle.setAttribute("fill", "white");
                circle.style.cursor = "pointer";
                circle.style.transition = "r 0.3s ease";
                circle.style.transition = "r 0.3s ease";
                circle.addEventListener("mouseenter", () =>
                    circle.setAttribute("r", "6"),
                );
                circle.addEventListener("mouseleave", () =>
                    circle.setAttribute("r", "3"),
                );
                svg.appendChild(circle);
            }
        });
    }

    container.appendChild(svg);
}
