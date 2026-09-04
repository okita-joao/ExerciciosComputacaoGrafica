const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}


// --------------------------------------------------
// TESTANDO CLICK DO MOUSE NA TELA
// --------------------------------------------------

let flag = 0;

let cores = new Float32Array([1.0, 0.0, 0.0]);

// Quantidade de vértices atualmente desenhados na tela (1 para um ponto, N para uma reta)
let numVerticesAtuais = 0;

let verticesReta = new Float32Array([]);

let verticesPonto1 = new Float32Array([0.0, 0.0]);

let verticesPonto1DOM = new Float32Array([0.0, 0.0]);

let verticesPonto2 = new Float32Array([0.0, 0.0]);

const pointSizes = new Float32Array([5.0]);

// Buffer para as coordenadas dos pontos no canvas
const bufferPonto1 = gl.createBuffer();

const bufferPontosReta = gl.createBuffer();

const bufferCores = gl.createBuffer();

// Buffer para o tamanho dos pontos na tela
const bufferSizePontos = gl.createBuffer();

// Atualiza os buffers de cor e de tamanho para conter um valor por vértice,
// repetindo a cor atual ("cores") e o tamanho do ponto (5.0) "numVertices" vezes.
// Isso é necessário porque aColor e aPointSize precisam de um valor para CADA
// vértice desenhado, seja um único ponto ou todos os pontos de uma reta.
function atualizarCorETamanho(numVertices) {
    let coresRepetidas = [];
    let tamanhos = [];
    for (let i = 0; i < numVertices; i++) {
        coresRepetidas.push(cores[0], cores[1], cores[2]);
        tamanhos.push(5.0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCores);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coresRepetidas), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferSizePontos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tamanhos), gl.STATIC_DRAW);
}

// Declarando que a função mouseClick deve ser chamado quando um clique ocorrer
canvas.addEventListener('mousedown', mouseClick);

// Função que desenha a reta com pixels na tela
/**
 * @param {number} x0
 * @param {number} y0
 * @param {number} xf
 * @param {number} yf
 * @returns {Float32Array}
*/

function Bresenham(x0, y0, xf, yf){
    const dx = Math.abs(xf - x0);
    const dy = Math.abs(yf - y0);

    // Abstração : "a" representa o eixo horizontal, e "b" o eixo vertical
    let a0 = x0;
    let b0 = y0;
    let af = xf;
    let bf = yf;
    let passoA = 1;
    let passoB = 1;
    let inverteu = false;

    // se dy > dx inverte a adição nos eixos
    if (dy > dx){
        inverteu = true;
        a0 = y0; b0 = x0;
        af = yf; bf = xf;
    }

    const da = af - a0;
    const db = bf - b0;

    // A reta cresce em x e em y
    if (da > 0 && db > 0){
        // faz nada
    }

    // A reta decresce em x e em y (Basta trocar os pontos no algoritmo)
    else if (da < 0 && db < 0){
        passoA = -1;
        passoB = -1;
    }

    // Caso a inclinação da reta seja negativa
    else if (da > 0 && db < 0){
        passoB = -1;
    }

    else if (da < 0 && db > 0){
        passoA = -1;
    }

    // Casos especiais
    else if (db == 0){
        passoB = 0;
        if (da < 0){
            passoA = -1;
        }
    }

    // Caso de erro
    else{
        console.log("Deu erro kkkkkkkkk");
    }

    let vertices = plotagem(a0, b0, af, bf, passoA, passoB, inverteu);

    for(let i = 0; i < vertices.length; i+=2){
        vertices[i] = (vertices[i] - 300)/300;
        vertices[i+1] = -(vertices[i+1] - 300)/300;
    }

    for(let i = 0; i < vertices.length; i+=2){
        console.log(`ponto ${i+1} = (${vertices[i]}, ${vertices[i+1]})\n`)
    }

    return vertices;
}

/**
 * @param {number} a0
 * @param {number} b0
 * @param {number} af
 * @param {number} bf
 * @param {number} passoA
 * @param {number} passoB
 * @param {boolean} inverteu
 * @returns {Float32Array}
 */
function plotagem(a0, b0, af, bf, passoA, passoB, inverteu){
    let vertices = [];

    if (inverteu){
        vertices.push(b0, a0);
    }
    else{
        vertices.push(a0, b0);
    }

    let a = a0;
    let b = b0;
    
    const da = Math.abs(af - a0);
    const db = Math.abs(bf - b0);

    const _2db = 2*db;
    const _2db_2da = 2*db - 2*da;

    let p = _2db - da;

    for(let i = 0; i < da; i++){
        if (p < 0){
            a += passoA;
            p = p + _2db;
        }
        else{
            a += passoA;
            b += passoB;
            p = p + _2db_2da;
        }

        if (inverteu){
            vertices.push(b, a);
        }
        else{
            vertices.push(a, b);
        }
    }

    return new Float32Array(vertices);
}

// Função que responde ao clique do mouse
function mouseClick(evento){

    const xDOM = evento.offsetX;
    const yDOM = evento.offsetY;

    const x = (xDOM - 300)/300;
    const y = -(yDOM - 300)/300;

    // Captando primeiro clique
    if (flag == 0){
        // Registrando as coordenadas do ponto em DOM
        verticesPonto1DOM[0] = xDOM;
        verticesPonto1DOM[1] = yDOM;

        verticesPonto1[0] = x;
        verticesPonto1[1] = y;

        // Colocando as coordenadas do clique no buffer e mandando para a GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferPonto1);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesPonto1), gl.STATIC_DRAW);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Atualizando cor e tamanho para este único ponto
        numVerticesAtuais = verticesPonto1.length / 2;
        atualizarCorETamanho(numVerticesAtuais);

        // Limpando a tela do canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Desenhando o ponto da tela
        gl.drawArrays(gl.POINTS, 0, numVerticesAtuais);

        flag = 1;

        legenda.innerText = `flag = ${flag}`;
        document.body.appendChild(legenda);
    }

    // Captando segundo clique
    else if (flag == 1){
        flag = 0;

        // traça a reta
        verticesReta = Bresenham(verticesPonto1DOM[0], verticesPonto1DOM[1], xDOM, yDOM);

        // Colocando as coordenadas dos pontos da reta no buffer e mandando para a GPU
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferPontosReta);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesReta), gl.STATIC_DRAW);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Atualizando cor e tamanho para todos os pontos da reta
        numVerticesAtuais = verticesReta.length / 2;
        atualizarCorETamanho(numVerticesAtuais);

        // Limpando a tela do canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Desenhando o ponto da tela
        gl.drawArrays(gl.POINTS, 0, numVerticesAtuais);

        legenda.innerText = `flag = ${flag}`;
        document.body.appendChild(legenda);
    }
}

// --------------------------------------------------
// TESTANDO INTERAÇÃO COM O TECLADO
// --------------------------------------------------

document.addEventListener(
  "keydown",
  keyboardClick,
  false
);

function keyboardClick(event) {
    switch (event.key) {
        case "0":
            cores = new Float32Array([1.0, 1.0, 1.0]);
            colorBox.style.backgroundColor = "white";
            break;
        case "1":
            cores = new Float32Array([1.0, 0.0, 0.0]);
            colorBox.style.backgroundColor = "red";
            break;
        case "2":
            cores = new Float32Array([0.0, 1.0, 0.0]);
            colorBox.style.backgroundColor = "green";
            break;
        case "3":
            cores = new Float32Array([0.0, 0.0, 1.0]);
            colorBox.style.backgroundColor = "blue";
            break;
        case "4":
            cores = new Float32Array([1.0, 1.0, 0.0]);
            colorBox.style.backgroundColor = "yellow";
            break;
        case "5":
            cores = new Float32Array([1.0, 0.0, 1.0]);
            colorBox.style.backgroundColor = "magenta";
            break;
        case "6":
            cores = new Float32Array([0.0, 1.0, 1.0]);
            colorBox.style.backgroundColor = "cyan";
            break;
        case "7":
            cores = new Float32Array([1.0, 0.5, 0.0]);
            colorBox.style.backgroundColor = "orange";
            break;
        case "8":
            cores = new Float32Array([0.5, 0.0, 1.0]);
            colorBox.style.backgroundColor = "purple";
            break;
        case "9":
            cores = new Float32Array([1.0, 0.4, 0.7]);
            colorBox.style.backgroundColor = "pink";
            break;
        default:
            return;
    }

    // Atualizar os buffers de cor e de tamanho para todos os vértices já desenhados
    atualizarCorETamanho(numVerticesAtuais);

    // Redesenhar
    drawScene();
}

// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;
in float aPointSize;

out vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    gl_PointSize = aPointSize;
    vColor = aColor;
}

`;


// --------------------------------------------------
// 4. FRAGMENT SHADER
// --------------------------------------------------

const fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;

out vec4 outColor;

void main() {
    outColor = vec4(vColor, 1.0);
}

`;


// --------------------------------------------------
// 5. COMPILAR SHADERS
// --------------------------------------------------

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        const error = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}


const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// 7. LOCAL DO ATRIBUTO
// --------------------------------------------------

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );

const pointSizeLocation = 
    gl.getAttribLocation(
        program, 
        "aPointSize"
    );

const colorLocation =
    gl.getAttribLocation(
        program,
        "aColor"
    );

// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTO
// --------------------------------------------------

gl.bindBuffer(gl.ARRAY_BUFFER, bufferPonto1);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);



gl.bindBuffer(gl.ARRAY_BUFFER, bufferCores);

gl.enableVertexAttribArray(colorLocation);

gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);



gl.bindBuffer(gl.ARRAY_BUFFER, bufferSizePontos);

gl.enableVertexAttribArray(pointSizeLocation);
    
gl.vertexAttribPointer(pointSizeLocation, 1, gl.FLOAT, false, 0, 0);

// --------------------------------------------------
// 9. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------

gl.useProgram(program);

function drawScene(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    if (numVerticesAtuais > 0) {
        gl.drawArrays(gl.POINTS, 0, numVerticesAtuais);
    }
}

drawScene();

// --------------------------------------------------
// 11. ADICIONANDO LEGENDA
// --------------------------------------------------

// Cria um novo elemento de texto
const legenda = document.createElement('div');

// Define o texto da legenda
legenda.innerText = `flag = ${flag}`;

// Aplica estilos para posicionar na tela
legenda.style.position = 'absolute';
legenda.style.color = 'white';
legenda.style.backgroundColor = 'rgba(0, 0, 0, 1.0)';
legenda.style.padding = '10px';
legenda.style.left = '8px'; // Distância da esquerda
legenda.style.top = '615px';  // Distância do topo

// Injeta a legenda na página (dentro do body)
document.body.appendChild(legenda);

// Cria a caixinha que mostra a cor atualmente selecionada (usada em keyboardClick)
const colorBox = document.createElement('div');
colorBox.style.position = 'absolute';
colorBox.style.width = '30px';
colorBox.style.height = '30px';
colorBox.style.left = '8px';
colorBox.style.top = '570px';
colorBox.style.border = '2px solid white';
colorBox.style.backgroundColor = 'red'; // mesma cor inicial de "cores"
document.body.appendChild(colorBox);