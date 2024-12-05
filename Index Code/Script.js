// Expresión regular para validar IP:Puerto 
const REGEX_IP_PORT = /^(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
const TIMEOUT = 5000; // Tiempo de espera predeterminado en ms

// Arrays para almacenar IPs y puertos válidos, muertos y no válidos
let validIpArray = [];
let deadIpArray = [];
let invalidIpArray = [];

// Validar rango de IP
const validateIp = (ip) => ip.split('.').every(num => parseInt(num) >= 0 && parseInt(num) <= 255);

// Validar rango de puerto
const validatePort = (port) => port >= 1 && port <= 65535;

// Agregar nuevas IPs al contenedor correspondiente sin borrar contenido anterior
function appendToContainer(containerSelector, ipList) {
    const container = document.querySelector(containerSelector);
    ipList.forEach(ip => {
        const ipElement = document.createElement('p');
        ipElement.textContent = ip;
        container.appendChild(ipElement);
    });
}

// Actualizar los contadores de IPs en los encabezados
function updateIpCounters(working, notWorking) {
    document.querySelector('.ip-container.vivas h3').textContent = `IPs Vivas (${working})`;
    document.querySelector('.ip-container.muertas h3').textContent = `IPs Muertas (${notWorking})`;
    document.querySelector('.ip-container.noValidas h3').textContent = `IPs No Válidas (${invalidIpArray.length})`;
}

// Extraer y clasificar IPs y puertos del texto
function extractValidIps(text) {
    validIpArray = [];
    deadIpArray = [];
    invalidIpArray = [];

    text.split('\n').forEach(ip => {
        if (REGEX_IP_PORT.test(ip)) {
            const [ipAddress, port] = ip.split(':');
            if (validateIp(ipAddress) && validatePort(Number(port))) {
                validIpArray.push(ip);
            } else {
                deadIpArray.push(ip);
            }
        } else {
            invalidIpArray.push(ip);
        }
    });

    // Agregar las IPs no válidas al contenedor
    appendToContainer('.noValidasList', invalidIpArray);
}

// Limpiar las listas y contadores
function clearListsAndCounters() {
    // Limpiar los contenedores de IPs
    document.querySelector('.vivasList').innerHTML = '';
    document.querySelector('.muertasList').innerHTML = '';
    document.querySelector('.noValidasList').innerHTML = '';

    // Restablecer los contadores
    document.querySelector('.ip-container.vivas h3').textContent = 'IPs Vivas (0)';
    document.querySelector('.ip-container.muertas h3').textContent = 'IPs Muertas (0)';
    document.querySelector('.ip-container.noValidas h3').textContent = 'IPs No Válidas (0)';
}

// Simular barra de carga y comprobar proxies
async function simulateLoadingBarAndCheckProxies(duration) {
    const loadingBar = document.getElementById('loadingBar');
    const totalProxies = validIpArray.length;
    let working = 0, notWorking = 0, width = 0;

    return new Promise(resolve => {
        const interval = setInterval(async () => {
            if (width < 100 && validIpArray.length > 0) {
                const proxy = validIpArray.shift();
                const isWorking = await checkProxy(proxy, TIMEOUT);

                if (isWorking) {
                    working++;
                    appendToContainer('.vivasList', [proxy]); // Agregar IP viva
                } else {
                    notWorking++;
                    appendToContainer('.muertasList', [proxy]); // Agregar IP muerta
                }

                updateIpCounters(working, notWorking);

                width = Math.min(((working + notWorking) / totalProxies) * 100, 100);
                loadingBar.style.width = `${width}%`;
            }

            if (width >= 100) {
                clearInterval(interval);
                resolve({ working, notWorking });
            }
        }, duration / totalProxies);
    });
}

// Verificar si el proxy está vivo
async function checkProxy(proxy, timeout) {
    try {
        const controller = new AbortController();
        const signal = controller.signal;

        setTimeout(() => controller.abort(), timeout);
        const response = await fetch('https://httpbin.org/ip', {
            method: 'GET',
            signal,
            headers: { 'X-Forwarded-For': proxy },
        });

        return response.ok;
    } catch {
        return false;
    }
}

// Iniciar la comprobación de proxies
async function startCheck() {
    const proxyListText = document.getElementById('proxyList').value;

    // Limpiar las listas y los contadores antes de iniciar
    clearListsAndCounters();

    // Extraer y clasificar IPs
    extractValidIps(proxyListText);

    const loadingBarContainer = document.getElementById('loadingBarContainer');
    const output = document.getElementById('output');

    loadingBarContainer.style.display = 'block';
    output.style.display = 'none';
    output.innerText = "";

    const duration = 3000;
    const { working, notWorking } = await simulateLoadingBarAndCheckProxies(duration);

    loadingBarContainer.style.display = 'none';
    output.style.display = 'block';
    output.innerText = `Comprobación completa:\nVivas: ${working}\nMuertas: ${notWorking}`;

    // Actualizar los contadores finales
    updateIpCounters(working, notWorking);
}


  
  
  
  
  
 document.getElementById('downloadBtn').addEventListener('click', function () {
    // Obtener los contenidos de las tres listas
    const vivasContent = document.querySelector('.vivasList').innerText;
    const muertasContent = document.querySelector('.muertasList').innerText;
    const noValidasContent = document.querySelector('.noValidasList').innerText;

    // Obtener la fecha actual
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;

    // Crear los contenidos de los tres archivos de texto
    const vivasText = `IPs Vivas:\n${vivasContent}`;
    const muertasText = `IPs Muertas:\n${muertasContent}`;
    const noValidasText = `IPs No Válidas:\n${noValidasContent}`;

    // Crear un archivo zip
    const zip = new JSZip();
    
    // Agregar los archivos al zip
    zip.file(`IPs_Vivas_${formattedDate}.txt`, vivasText);
    zip.file(`IPs_Muertas_${formattedDate}.txt`, muertasText);
    zip.file(`IPs_No_Validas_${formattedDate}.txt`, noValidasText);

    // Generar el archivo zip y descargarlo
    zip.generateAsync({ type: 'blob' }).then(function(content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `bszchecker_${formattedDate}.zip`; // Nombre del archivo zip
        link.click();
    });
});

  
