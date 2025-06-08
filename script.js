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
            "Familia Garcia": 7, // Limite actualizado a 7
            "Familia Lopez": 10,
            "Familia Martinez": 3,
            "Familia Rodriguez": 7,
            "Familia Sanchez": 4,
            "Familia Hernandez": 3, // Limite actualizado a 3
            // Add more families and their corresponding limits here
            // EXAMPLE: "Other Family": 8,
        };

        const familiaSelect = document.getElementById('nombre');
        const integrantesInput = document.getElementById('integrantes');
        const nombresContainer = document.getElementById('nombresIntegrantesContainer');

        // Variable para almacenar las familias ya registradas
        let familiasRegistradas = [];

        /**
         * Fetches the list of already registered families from Google Apps Script.
         */
        async function fetchRegisteredFamilies() {
            try {
                // Usa la misma URL del script de Apps Script, pero para una petición GET
                // Esta URL debe ser la URL de tu aplicación web de Apps Script (terminada en /exec)
                const response = await fetch("https://script.google.com/macros/s/AKfycbwgU0NKR2yOmjBdwB2Y1YjxXxG_AhJdAGPeC89MDEgYv6-LR9ELGKLqdR1ErYPokjHs/exec?action=getRegisteredFamilies");
                const data = await response.json(); // Espera y parsea la respuesta JSON

                if (data && data.familias) {
                    familiasRegistradas = data.familias;
                    console.log("Familias registradas:", familiasRegistradas);
                    // Deshabilita las opciones de familias ya registradas en el select
                    updateFamilySelectOptions();
                } else {
                    console.error("No se pudieron obtener las familias registradas:", data);
                }
            } catch (error) {
                console.error("Error al obtener familias registradas:", error);
                showModal("No se pudo cargar la lista de familias registradas. Por favor, recarga la página.", false);
            }
        }

        /**
         * Updates the options in the family select dropdown to disable already registered families.
         */
        function updateFamilySelectOptions() {
            Array.from(familiaSelect.options).forEach(option => {
                if (familiasRegistradas.includes(option.value)) {
                    option.disabled = true;
                    option.style.fontStyle = 'italic';
                    option.textContent = option.textContent + ' (Registrada)';
                } else {
                    option.disabled = false;
                    // Si la familia no está registrada, asegúrate de que no tenga el texto '(Registrada)'
                    if (option.textContent.includes(' (Registrada)')) {
                        option.textContent = option.textContent.replace(' (Registrada)', '');
                    }
                }
            });
        }


        /**
         * Dynamically generates input fields for member names.
         * The number of fields depends on the value in the 'integrantes' input.
         */
        const generarCamposNombres = () => {
            let numIntegrantes = parseInt(integrantesInput.value, 10); // Get the integer number
            nombresContainer.innerHTML = ''; // Clear any existing fields before generating new ones

            const familiaSeleccionada = familiaSelect.value;
            const limiteMaximo = limitesPorFamilia[familiaSeleccionada] || 0; // Get max limit for selected family, default to 0

            // If the current number of members exceeds the family's max limit,
            // adjust it to the limit and update the input field.
            if (numIntegrantes > limiteMaximo) {
                // Show the error message
                showModal(`Error: El número máximo de integrantes para ${familiaSeleccionada} es de ${limiteMaximo}.`, false);
                numIntegrantes = limiteMaximo; // Adjust the number to the limit
                integrantesInput.value = limiteMaximo; // Update the input field
            }
            // Ensure the number is not negative
            if (numIntegrantes < 0) {
                numIntegrantes = 0;
                integrantesInput.value = 0;
            }

            // Validate that the number is positive and not greater than the limit
            if (numIntegrantes > 0 && numIntegrantes <= limiteMaximo) { 
                for (let i = 0; i < numIntegrantes; i++) {
                    const divFamilia = document.createElement('div');
                    divFamilia.classList.add('familias'); 
                    divFamilia.style.marginBottom = '25px'; // Add bottom margin to separate name fields

                    const inputNombre = document.createElement('input');
                    inputNombre.type = 'text';
                    inputNombre.required = true; // Make the field required
                    inputNombre.name = `integrante${i + 1}`; // Unique name for each input (e.g., integrante1, integrante2)
                    inputNombre.id = `integrante${i + 1}`;     // Unique ID for each input
                    inputNombre.placeholder = ' '; // Needed for the floating label to work

                    const labelNombre = document.createElement('label');
                    labelNombre.htmlFor = `integrante${i + 1}`; // Associate the label with the input
                    labelNombre.textContent = `Nombre de Integrante ${i + 1}`;

                    divFamilia.appendChild(inputNombre);
                    divFamilia.appendChild(labelNombre);
                    nombresContainer.appendChild(divFamilia);
                }
            }
        };

        /**
         * Updates the 'max' attribute of the members input field
         * based on the selected family and calls generarCamposNombres.
         */
        const actualizarLimiteIntegrantes = () => {
            const familiaSeleccionada = familiaSelect.value;

            // Comprobar si la familia ya está registrada
            if (familiasRegistradas.includes(familiaSeleccionada)) {
                showModal(`La Familia "${familiaSeleccionada}" ya está registrada. Por favor, selecciona otra.`, false);
                familiaSelect.value = ""; // Resetea la selección a la opción por defecto
                integrantesInput.max = ""; // Quita el límite
                integrantesInput.value = 0; // Resetea los integrantes
                nombresContainer.innerHTML = ''; // Limpia los campos de nombres
                return; // Detiene la ejecución
            }

            const limite = limitesPorFamilia[familiaSeleccionada];

            if (limite !== undefined) {
                integrantesInput.max = limite; // Set the maximum limit
                // If the current value exceeds the new maximum, adjust it
                if (parseInt(integrantesInput.value, 10) > limite) {
                    integrantesInput.value = limite;
                }
                // Always regenerate fields after a family selection changes or limit adjusts
                generarCamposNombres(); 
            } else {
                integrantesInput.max = ""; // No limit if no family selected or undefined
                integrantesInput.value = 0; // Reset value
                nombresContainer.innerHTML = ''; // Clear name fields
            }
        };

        // Listen for the 'change' event on the family select
        familiaSelect.addEventListener('change', actualizarLimiteIntegrantes);

        // Listen for the 'input' event on the members input to dynamically generate fields
        integrantesInput.addEventListener('input', generarCamposNombres);

        // Call fetchRegisteredFamilies when the DOM is loaded
        fetchRegisteredFamilies();
        // Call actualizarLimiteIntegrantes initially to set up UI based on initial selection (if any)
        actualizarLimiteIntegrantes(); 
    });

    /**
     * Saves form data to Google Sheets and displays a confirmation or error modal.
     * Now includes dynamically generated member names and registration date.
     */
    async function guardarEnGoogleSheets() {
        // Get values from input fields and remove leading/trailing whitespace
        let nombreFamilia = document.getElementById("nombre").value.trim(); // Get value from select
        let numIntegrantes = document.getElementById("integrantes").value.trim();

        // Validate if main fields are empty (including family selection)
        if (!nombreFamilia || nombreFamilia === "" || !numIntegrantes) {
            showModal("Por favor, selecciona una Familia y completa el número de Integrantes.", false);
            return;
        }
        
        // Validate that the number of members is not 0 if a family is selected
        if (parseInt(numIntegrantes, 10) === 0) {
            showModal("El número de integrantes debe ser mayor a 0.", false);
            return;
        }

        // Collect dynamically generated member names
        const nombresIntegrantes = [];
        const inputsNombres = document.querySelectorAll('#nombresIntegrantesContainer input[type="text"]');
        
        // Validar que todos los campos de nombres de integrantes estén llenos
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

        // Get current date and time
        const fechaActual = new Date();
        // Format date for readability in the spreadsheet
        const fechaRegistro = fechaActual.toLocaleDateString('es-ES') + ' ' + fechaActual.toLocaleTimeString('es-ES');

        // Create an object with the data to send
        // Convert the array of names to a comma-separated string for easier sending
        let datos = { 
            familia: nombreFamilia, 
            cantidadIntegrantes: numIntegrantes,
            nombresIntegrantes: nombresIntegrantes.join(', '), 
            fechaRegistro: fechaRegistro // Include the registration date here
        };

        try {
            // Make the POST request to Google Apps Script
            const response = await fetch("https://script.google.com/macros/s/AKfycbwgU0NKR2yOmjBdwB2Y1YjxXxG_AhJdAGPeC89MDEgYv6-LR9ELGKLqdR1ErYPokjHs/exec", {
                method: "POST",
                mode: "no-cors", // Important to avoid CORS issues with Google Apps Script
                headers: {
                    "Content-Type": "application/json" // Indicate that the body is JSON
                },
                body: JSON.stringify(datos) // Convert the data object to a JSON string
            });

            // Due to "mode: no-cors", we cannot read the server's response.
            // We assume the operation was successful if no error was thrown in the fetch.
            // If your Google Apps Sheet script were to return a response you needed to process,
            // you would have to configure CORS in your script or use a proxy.

            // Show success modal and define a callback for redirection and form reset
            showModal("¡Gracias! Tus datos se han guardado exitosamente.", true, () => {
                document.getElementById("miFormulario").reset(); 
                // After resetting, also clear dynamically generated name fields
                document.getElementById('nombresIntegrantesContainer').innerHTML = '';
                // Reset the family select to the initial option
                document.getElementById('nombre').value = ""; // Go back to the disabled option
                // Ensure the member limit is reset
                document.getElementById('integrantes').max = ""; // Clear max attribute
                document.getElementById('integrantes').value = 0; // Reset the value to 0

                // Refetch registered families to update the select options after a successful submission
                fetchRegisteredFamilies(); 

                window.location.href = "https://elegant-sprite-a365ce.netlify.app/"; // Redirect to the desired page
            });
            
        } catch (error) {
            // Catch and handle any error that occurs during the fetch request
            console.error("Error al guardar los datos:", error);
            showModal("Hubo un error al guardar los datos. Por favor, inténtalo nuevamente.", false); // Show error modal
        }
    }
    