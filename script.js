document.addEventListener('DOMContentLoaded', () => {

    const BOARD_SIZE = 15;
    const RACK_SIZE = 9;
        
    // Distribución de letras y puntos (Español estándar aproximado)
    const TILE_DISTRIBUTION = {
        'A': { count: 12, score: 1 }, 'E': { count: 12, score: 1 },
        'O': { count: 9, score: 1 }, 'R': { count: 7, score: 1 },
        'S': { count: 6, score: 1 }, 'I': { count: 5, score: 1 },
        'M': { count: 5, score: 1 }, 'U': { count: 4, score: 1 },
        'T': { count: 5, score: 1 }, 'C': { count: 4, score: 1 },
        'N': { count: 4, score: 3 }, 'P': { count: 4, score: 2 },
        'L': { count: 2, score: 2 }, 'D': { count: 2, score: 3 },
        'V': { count: 2, score: 3 }, 'G': { count: 2, score: 3 },
        'H': { count: 2, score: 4 }, 'Z': { count: 1, score: 4 },
        'F': { count: 1, score: 4 }, 'B': { count: 1, score: 4 },
        'Ç': { count: 1, score: 5 }, // Nota: Q casi siempre necesita U
        'Q': { count: 1, score: 8 }, 'Ã': { count: 1, score: 8 },
        'J': { count: 1, score: 8 }, 'X': { count: 1, score: 10 },

    };
        
    const SPECIAL_SQUARES = {
        '0,0': 'tw', '0,7': 'tw', '0,14': 'tw',
        '7,0': 'tw', '7,14': 'tw',
        '14,0': 'tw', '14,7': 'tw', '14,14': 'tw',
        '1,1': 'dw', '2,2': 'dw', '3,3': 'dw', '4,4': 'dw',
        '13,1': 'dw', '12,2': 'dw', '11,3': 'dw', '10,4': 'dw',
        '1,13': 'dw', '2,12': 'dw', '3,11': 'dw', '4,10': 'dw',
        '13,13': 'dw', '12,12': 'dw', '11,11': 'dw', '10,10': 'dw',
        '7,7': 'start', // Centro es DW
        '0,3': 'dl', '0,11': 'dl', '2,6': 'dl', '2,8': 'dl',
        '3,0': 'dl', '3,7': 'dl', '3,14': 'dl', '6,2': 'dl',
        '6,6': 'dl', '6,8': 'dl', '6,12': 'dl', '7,3': 'dl',
        '7,11': 'dl', '8,2': 'dl', '8,6': 'dl', '8,8': 'dl',
        '8,12': 'dl', '11,0': 'dl', '11,7': 'dl', '11,14': 'dl',
        '12,6': 'dl', '12,8': 'dl', '14,3': 'dl', '14,11': 'dl',
        '1,5': 'tl', '1,9': 'tl', '5,1': 'tl', '5,5': 'tl',
        '5,9': 'tl', '5,13': 'tl', '9,1': 'tl', '9,5': 'tl',
        '9,9': 'tl', '9,13': 'tl', '13,5': 'tl', '13,9': 'tl'
    };
        
            // Diccionario BÁSICO (¡Ampliar considerablemente!)
    const DICTIONARY = new Set([
        "SER", "SOU", "ES", "E", "SOMOS", "SOIS", "SÃO", "FUI", "FOI", "FOMOS", "FORAM", 
        "ESTAR", "ESTOU", "ESTAS", "ESTA", "ESTAMOS", "ESTAIS", "ESTÃO", "ESTIVE", "ESTIVESTE", "ESTEVE", "ESTIVEMOS", "ESTIVERAM",
        "TER", "TENHO", "TENS", "TEM", "TEMOS", "TENDES", "TEM", "TIVE", "TIVESTE", "TEVE", "TIVEMOS", "TIVERAM",
        "FAZER", "FAÇO", "FAZES", "FAZ", "FAZEMOS", "FAZEIS", "FAZEM", "FIZ", "FIZESTE", "FEZ", "FIZEMOS", "FIZERAM",
        "PODER", "POSSO", "PODES", "PODE", "PODEMOS", "PODEIS", "PODEM", "PUDE", "PUDESTE", "PODE", "PUDEMOS", "PUDERAM",
        "DIZER", "DIGO", "DIZES", "DIZ", "DIZEMOS", "DIZEIS", "DIZEM", "DISSE", "DISSESTE", "DISSE", "DISSEMOS", "DISSERAM",
        "IR", "VOU", "VAIS", "VAI", "VAMOS", "IDES", "VÃO", "FUI", "FOSTE", "FOI", "FOMOS", "FORAM",
        "VER", "VEJO", "VES", "VÊ", "VEMOS", "VEDE", "VEEM", "VI", "VISTE", "VIU", "VIMOS", "VIRAM",
        "DAR", "DOU", "DÁS", "DÁ", "DAMOS", "DAIS", "DÃO", "DEI", "DESTE", "DEU", "DEMOS", "DERAM",
        "SABER", "SEI", "SABES", "SABE", "SABEMOS", "SABEIS", "SABEM", "SOUBE", "SOUBESTE", "SOUBE", "SOUBEMOS", "SOUBERAM",
        "QUERER", "QUERO", "QUERES", "QUER", "QUEREMOS", "QUEREIS", "QUEREM", "QUIS", "QUISESTE", "QUIS", "QUISEMOS", "QUISERAM",
        "CHEGAR", "CHEGO", "CHEGAS", "CHEGA", "CHEGAMOS", "CHEGAIS", "CHEGAM", "CHEGUEI", "CHEGASTE", "CHEGOU", "CHEGAMOS", "CHEGARAM",
        "PASSAR", "PASSO", "PASSAS", "PASSA", "PASSAMOS", "PASSAIS", "PASSAM", "PASSEI", "PASSASTE", "PASSOU", "PASSAMOS", "PASSARAM",
        "DEVER", "DEVO", "DEVES", "DEVE", "DEVEMOS", "DEVEIS", "DEVEM", "DEVIA", "DEVIAMOS", "DEVIAM",
        "COLOCAR", "COLOCO", "COLOCAS", "COLOCA", "COLOCAMOS", "COLOCAIS", "COLOCAM", "COLOQUEI", "COLOCASTE", "COLOCOU", "COLOCAMOS", "COLOCARAM",
        "PARECER", "PAREÇO", "PARECES", "PARECE", "PARECEMOS", "PARECEIS", "PARECEM", "PARECI", "PARECESTE", "PARECEU", "PARECEMOS", "PARECERAM",
        "FICAR", "FICO", "FICAS", "FICA", "FICAMOS", "FICAIS", "FICAM", "FIQUEI", "FICASTE", "FICOU", "FICAMOS", "FICARAM",
        "ACREDITAR", "ACREDITO", "ACREDITAS", "ACREDITA", "ACREDITAMOS", "ACREDITAIS", "ACREDITAM", "ACREDITEI", "ACREDITASTE", "ACREDITOU", "ACREDITAMOS", "ACREDITARAM",
        "FALAR", "FALO", "FALAS", "FALA", "FALAMOS", "FALAIS", "FALAM", "FALEI", "FALASTE", "FALOU", "FALAMOS", "FALARAM",
        "LEVAR", "LEVO", "LEVAS", "LEVA", "LEVAMOS", "LEVAIS", "LEVAM", "LEVEI", "LEVASTE", "LEVOU", "LEVAMOS", "LEVARAM", 
        "DEIXAR", "DEIXO", "DEIXAS", "DEIXA", "DEIXAMOS", "DEIXAIS", "DEIXAM", "DEIXEI", "DEIXASTE", "DEIXOU", "DEIXAMOS", "DEIXARAM",
        "SEGUIR", "SIGO", "SEGUES", "SEGUE", "SEGUIMOS", "SEGUIS", "SEGUEM", "SEGUEI", "SEGUESTE", "SEGUIU", "SEGUIMOS", "SEGUIRAM",
        "ENCONTRAR", "ENCONTRO", "ENCONTRAS", "ENCONTRA", "ENCONTRAMOS", "ENCONTRAIS", "ENCONTRAM", "ENCONTREI", "ENCONTRASTE", "ENCONTROU", "ENCONTRAMOS", "ENCONTRARAM",
        "CHAMAR", "CHAMO", "CHAMAS", "CHAMA", "CHAMAMOS", "CHAMAIS", "CHAMAM", "CHAMEI", "CHAMASTE", "CHAMOU", "CHAMAMOS", "CHAMARAM",
        "VIR", "VENHO", "VENS", "VEM", "VIMOS", "VINDES", "VÊM", "VIM", "VINHAS", "VINHA", "VINHAMOS", "VINHAM",
        "PENSAR", "PENSO", "PENSAS", "PENSA", "PENSAMOS", "PENSAIS", "PENSAM", "PENSEI", "PENSASTE", "PENSOU", "PENSAMOS", "PENSARAM",
        "SAIR", "SAIO", "SAIS", "SAI", "SAIMOS", "SAIS", "SAEM", "SAI", "SAISTE", "SAIU", "SAIMOS", "SAIRAM",
        "VOLTAR", "VOLTO", "VOLTAS", "VOLTA", "VOLTAMOS", "VOLTAIS", "VOLTAM", "VOLTEI", "VOLTASTE", "VOLTOU", "VOLTAMOS", "VOLTARAM",
        "PEGAR", "PEGO", "PEGAS", "PEGA", "PEGAMOS", "PEGAIS", "PEGAM", "PEGUEI", "PEGASTE", "PEGOU", "PEGAMOS", "PEGARAM",
        "CONHECER", "CONHEÇO", "CONHECES", "CONHECE", "CONHECEMOS", "CONHECEIS", "CONHECEM", "CONHECI", "CONHECESTE", "CONHECEU", "CONHECEMOS", "CONHECERAM",
        "VIVER", "VIVO", "VIVES", "VIVE", "VIVEMOS", "VIVEIS", "VIVEM", "VIVI", "VIVESTE", "VIVEU", "VIVEMOS", "VIVERAM",
        
        "SENTIR", "TRATAR", "OLHAR", "CONTAR", "COMEÇAR", "ESPERAR",
        "PROCURAR", "ENTRAR", "TRABALHAR", "ESCREVER", "PERDER", "PRODUZIR",
        "OCORRER", "RECEBER", "LEMBRAR", "TERMINAR", "PERMITIR", "APARECER",
        "CONSEGUIR", "INICIAR", "SERVIR", "TIRAR", "PRECISAR", "MANTER",
        "RESULTAR", "LER", "CAIR", "MUDAR", "APRESENTAR", "CRIAR", "ABRIR",
        "CONSIDERAR", "OUVIR", "ACABAR", "CONVERTER", "GANHAR", "FORMAR", "TRAZER",
        "PARTIR", "MORRER", "ACEITAR", "REALIZAR", "SUPOR", "COMPREENDER",
        "CONSEGUIR", "EXPLICAR", "PERGUNTAR", "TOCAR", "RECONHECER", "ESTUDAR",
        "ALCANÇAR", "NASCER", "DIRIGIR", "CORRER", "UTILIZAR", "PAGAR", "AJUDAR",
        "GOSTAR", "JOGAR", "OUVIR", "CUMPRIR", "OFERECER", "DESCOBRIR",
        "LEVANTAR", "TENTAR", 'BALAR', 'VOAR', 'DANÇAR', 'PULAR', 'LIGAR', 'VIAJAR',
        'DESEJAR', 'COMPRAR', 'MANDAR', 'JULGAR', 'PARTICIPAR', 'CONVIDAR', 'CAMINHAR',
        'NADAR', 'BUSCAR', 'INFORMAR', 'MORAR', 'USAR', 'DORMIR', 'ACORDAR', 'PARAR',
        'LAVAR', 'LEVAR', 'AVISAR', 'ESPERAR', 'POSSUIR', 

        'AMO', 'AMA', 'AMAS', 'AMAMOS', 'AMAM', 'AMEI', 'AMASTE', 'AMOU', 'AMÁMOS', 'AMASTES', 'AMARAM', 'AMAVA',
        'AMADO', 'AMAREI', 'AMARAS', 'AMAREMOS', 'AMARÃO',
        'ESTUDO','ESTUDA','ESTUDAMOS','ESTUDAM','ESTUDEI','ESTUDASTE','ESTUDOU','ESTUDÁMOS','ESTUDARAM','ESTUDAVA',
        'ESTUDARA','ESTUDÁRAMOS','ESTUDARAM',
        'BRINCO','BRINCA','BRINCAMOS','BRINCAM','BRINQUEI','BRINCOU','BRINCAMOS','BRINCARAM',
        ]);
        

    // --- Estado del Juego ---
    let tileBag = [];
    let playerRack = []; // Contendrá objetos { id: uniqueId, letter: 'A', score: 1 }
    let boardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)); // null o { letter: 'A', score: 1 }
    let placedTilesThisTurn = []; // Guarda { tile, row, col } de las fichas puestas en este turno
    let totalScore = 0;
    let turnScore = 0;
    let tileCounter = 0; // Para IDs únicos de fichas

    // --- Elementos del DOM ---
    const boardElement = document.getElementById('game-board');
    const rackElement = document.getElementById('player-rack').querySelector('.tiles');
    const turnScoreElement = document.getElementById('turn-score');
    const totalScoreElement = document.getElementById('total-score');
    const tilesLeftElement = document.getElementById('tiles-left');
    const messageElement = document.getElementById('message');
    const playWordBtn = document.getElementById('play-word-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const resetBtn = document.getElementById('reset-btn');
    const recallBtn = document.getElementById('recall-btn');


    // --- Funciones del Juego ---

    function createTileBag() {
        tileBag = [];
        for (const letter in TILE_DISTRIBUTION) {
            const data = TILE_DISTRIBUTION[letter];
            for (let i = 0; i < data.count; i++) {
                tileBag.push({ letter: letter, score: data.score });
            }
        }
        shuffleArray(tileBag);
        updateTilesLeft();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Intercambio
        }
    }

    function drawTiles(count) {
        const drawn = [];
        for (let i = 0; i < count && tileBag.length > 0; i++) {
            const tileData = tileBag.pop();
            drawn.push({ id: `tile-${tileCounter++}`, ...tileData });
        }
        updateTilesLeft();
        return drawn;
    }

     function updateTilesLeft() {
        tilesLeftElement.textContent = tileBag.length;
    }

    function renderBoard() {
        boardElement.innerHTML = ''; // Limpiar tablero
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = document.createElement('div');
                cell.classList.add('board-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                // Añadir clases de casillas especiales
                const specialKey = `${r},${c}`;
                if (SPECIAL_SQUARES[specialKey]) {
                    cell.classList.add(SPECIAL_SQUARES[specialKey]);
                    let text = SPECIAL_SQUARES[specialKey].toUpperCase();
                    if (text === 'START') text = '★'; // Estrella para el centro
                    cell.textContent = text;
                }

                // Añadir ficha si existe en el estado
                if (boardState[r][c]) {
                    const tileElement = createTileElement(boardState[r][c], false); // No draggable desde el tablero
                    cell.appendChild(tileElement);
                    cell.textContent = ''; // Ocultar texto de casilla especial si hay ficha
                } else {
                     // Hacer la celda un destino de drop
                    cell.addEventListener('dragover', handleDragOver);
                    cell.addEventListener('drop', handleDrop);
                }

                boardElement.appendChild(cell);
            }
        }
    }


    function createTileElement(tileData, isDraggable = true) {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        tileElement.dataset.id = tileData.id; // Guardar el ID único
        tileElement.dataset.letter = tileData.letter;
        tileElement.dataset.score = tileData.score;

        const letterSpan = document.createElement('span');
        letterSpan.textContent = tileData.letter;
        tileElement.appendChild(letterSpan);

        const scoreSpan = document.createElement('span');
        scoreSpan.classList.add('score');
        scoreSpan.textContent = tileData.score;
        tileElement.appendChild(scoreSpan);

        if (isDraggable) {
            tileElement.draggable = true;
            tileElement.addEventListener('dragstart', handleDragStart);
            tileElement.addEventListener('dragend', handleDragEnd);
        }

        return tileElement;
    }

    function renderRack() {
        rackElement.innerHTML = ''; // Limpiar atril
        playerRack.forEach(tileData => {
            const tileElement = createTileElement(tileData);
            rackElement.appendChild(tileElement);
        });
    }

     function updateScores(newTurnScore = 0) {
        turnScore = newTurnScore; // Actualiza la puntuación del turno actual
        turnScoreElement.textContent = turnScore;
        totalScoreElement.textContent = totalScore; // Muestra la puntuación total acumulada
    }

    function displayMessage(msg, isError = false) {
        messageElement.textContent = msg;
        messageElement.style.color = isError ? '#d32f2f' : '#333'; // Rojo para errores, negro normal
    }

    // --- Lógica de Arrastrar y Soltar ---
    let draggedTileData = null; // Guarda la info de la ficha arrastrada
    let sourceElement = null; // Guarda el elemento DOM original

    function handleDragStart(event) {
        const tileElement = event.target;
        // Buscar la ficha en el atril por su ID único
        draggedTileData = playerRack.find(t => t.id === tileElement.dataset.id);
        if (draggedTileData) {
            event.dataTransfer.setData('text/plain', tileElement.dataset.id); // Necesario para Firefox
            event.dataTransfer.effectAllowed = 'move';
            tileElement.classList.add('dragging'); // Estilo visual
            sourceElement = tileElement; // Guarda referencia al elemento original
        } else {
            event.preventDefault(); // No arrastrar si no se encontró (raro)
        }
    }

     function handleDragEnd(event) {
        // Limpiar estilo de arrastre independientemente de dónde se soltó
        event.target.classList.remove('dragging');
        // No limpiar draggedTileData aquí, se necesita en handleDrop
    }

    function handleDragOver(event) {
        event.preventDefault(); // Necesario para permitir el drop
        event.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(event) {
        event.preventDefault();
        const cell = event.target.closest('.board-cell'); // Asegura que el drop sea en una celda

        if (cell && !cell.querySelector('.tile') && draggedTileData) { // Si la celda está vacía y hay una ficha arrastrándose
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            // 1. Mover la ficha del atril al estado temporal 'placedTilesThisTurn'
            const tileIndex = playerRack.findIndex(t => t.id === draggedTileData.id);
            if (tileIndex > -1) {
                const [movedTile] = playerRack.splice(tileIndex, 1); // Quitar del atril
                placedTilesThisTurn.push({ tile: movedTile, row, col }); // Añadir a temporales

                // 2. Crear el elemento visual de la ficha en la celda del tablero
                const tileElement = createTileElement(movedTile, false); // No draggable en tablero
                cell.innerHTML = ''; // Limpiar texto (DW, etc.) antes de poner ficha
                cell.appendChild(tileElement);

                 // 3. Quitar el elemento original del atril (visualmente)
                sourceElement?.remove(); // Quita el elemento del DOM del rack

                // 4. Limpiar estado de arrastre
                draggedTileData = null;
                sourceElement = null;
                renderRack(); // Re-renderizar atril para reflejar el cambio
                displayMessage("Ficha colocada. Añade más o presiona 'Jugar Palabra'.");
                calculateTemporaryScore(); // Calcular puntuación temporal

            } else {
                 displayMessage("Error: La ficha no se encontró en el atril.", true);
            }
        } else if (cell && cell.querySelector('.tile')) {
             displayMessage("Error: La casilla ya está ocupada.", true);
        } else if (!draggedTileData) {
            // Si se suelta fuera o no había nada arrastrando, no hacer nada especial.
            // handleDragEnd limpiará el estado visual.
        }
         // Asegurar que la referencia se limpie si el drop no fue exitoso
        if (draggedTileData) {
             sourceElement?.classList.remove('dragging');
             draggedTileData = null;
             sourceElement = null;
        }

    }

    // --- Lógica de Validación y Puntuación (Simplificada) ---

    function calculateTemporaryScore() {
        // Esta es una versión MUY simplificada para dar feedback inmediato.
        // No valida palabras ni conexiones, solo suma puntos de fichas puestas.
        let tempScore = 0;
        let wordMultiplier = 1;

        for (const placed of placedTilesThisTurn) {
            let letterScore = placed.tile.score;
            const specialKey = `${placed.row},${placed.col}`;
            const modifier = SPECIAL_SQUARES[specialKey];

            if (modifier === 'dl') letterScore *= 2;
            if (modifier === 'tl') letterScore *= 3;
            if (modifier === 'dw' || modifier === 'start') wordMultiplier *= 2;
            if (modifier === 'tw') wordMultiplier *= 3;

            tempScore += letterScore;
        }

        turnScore = tempScore * wordMultiplier;
        updateScores(turnScore); // Actualiza solo la puntuación del turno en la UI
    }


    function validateAndScorePlacement() {
        if (placedTilesThisTurn.length === 0) {
            displayMessage("Coloca al menos una ficha.", true);
            return false; // No hay nada que jugar
        }

        // Simplificación Extrema:
        // 1. Asume que todas las fichas forman una sola línea (horizontal o vertical).
        // 2. Construye la palabra formada por esas fichas.
        // 3. Verifica si esa palabra está en el diccionario BÁSICO.
        // 4. Calcula el puntaje (ya calculado en calculateTemporaryScore).
        // ¡ESTO NO VALIDA CONEXIONES, PALABRAS CRUZADAS NI POSICIONES CORRECTAS!

        let word = "";
        let score = 0;
        let wordMultiplier = 1;
        let isValid = false;

        // Ordenar fichas para formar la palabra (asumiendo línea recta)
         placedTilesThisTurn.sort((a, b) => a.row === b.row ? a.col - b.col : a.row - b.row);

        let formedWord = placedTilesThisTurn.map(p => p.tile.letter).join('');

        // Validación Muy Básica
        if (DICTIONARY.has(formedWord.toUpperCase())) {
            isValid = true;
            // Re-calcular score correctamente aquí si es necesario,
            // o confiar en el cálculo temporal si es suficiente para esta versión.
            calculateTemporaryScore(); // Re-calcula por si acaso y actualiza 'turnScore'
            score = turnScore; // Usa la puntuación calculada
             displayMessage(`Palabra "${formedWord}" válida! Puntos: ${score}`);

        } else {
            displayMessage(`Palabra "${formedWord}" NO encontrada en el diccionario básico.`, true);
            isValid = false;
        }

        if (isValid) {
             // Confirmar el movimiento
            totalScore += score; // Añadir al total
            placedTilesThisTurn.forEach(placed => {
                // Marcar la ficha como permanente en boardState
                boardState[placed.row][placed.col] = { letter: placed.tile.letter, score: placed.tile.score };
                // Desactivar el drop en la celda ocupada permanentemente
                 const cellElement = boardElement.querySelector(`.board-cell[data-row="${placed.row}"][data-col="${placed.col}"]`);
                if(cellElement) {
                    cellElement.removeEventListener('dragover', handleDragOver);
                    cellElement.removeEventListener('drop', handleDrop);
                }
            });

             // Reponer fichas en el atril
             const needed = RACK_SIZE - playerRack.length;
             const newTiles = drawTiles(needed);
             playerRack.push(...newTiles);

             placedTilesThisTurn = []; // Limpiar fichas temporales
             renderRack();
             updateScores(0); // Resetea la puntuación del turno para el siguiente


        } else {
             // Si no es válido, devolver fichas al atril
            // recallTiles(); // No llamar a recall, ya que el usuario puede querer intentar otra cosa
             // El usuario debe presionar "Devolver Fichas" manualmente si quiere deshacer
        }
        return isValid;

    }

    // --- Acciones de Botones ---

    playWordBtn.addEventListener('click', () => {
       validateAndScorePlacement();
        // La validación ya actualiza el score total, repone fichas y renderiza si es válida.
    });

    shuffleBtn.addEventListener('click', () => {
        if (placedTilesThisTurn.length > 0) {
            displayMessage("Devuelve las fichas al atril antes de mezclar.", true);
            return;
        }
        shuffleArray(playerRack);
        renderRack();
        displayMessage("Atril mezclado.");
    });

    resetBtn.addEventListener('click', () => {
        if (confirm("¿Estás seguro de que quieres empezar un nuevo juego? Se perderá el progreso actual.")) {
            initGame();
        }
    });

    recallBtn.addEventListener('click', recallTiles); // Conectar botón

     function recallTiles() {
        if (placedTilesThisTurn.length === 0) {
            displayMessage("No hay fichas en el tablero para devolver.");
            return;
        }
        // Devolver fichas de placedTilesThisTurn al playerRack
        placedTilesThisTurn.forEach(placed => {
            playerRack.push(placed.tile); // Devolver al array del atril

            // Limpiar la celda en el tablero (visualmente)
            const cellElement = boardElement.querySelector(`.board-cell[data-row="${placed.row}"][data-col="${placed.col}"]`);
            if (cellElement) {
                cellElement.innerHTML = ''; // Quitar la ficha visual
                // Restaurar el texto de la casilla especial si lo había
                const specialKey = `${placed.row},${placed.col}`;
                 if (SPECIAL_SQUARES[specialKey]) {
                    let text = SPECIAL_SQUARES[specialKey].toUpperCase();
                    if (text === 'START') text = '★';
                    cellElement.textContent = text;
                }
                 // Volver a habilitar el drop en la celda
                 cellElement.addEventListener('dragover', handleDragOver);
                 cellElement.addEventListener('drop', handleDrop);
            }
        });

        placedTilesThisTurn = []; // Vaciar el array de fichas temporales
        renderRack(); // Actualizar el atril visualmente
        updateScores(0); // Resetear puntuación del turno
        displayMessage("Fichas devueltas al atril.");
    }


    // --- Inicialización del Juego ---
    function initGame() {
        createTileBag();
        playerRack = drawTiles(RACK_SIZE);
        boardState = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
        placedTilesThisTurn = [];
        totalScore = 0;
        turnScore = 0;
        tileCounter = 0; // Resetear contador de IDs

        renderBoard();
        renderRack();
        updateScores();
        updateTilesLeft();
        displayMessage("Nuevo juego iniciado. ¡Coloca tus fichas!");
    }

    // Iniciar el juego al cargar la página
    initGame();

});