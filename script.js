// Configuración de tsparticles con mariposas animadas
// Esta llamada se mantiene global para que tsparticles funcione correctamente.
tsParticles.load("tsparticles", {
    "particles": {
        "number": {
            "value": 20, // Number of particles
            "density": {
                "enable": true,
                "area": 800
            }
        },
        "shape": {
            "type": "image", // Shape type: image
            "image": {
                // URL of the butterfly image
                "src": "https://static.vecteezy.com/system/resources/thumbnails/035/999/208/small/ai-generated-purple-violet-beautiful-butterfly-drawing-watercolor-clip-art-illustration-png.png",
                "width": 32,
                "height": 32
            }
        },
        "size": {
            "value": 30, // Size of particles
            "random": true // Random size
        },
        "move": {
            "enable": true, // Enable movement
            "speed": 1, // Movement speed
            "direction": "none",
            "straight": false,
            "outModes": {
                "default": "bounce" // Bounce off edges
            },
            "angle": {
                "value": 45,
                "offset": 0
            },
            "rotate": {
                "value": { "min": 0, "max": 360 }, // Random rotation
                "animation": {
                    "enable": true,
                    "speed": 3,
                    "sync": false
                }
            }
        },
        "opacity": {
            "value": 0.7 // Opacity of particles
        },
        "links": {
            "enable": false // Disable links between particles
        }
    },
    "detectRetina": true // Detect retina displays
});

/**
 * Muestra un modal personalizado con un mensaje y un tipo (éxito/error).
 * @param {string} message - The message to display in the modal.
 * @param {boolean} isSuccess - True if it's a success message, false for error.
 * @param {function} [callback] - Function to execute after the modal closes (optional).
 */
function showModal(message, isSuccess, callback) {
    const modal = document.getElementById("customModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalContent = modal.querySelector('.modal-content');

    // Clear message type classes to ensure only one is active
    modalContent.classList.remove('success', 'error');

    if (isSuccess) {
        modalTitle.textContent = "¡Éxito!";
        modalContent.classList.add('success');
    } else {
        modalTitle.textContent = "Error";
        modalContent.classList.add('error');
    }
    modalMessage.textContent = message;

    // Show the modal by adding the 'show' class
    modal.classList.add("show");

    // If it's a success message, it closes automatically after 3 seconds
    // and then executes any provided callback function.
    if (isSuccess) {
        setTimeout(() => {
            hideModal();
            if (callback) {
                callback();
            }
        }, 3000); // Success modal closes after 3 seconds
    } else {
        // For errors, the user must close it manually by clicking the 'X' button.
        // There is no automatic close or callback in this case.
    }
}

/**
 * Hides the custom modal.
 */
function hideModal() {
    const modal = document.getElementById("customModal");
    modal.classList.remove("show"); // Hide the modal by removing the 'show' class
}

// Ensure that the DOM is fully loaded before manipulating elements
document.addEventListener('DOMContentLoaded', () => {
    // Define the limits of members per family
    const limitesPorFamilia = {
        "García López": 4, 
        "López Tapia": 2,
        "López Vera": 4,
        "López Galvan": 5,
        "Bernal López": 5,
        "Hurd Bonilla": 4,
        "Xochil Bonilla": 6,
        "García Romero": 4,
        "García García": 5,
        "García Aguilar": 3,
        "Vega Cruz": 3,
        "Cruz Romero": 2,
        "Rangel Paz": 4,
        "Rodríguez Ramírez": 5,
        "Flores Merlos": 4,
        "Herrera Flores (Luz)": 5,
        "Herrera Flores (Mary)": 4,
        "García Flores": 5,
        "Flores Osnaya": 2,
        "Flores Alcantar": 3,
        "Merlos Martines": 5,
        "Flores Medina": 2,
        "Tapia Baca": 6,
        "Susy": 4,
        "Dulce": 2,
        "Yuri": 3,
        "Jani": 4,
        "Ximena": 2,
        "Angely": 2,
        "Carlos": 2,
        "Alondra": 2,
        "Amalia": 2,
        "Fatima": 2,
        "Yocelin": 2,
        "Byron": 2,
        "Victor": 2,
        "Giselle": 2,
        "Luis Angel": 2,
        "Daher": 2,
        "Michelle": 2,
        "Isa": 2,
        "Lidia": 3,
        "Wendy": 5,
        "Aidee": 2,
        "Tete": 2,
        "Santi": 3,
        "Titi": 4,
        "Huido": 4,
        "Gera": 2,
        "Migue": 2,
        "Olga": 2,
        "Baruc": 5,
        "Lupita Franco": 2,
        "Nadia": 2,
        "Maestra Edit": 1,
        "Rosalva": 4,
        "Maestra Jose": 1,
        "Miriam": 3,
        "Yajaziel": 4,
        "Gustavo": 5,
        "Cristian": 2,
        "Saul": 2,
        // Add more families and their corresponding limits here
    };

    const familiaSelect = document.getElementById('nombre');
    const integrantesInput = document.getElementById('integrantes');
    const nombresContainer = document.getElementById('nombresIntegrantesContainer');
    const labelIntegrantes = document.querySelector('label[for="integrantes"]'); // Referencia al label de Integrantes

    /**
     * Dynamically generates input fields for member names.
     * The number of fields depends on the value in the 'integrantes' input.
     */
    const generarCamposNombres = () => {
        let numIntegrantes = parseInt(integrantesInput.value, 10);
        nombresContainer.innerHTML = '';

        const familiaSeleccionada = familiaSelect.value;
        const limiteMaximo = limitesPorFamilia[familiaSeleccionada] || 0;

        if (numIntegrantes > limiteMaximo) {
            showModal(`Error: El número máximo de integrantes para ${familiaSeleccionada} es de ${limiteMaximo}.`, false);
            numIntegrantes = limiteMaximo;
            integrantesInput.value = limiteMaximo;
        }
        // CAMBIO: Si es negativo, lo dejamos en blanco
        if (numIntegrantes < 0 || isNaN(numIntegrantes)) { // También cubrimos el caso inicial de NaN
            integrantesInput.value = ""; // Deja el campo en blanco
            numIntegrantes = 0; // Internamente lo tratamos como 0 para la lógica
        }

        if (numIntegrantes > 0 && numIntegrantes <= limiteMaximo) { 
            for (let i = 0; i < numIntegrantes; i++) {
                const divFamilia = document.createElement('div');
                divFamilia.classList.add('familias'); 
                divFamilia.style.marginBottom = '25px';

                const inputNombre = document.createElement('input');
                inputNombre.type = 'text';
                inputNombre.required = true;
                inputNombre.name = `integrante${i + 1}`;
                inputNombre.id = `integrante${i + 1}`;     
                inputNombre.placeholder = ' '; 

                const labelNombre = document.createElement('label');
                labelNombre.htmlFor = `integrante${i + 1}`; 
                labelNombre.textContent = `Nombre de Integrante ${i + 1}`;

                divFamilia.appendChild(inputNombre);
                divFamilia.appendChild(labelNombre);
                nombresContainer.appendChild(divFamilia);
            }
        }
    };

    /**
     * Updates the 'max' attribute and placeholder/label of the members input field
     * based on the selected family and calls generarCamposNombres.
     */
    const actualizarLimiteIntegrantes = () => {
        const familiaSeleccionada = familiaSelect.value;
        const limite = limitesPorFamilia[familiaSeleccionada];

        if (limite !== undefined) {
            integrantesInput.max = limite; // Set the actual max attribute
            integrantesInput.placeholder = " "; // Ensure placeholder is just a space
            labelIntegrantes.textContent = `Integrantes (Max: ${limite})`; // Actualiza el texto del label
            if (parseInt(integrantesInput.value, 10) > limite) {
                integrantesInput.value = limite;
            }
            generarCamposNombres(); 
        } else {
            integrantesInput.max = ""; 
            integrantesInput.value = ""; // CAMBIO: Deja el campo en blanco si no hay familia seleccionada
            integrantesInput.placeholder = " "; // Reset placeholder if no family selected
            labelIntegrantes.textContent = "Integrantes"; // Reset label to default
            nombresContainer.innerHTML = ''; 
        }
    };

    familiaSelect.addEventListener('change', actualizarLimiteIntegrantes);
    integrantesInput.addEventListener('input', generarCamposNombres);
    
    // CAMBIO INICIAL: Deja el campo de integrantes en blanco al cargar la página
    integrantesInput.value = ""; 
    // Asegura que la etiqueta esté en su estado inicial
    labelIntegrantes.textContent = "Integrantes";
    // Llama a actualizarLimiteIntegrantes para que se configure correctamente si hay una selección inicial (aunque no esperada)
    actualizarLimiteIntegrantes(); 
});

/**
 * Saves form data to Google Sheets and displays a confirmation or error modal.
 */
async function guardarEnGoogleSheets() {
    let nombreFamilia = document.getElementById("nombre").value.trim();
    let numIntegrantes = document.getElementById("integrantes").value.trim();

    if (!nombreFamilia || nombreFamilia === "" || !numIntegrantes) { // numIntegrantes ahora puede ser una cadena vacía
        showModal("Por favor, selecciona una Familia y completa el número de Integrantes.", false);
        return;
    }
    
    // CAMBIO: ParseInt de numIntegrantes para validación, ya que puede ser una cadena vacía
    if (parseInt(numIntegrantes, 10) === 0 || isNaN(parseInt(numIntegrantes, 10))) { 
        showModal("El número de integrantes debe ser mayor a 0.", false);
        return;
    }

    const nombresIntegrantes = [];
    const inputsNombres = document.querySelectorAll('#nombresIntegrantesContainer input[type="text"]');
    
    let allNamesFilled = true;
    inputsNombres.forEach(input => {
        const nombre = input.value.trim();
        if (!nombre) {
            allNamesFilled = false;
        }
        nombresIntegrantes.push(nombre);
    });

    if (!allNamesFilled) {
        showModal("Por favor, ingresa el nombre de cada integrante.", false);
        return;
    }

    const fechaActual = new Date();
    const fechaRegistro = fechaActual.toLocaleDateString('es-ES') + ' ' + fechaActual.toLocaleTimeString('es-ES');

    let datos = { 
        familia: nombreFamilia, 
        cantidadIntegrantes: numIntegrantes,
        nombresIntegrantes: nombresIntegrantes.join(', '), 
        fechaRegistro: fechaRegistro 
    };

    try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbwgU0NKR2yOmjBdwB2Y1YjxXxG_AhJdAGPeC89MDEgYv6-LR9ELGKLqdR1ErYPokjHs/exec", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        showModal("¡Gracias! Tus datos se han guardado exitosamente.", true, () => {
            document.getElementById("miFormulario").reset(); 
            document.getElementById('nombresIntegrantesContainer').innerHTML = '';
            document.getElementById('nombre').value = "";
            document.getElementById('integrantes').max = "";
            document.getElementById('integrantes').value = ""; // CAMBIO: Deja el campo en blanco al resetear
            document.getElementById('integrantes').placeholder = " "; 
            document.querySelector('label[for="integrantes"]').textContent = "Integrantes";


            window.location.href = "https://itinerarioleilani.netlify.app/"; 
        });
        
    } catch (error) {
        console.error("Error al guardar los datos:", error);
        showModal("Hubo un error al guardar los datos. Por favor, inténtalo nuevamente.", false); 
    }
}
