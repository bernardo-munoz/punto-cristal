let datosGlobales = {};

// Cargar el archivo JSON al iniciar la página
async function cargarDatos() {
    try {
        const respuesta = await fetch('data.json');
        datosGlobales = await respuesta.json();
        renderizarServicios(datosGlobales.servicios);
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        const contenedor = document.getElementById('grid-servicios');
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="text-center py-12 px-4 bg-slate-950 border border-slate-800 rounded-2xl md:col-span-2">
                    <p class="text-amber-400 font-bold text-lg mb-2">No se pudieron cargar los servicios en este momento.</p>
                    <p class="text-slate-400 text-sm mb-4">Si necesitas información inmediata, por favor contáctanos por WhatsApp.</p>
                    <a href="https://wa.me/573188908673" target="_blank" class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-full text-sm transition">
                        Escribir por WhatsApp
                    </a>
                </div>
            `;
        }
    }
}

// Pintar las tarjetas en la sección de servicios (100% responsivas)
function renderizarServicios(servicios) {
    const contenedor = document.getElementById('grid-servicios');
    contenedor.innerHTML = '';

    servicios.forEach((servicio, index) => {
        contenedor.innerHTML += `
            <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition duration-300">
                <div class="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-900">
                    <img src="${servicio.imagen_principal}" alt="${servicio.titulo}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
                </div>
                <div class="p-5 sm:p-6 flex flex-col flex-grow">
                    <h3 class="text-lg sm:text-xl font-bold mb-2 text-amber-400 leading-snug">${servicio.titulo}</h3>
                    <p class="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">${servicio.resumen}</p>
                    <button onclick="abrirModal(${index})" class="w-full bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition duration-200 text-center text-sm sm:text-base active:scale-98">
                        Ver detalles y trabajos →
                    </button>
                </div>
            </div>
        `;
    });
}

// Abrir modal y cargar la información específica por índice o id
function abrirModal(indexOServicio) {
    let servicio;
    if (typeof indexOServicio === 'number') {
        servicio = datosGlobales.servicios[indexOServicio];
    } else {
        servicio = datosGlobales.servicios.find(s => s.id === indexOServicio);
    }
    if (!servicio) return;

    const contenidoModal = document.getElementById('contenido-modal');

    let htmlTrabajos = '';
    if (Array.isArray(servicio.trabajos_realizados)) {
        servicio.trabajos_realizados.forEach(item => {
            const url = typeof item === 'string' ? item : item.url;
            const tipo = (typeof item === 'object' && item.tipo) ? item.tipo : 'imagen';
            const titulo = (typeof item === 'object' && item.titulo_proyecto) ? item.titulo_proyecto : '';
            const descripcion = (typeof item === 'object' && item.descripcion) ? item.descripcion : '';

            /* ========================================================
               BLOQUE DE VIDEO (Comentado):
               Si deseas volver a habilitar videos, descomenta este bloque: */
            if (tipo === 'video') {
                htmlTrabajos += `
                    <div class="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-slate-700 transition">
                        <iframe src="${url}" class="w-full h-48 sm:h-52 border-0 overflow-hidden" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <div class="p-3 border-t border-slate-800/50">
                            ${titulo ? `<p class="text-xs sm:text-sm text-slate-200 font-semibold">${titulo}</p>` : ''}
                            ${descripcion ? `<div class="text-slate-400 text-[11px] sm:text-xs mt-1 leading-relaxed">${descripcion}</div>` : ''}
                        </div>
                    </div>
                `;
            }
           // ======================================================== 

            // Mostrar imágenes (1 columna en móvil, 2 en pantallas medianas/grandes)
            if (tipo === 'imagen') {
                htmlTrabajos += `
                    <div class="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-slate-700 transition">
                        <img src="${url}" alt="${titulo || servicio.titulo}" class="w-full h-48 sm:h-52 object-cover">
                        <div class="p-3 border-t border-slate-800/50">
                            ${titulo ? `<p class="text-xs sm:text-sm text-slate-200 font-semibold">${titulo}</p>` : ''}
                            ${descripcion ? `<div class="text-slate-400 text-[11px] sm:text-xs mt-1 leading-relaxed">${descripcion}</div>` : ''}
                        </div>
                    </div>
                `;
            }
        });
    }

    contenidoModal.innerHTML = `
        <h2 class="text-xl sm:text-2xl font-bold text-amber-400 mb-3 pr-10 leading-snug">${servicio.titulo}</h2>
        <p class="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">${servicio.descripcion_completa}</p>
        
        <h4 class="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase mb-3">Catalogo y trabajos Realizados</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            ${htmlTrabajos}
        </div>

        <a href="https://wa.me/573188908673?text=Hola,%20estoy%20interesado%20en%20el%20servicio%20de:%20${encodeURIComponent(servicio.titulo)}" target="_blank" class="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-md shadow-emerald-600/20 active:scale-98 text-sm sm:text-base">
            Cotizar este servicio por WhatsApp
        </a>
    `;

    document.getElementById('modal-detalle').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modal-detalle');
    if (modal) {
        modal.classList.add('hidden');
    }
    document.body.style.overflow = 'auto'; // Habilitar scroll de fondo
}

// Control del menú hamburguesa en pantallas móviles
function toggleMenuMovil() {
    const menu = document.getElementById('menu-movil');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Atajo accesible: cerrar modal con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cerrarModal();
    }
});

// Inicializar carga al arrancar
cargarDatos();
