const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec4 uColor;

out vec4 outColor;

void main() {
    outColor = uColor;
}
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
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

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

const positionLocation = gl.getAttribLocation(
    program,
    "aPosition"
);

const colorLocation = gl.getUniformLocation(
    program,
    "uColor"
);

const buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

function draw(vertices, color, mode) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    gl.uniform4f(
        colorLocation,
        color[0],
        color[1],
        color[2],
        1.0
    );

    gl.drawArrays(
        mode,
        0,
        vertices.length / 2
    );
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Cores
const AMARELO = [1.0, 1.0, 0.0];
const AZUL_CLARO = [0.53, 0.81, 0.98];
const ROSA = [1.0, 0.41, 0.71];
const VERDE = [0.0, 1.0, 0.0];

draw([
    -0.95, -0.55,
    -0.45, -0.55,
    -0.45, -0.30,
    -0.95, -0.30
], AMARELO, gl.LINE_LOOP);

draw([
    -0.85, -0.30,
    -0.75, -0.10,
    -0.58, -0.10,
    -0.50, -0.30
], AMARELO, gl.LINE_LOOP);

draw([
    -0.75, -0.28,
    -0.70, -0.14,
    -0.62, -0.14,
    -0.57, -0.28
], AMARELO, gl.LINE_LOOP);

draw([
    -0.88, -0.65,
    -0.78, -0.65,
    -0.78, -0.55,
    -0.88, -0.55
], AMARELO, gl.LINE_LOOP);

draw([
    -0.62, -0.65,
    -0.52, -0.65,
    -0.52, -0.55,
    -0.62, -0.55
], AMARELO, gl.LINE_LOOP);

draw([
    -0.20, -0.70,
    -0.20,  0.00
], VERDE, gl.LINES);

draw([
    -0.20, 0.10,
    -0.20, 0.30
], ROSA, gl.LINES);

draw([
    -0.25, 0.05,
    -0.40, 0.15
], ROSA, gl.LINES);

draw([
    -0.15, 0.05,
     0.00, 0.15
], ROSA, gl.LINES);

draw([
    -0.25, 0.00,
    -0.35, -0.10
], ROSA, gl.LINES);

draw([
    -0.15, 0.00,
    -0.05, -0.10
], ROSA, gl.LINES);

draw([
    -0.25,  0.10,
    -0.15,  0.10,
    -0.15,  0.00,
    -0.25,  0.00
], AMARELO, gl.LINE_LOOP);

draw([
    0.25, 0.20,
    0.65, 0.20,
    0.65, 0.50,
    0.25, 0.50
], AZUL_CLARO, gl.LINE_LOOP);

draw([
    0.20, -0.40,
    0.70, -0.40,
    0.70,  0.15,
    0.20,  0.15
], AZUL_CLARO, gl.LINE_LOOP);

draw([
    0.33, 0.32,
    0.40, 0.32,
    0.40, 0.39,
    0.33, 0.39
], AZUL_CLARO, gl.LINE_LOOP);

draw([
    0.50, 0.32,
    0.57, 0.32,
    0.57, 0.39,
    0.50, 0.39
], AZUL_CLARO, gl.LINE_LOOP);

draw([
    0.35, 0.25,
    0.55, 0.25
], AZUL_CLARO, gl.LINES);

draw([
    0.20, 0.05,
    0.05, -0.15
], AZUL_CLARO, gl.LINES);

draw([
    0.70, 0.05,
    0.85, -0.15
], AZUL_CLARO, gl.LINES);

draw([
    0.33, -0.40,
    0.33, -0.65
], AZUL_CLARO, gl.LINES);

draw([
    0.57, -0.40,
    0.57, -0.65
], AZUL_CLARO, gl.LINES);
</script>
</body>
</html>
