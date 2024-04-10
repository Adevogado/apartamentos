const apartamentos = [
  {
    id: 1,
    nome: "Apartamento 1",
    preco: 2000,
    regiao: "Centro",
    tamanho: 100,
    endereco: "Rua A, 123",
    quartos: 2,
    banheiros: 1,
    contato: "1234567890",
    fotos: ["./fotos/casa.jpg"],
  },
  {
    id: 2,
    nome: "Apartamento 2",
    preco: 3000,
    regiao: "Contagem",
    tamanho: 100,
    endereco: "Rua B, 567",
    quartos: 2,
    banheiros: 1,
    contato: "1234567890",
    fotos: ["./fotos/casa2.jpeg"],
  },
  {
    id: 3,
    nome: "Apartamento 3",
    preco: 4000,
    regiao: "BH",
    tamanho: 100,
    endereco: "Rua C, 890",
    quartos: 2,
    banheiros: 1,
    contato: "1234567890",
    fotos: ["./fotos/casa3.jpg", "./fotos/casa3-1.jpg"],
  },
  // Adicione mais apartamentos conforme necessário
];
// Função para exibir os cards de apartamento na página
// Função para exibir os apartamentos na tela
function exibirApartamentos(apartamentos) {
  const container = document.getElementById("apartamentos-container");
  container.innerHTML = "";

  apartamentos.forEach((apartamento) => {
    const card = document.createElement("div");
    card.classList.add("card", "mt-3", "p-3", "bg-light");
    console.log(JSON.stringify(apartamento));
    card.innerHTML = `
            <h3 class="card-title">${apartamento.nome}</h3>
            <p class="card-text">Preço: R$ ${apartamento.preco}</p>
            <p class="card-text">Região: ${apartamento.regiao}</p>
            <button class="btn btn-primary btn-ver-detalhes" data-id="${apartamento.id}">Ver Detalhes</button>
        `;

    container.appendChild(card);
  });
}

// Função para filtrar apartamentos pelo nome
function filtrarApartamentosPorNome(nome) {
  const resultadoFiltrado = apartamentos.filter((apartamento) =>
    apartamento.nome.toLowerCase().includes(nome.toLowerCase())
  );
  exibirApartamentos(resultadoFiltrado);
}

document.addEventListener("DOMContentLoaded", function () {
  const formBusca = document.getElementById("form-busca");

  formBusca.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o comportamento padrão de enviar o formulário
    const inputBusca = document.getElementById("input-busca");
    const nomeBusca = inputBusca.value.trim();
    filtrarApartamentosPorNome(nomeBusca);
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Evento de clique no botão "Filtrar"
  document.getElementById("btn-filtrar").addEventListener("click", function () {
    // Obter valores do modal de filtro
    // Verificar se os filtros estão ativos e mostrar/ocultar o botão "Limpar Filtros"
    const valorMinimo = document.getElementById("valorMinimo").value;
    const valorMaximo = document.getElementById("valorMaximo").value;
    const regiao = document.getElementById("regiao").value.trim().toLowerCase();
    const tamanhoMinimo = document.getElementById("tamanhoMinimo").value;
    const tamanhoMaximo = document.getElementById("tamanhoMaximo").value;
    const filtrosAtivos =
      valorMinimo || valorMaximo || regiao || tamanhoMinimo || tamanhoMaximo;

    if (filtrosAtivos) {
      document.getElementById("btn-limpar-filtros").style.display =
        "inline-block"; // Mostrar botão "Limpar Filtros"
    } else {
      document.getElementById("btn-limpar-filtros").style.display = "none"; // Ocultar botão "Limpar Filtros"
    }

    // Filtrar apartamentos
    const apartamentosFiltrados = apartamentos.filter((apartamento) => {
      const atendeValor =
        (valorMinimo === "" || apartamento.preco >= valorMinimo) &&
        (valorMaximo === "" || apartamento.preco <= valorMaximo);
      const atendeRegiao =
        regiao === "" || apartamento.regiao.toLowerCase().includes(regiao);
      const atendeTamanho =
        (tamanhoMinimo === "" || apartamento.tamanho >= tamanhoMinimo) &&
        (tamanhoMaximo === "" || apartamento.tamanho <= tamanhoMaximo);
      return atendeValor && atendeRegiao && atendeTamanho;
    });

    // Exibir apartamentos filtrados
    exibirApartamentos(apartamentosFiltrados);

    // Fechar modal de filtro
    $("#modalFiltro").modal("hide");
  });
  document
    .getElementById("btn-limpar-filtros")
    .addEventListener("click", function () {
      // Exibir todos os apartamentos novamente
      exibirApartamentos(apartamentos);

      // Limpar valores dos campos de filtro
      document.getElementById("valorMinimo").value = "";
      document.getElementById("valorMaximo").value = "";
      document.getElementById("regiao").value = "";
      document.getElementById("tamanhoMinimo").value = "";
      document.getElementById("tamanhoMaximo").value = "";

      this.style.display = "none";
    });
  document
    .getElementById("apartamentos-container")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("btn-ver-detalhes")) {
        const apartamentoId = event.target.dataset.id;
        const apartamento = apartamentos.find(
          (ap) => ap.id === parseInt(apartamentoId)
        );

        document.getElementById("modalImovelNome").textContent =
          apartamento.nome;
        document.getElementById(
          "modalImovelPreco"
        ).textContent = `Preço: R$ ${apartamento.preco}`;
        document.getElementById(
          "modalImovelRegiao"
        ).textContent = `Região: ${apartamento.regiao}`;
        document.getElementById(
          "modalImovelEndereco"
        ).textContent = `Endereço: ${apartamento.endereco}`;
        document.getElementById(
          "modalImovelQuartos"
        ).textContent = `Quartos: ${apartamento.quartos}`;
        document.getElementById(
          "modalImovelBanheiros"
        ).textContent = `Banheiros: ${apartamento.banheiros}`;
        document.getElementById(
          "modalImovelContato"
        ).textContent = `Contato: ${apartamento.contato}`;

        const carouselInner = document.querySelector(
          "#carouselImovel .carousel-inner"
        );
        carouselInner.innerHTML = "";
        apartamento.fotos.forEach((foto, index) => {
          const item = document.createElement("div");
          item.classList.add("carousel-item");
          if (index === 0) item.classList.add("active");
          const img = document.createElement("img");
          img.classList.add("d-block", "w-100");
          img.src = foto;
          item.appendChild(img);
          carouselInner.appendChild(item);
        });

        $("#modalDetalhes").modal("show");
      }
    });
});

// Função para exibir os detalhes completos de um apartamento
function exibirDetalhes(id) {
  const apartamento = apartamentos.find((ap) => ap.id === id);
  if (apartamento) {
    // Preencher o modal com os detalhes do apartamento
    document.getElementById("modalImovelNome").textContent = apartamento.nome;
    document.getElementById(
      "modalImovelPreco"
    ).textContent = `Preço: R$ ${apartamento.preco}`;
    document.getElementById(
      "modalImovelRegiao"
    ).textContent = `Região: ${apartamento.regiao}`;
    document.getElementById(
      "modalImovelEndereco"
    ).textContent = `Endereço: ${apartamento.endereco}`;
    document.getElementById(
      "modalImovelQuartos"
    ).textContent = `Quartos: ${apartamento.quartos}`;
    document.getElementById(
      "modalImovelBanheiros"
    ).textContent = `Banheiros: ${apartamento.banheiros}`;
    document.getElementById(
      "modalImovelContato"
    ).textContent = `Contato: ${apartamento.contato}`;

    // // Preencher o carrossel de fotos do imóvel
    // const carouselInner = document.querySelector(
    //   "#carouselImovel .carousel-inner"
    // );
    // carouselInner.innerHTML = "";
    // apartamento.fotos.forEach((foto, index) => {
    //   const item = document.createElement("div");
    //   item.classList.add("carousel-item");
    //   if (index === 0) item.classList.add("active"); // Definir o primeiro item como ativo
    //   const img = document.createElement("img");
    //   img.classList.add("d-block", "w-100");
    //   img.src = foto;
    //   item.appendChild(img);
    //   carouselInner.appendChild(item);
    // });

    // Abrir o modal de detalhes do imóvel
    $("#modalDetalhes").modal("show");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Evento de clique no botão "Criar Anúncio"
  document
    .getElementById("btn-criar-anuncio")
    .addEventListener("click", function () {
      // Limpar o formulário de criação de anúncio
      document.getElementById("form-criar-anuncio").reset();
    });

  // Evento de clique no botão "Salvar Anúncio"
  document
    .getElementById("btn-salvar-anuncio")
    .addEventListener("click", function () {
      // Obter os valores do formulário de criação de anúncio
      const nome = document.getElementById("nome").value.trim();
      const preco = document.getElementById("preco").value.trim();
      const regiao = document.getElementById("nome").value.trim();
      const tamanho = document.getElementById("preco").value.trim();
      const endereco = document.getElementById("nome").value.trim();
      const quartos = document.getElementById("preco").value.trim();
      const banheiros = document.getElementById("preco").value.trim();
      // Obtenha os valores dos outros campos do formulário conforme necessário

      // Validar os valores do formulário
      if (nome === "" || preco === "") {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      // Criar um novo objeto de apartamento com os valores do formulário
      // const novoApartamento = {
      //   id: apartamentos.length + 1, // Gere um novo ID único para o apartamento
      //   nome: nome,
      //   preco: parseFloat(preco),
      //   // Preencha os outros campos do objeto do apartamento conforme necessário
      // };

      const novoApartamento = {
        id: apartamentos.length + 1,
        nome: nome,
        preco: parseFloat(preco),
        regiao: regiao,
        tamanho: parseFloat(tamanho),
        endereco: endereco,
        quartos: parseFloat(quartos),
        banheiros: parseFloat(banheiros),
        contato: contato,
        //fotos: fotos,
      };

      console.log("NOVO APARTAMENTO:");
      console.log(novoApartamento);

      // Adicionar o novo apartamento ao array de apartamentos
      apartamentos.push(novoApartamento);

      // Exibir os apartamentos atualizados na página
      exibirApartamentos(apartamentos);

      // Fechar o modal de criação de anúncio
      $("#modalCriarAnuncio").modal("hide");
    });
});

// Chamada inicial para exibir os apartamentos na página
exibirApartamentos(apartamentos);
