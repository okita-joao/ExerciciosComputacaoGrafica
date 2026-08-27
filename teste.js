let coord_xy_pontos_circulo = [];

let vertices_desenho_circulo = [];

let cores_pontos_circulo = [];

const num_pontos_circulo = 4;

const centro_circulo = [0, 0];

const raio = 0.5;

const dx = (2*raio)/num_pontos_circulo;

function add_cor(r, g, b, arrayCores) {
    arrayCores.push(r);
    arrayCores.push(g);
    arrayCores.push(b);
}

let pontos_unicos = [];
let pontos_superiores = [];
let pontos_inferiores = [];

let cores_pontos_unicos = [];
let cores_pontos_superiores = [];
let cores_pontos_inferiores = [];

let x = centro_circulo[0] - raio;
let y = 0.0;
for(let i = 0; i <= num_pontos_circulo; i++) {
    y = Math.sqrt(Math.pow(raio, 2) - Math.pow((x - centro_circulo[0]), 2));
    a = y + centro_circulo[1];
    b = -y + centro_circulo[1];

    if (a != b) {
        pontos_superiores.push([x, a]);
        add_cor(1.0, 0.0, 0.0, cores_pontos_superiores);

        pontos_inferiores.unshift([x, b]);
        add_cor(1.0, 0.0, 0.0, cores_pontos_inferiores);
    }

    else {
        pontos_unicos.push([x, a]);
        add_cor(1.0, 0.0, 0.0, cores_pontos_unicos);
    }
    x = x + dx;
}

console.log(pontos_unicos);
console.log('\n\n');
console.log(pontos_superiores);
console.log('\n\n');
console.log(pontos_inferiores);
console.log('\n\n');

// formatando o Array de pontos da circunferência
coord_xy_pontos_circulo.push(pontos_unicos[0]);

for (let i = 0; i < num_pontos_circulo - 1; i++) {
    coord_xy_pontos_circulo.push(pontos_superiores[i]);
}

coord_xy_pontos_circulo.push(pontos_unicos[1]);

for (let i = 0; i < num_pontos_circulo - 1; i++) {
    coord_xy_pontos_circulo.push(pontos_inferiores[i]);
}

/*
// Desenhando o círculo
for (let i = 0; i < 2*num_pontos_circulo; i++) {
    // Ponto 1
    vertices_desenho_circulo.push(coord_xy_pontos_circulo[i][0]);
    vertices_desenho_circulo.push(coord_xy_pontos_circulo[i][1]);

    // Ponto 2 (Centro do Círculo)
    vertices_desenho_circulo.push(centro_circulo[0]);
    vertices_desenho_circulo.push(centro_circulo[1]);

    // Ponto 3
    vertices_desenho_circulo.push(coord_xy_pontos_circulo[i+1][0]);
    vertices_desenho_circulo.push(coord_xy_pontos_circulo[i+1][1]);
}
*/

const vertices = new Float32Array(coord_xy_pontos_circulo);

const cores = new Float32Array(cores_pontos_circulo);

console.log("Array de Vértices do Círculo:\n");
let X = 0;
for (let i = 0; i < vertices.length/2; i++) {
    console.log(`Ponto (${i+1}): (${vertices[X]}, ${vertices[X+1]})\n`);
    X += 2;
};

console.log("\n\nArray de Cores de cada vértice do círculo:\n");
X = 0;
for(let i = 0; i < cores.length/3; i++) { 
    console.log(`Cor do Ponto (${i+1}): (${cores[X]}, ${cores[X+1]}, ${cores[X+2]})\n`);
    X += 3;
}

