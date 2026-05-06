// Só para conferir no console se o JS carregou
console.log("Script JS carregado!");

// Pega o formulário pelo id="gradeForm"
const form = document.getElementById("gradeForm");

// Pega a lista <ul> onde os alunos serão exibidos
const lista = document.getElementById("listaAlunos");

// Tenta carregar o array "alunos" do localStorage
// Se não existir nada salvo, usa um array vazio []
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

// Guarda o índice do aluno que está sendo editado
// -1 significa que não estamos editando ninguém (modo cadastrar)
let indiceEditando = -1;

// Função para salvar o array alunos no localStorage
function salvarAlunos() {
  // Converte o array para string JSON e salva com a chave "alunos"
  localStorage.setItem("alunos", JSON.stringify(alunos));
}

// Função para desenhar a lista de alunos na tela
function mostrarAlunos() {
  console.log("Desenhando lista, qtd alunos:", alunos.length);

  // Limpa tudo que tem dentro da <ul> antes de redesenhar
  lista.innerHTML = "";

  // Percorre cada aluno do array
  alunos.forEach((aluno, index) => {
    // Cria um <li> para o aluno
    const li = document.createElement("li");

    // Garante que temos uma média numérica
    // Se aluno.media já é número, usa ele
    // Senão, recalcula a média pelas notas (isso ajuda com dados antigos)
    let media = typeof aluno.media === "number"
      ? aluno.media
      : (Number(aluno.nota1) + Number(aluno.nota2) + Number(aluno.nota3)) / 3;

    // Define o status Aprovado/Reprovado com base na média
    const status = media >= 7 ? "Aprovado" : "Reprovado";

    // Define o HTML interno do <li>
    // Mostra nome, notas, média, status e dois botões: Editar e Excluir
    li.innerHTML = `
      <strong>${aluno.nome}</strong>
      <div>Notas: ${aluno.nota1}, ${aluno.nota2}, ${aluno.nota3}</div>
      <div>Média: ${media.toFixed(2)} - <span class="status">${status}</span></div>
      <div>
        <button onclick="editarAluno(${index})">Editar</button>
        <button onclick="excluirAluno(${index})">Excluir</button>
      </div>
    `;

    // Adiciona o <li> dentro da lista <ul>
    lista.appendChild(li);
  });
}

// Quando o formulário for enviado (clique no botão "Salvar / Atualizar")
form.addEventListener("submit", function (event) {
  // Impede o comportamento padrão do form (recarregar a página)
  event.preventDefault();
  console.log("Submit foi chamado!");

  // Lê os valores digitados nos campos
  const nome = document.getElementById("nome").value.trim();
  const nota1 = Number(document.getElementById("nota1").value);
  const nota2 = Number(document.getElementById("nota2").value);
  const nota3 = Number(document.getElementById("nota3").value);

  // Calcula a média das 3 notas
  const media = (nota1 + nota2 + nota3) / 3;

  // Cria um objeto aluno com os dados
  const aluno = { nome, nota1, nota2, nota3, media };

  // Se NÃO estiver editando (indiceEditando === -1), adiciona novo aluno
  if (indiceEditando === -1) {
    alunos.push(aluno);
  } else {
    // Se estiver editando, substitui o aluno na posição indiceEditando
    alunos[indiceEditando] = aluno;
    // Volta para modo "cadastrar"
    indiceEditando = -1;
  }

  console.log("ALUNOS AGORA:", alunos);

  // Salva o array atualizado no localStorage
  salvarAlunos();

  // Limpa os campos do formulário
  form.reset();

  // Atualiza a lista na tela
  mostrarAlunos();
});

// Função chamada quando o usuário clica no botão "Editar"
function editarAluno(index) {
  // Pega o aluno correspondente ao índice
  const aluno = alunos[index];

  // Preenche os campos do formulário com os dados do aluno
  document.getElementById("nome").value = aluno.nome;
  document.getElementById("nota1").value = aluno.nota1;
  document.getElementById("nota2").value = aluno.nota2;
  document.getElementById("nota3").value = aluno.nota3;

  // Marca que estamos editando este índice
  indiceEditando = index;
}

// Função chamada quando o usuário clica no botão "Excluir"
function excluirAluno(index) {
  // Remove 1 item do array, na posição "index"
  alunos.splice(index, 1);

  // Salva o array atualizado no localStorage
  salvarAlunos();

  // Atualiza a lista na tela
  mostrarAlunos();
}

// Quando a página carrega pela primeira vez,
// desenha a lista com o que estiver salvo no localStorage
mostrarAlunos();