// const apartamentos = [
//   {
//     id: 1,
//     nome: "Apartamento 1",
//     preco: 2000,
//     regiao: "Centro",
//     tamanho: 100,
//     endereco: "Rua A, 123",
//     quartos: 2,
//     banheiros: 1,
//     contato: "1234567890",
//     fotos: ["./fotos/casa.jpg"],
//   },
//   {
//     id: 2,
//     nome: "Apartamento 2",
//     preco: 3000,
//     regiao: "Contagem",
//     tamanho: 100,
//     endereco: "Rua B, 567",
//     quartos: 2,
//     banheiros: 1,
//     contato: "1234567890",
//     fotos: ["./fotos/casa2.jpeg"],
//   },
//   {
//     id: 3,
//     nome: "Apartamento 3",
//     preco: 4000,
//     regiao: "BH",
//     tamanho: 100,
//     endereco: "Rua C, 890",
//     quartos: 2,
//     banheiros: 1,
//     contato: "1234567890",
//     fotos: ["./fotos/casa3.jpg", "./fotos/casa3-1.jpg"],
//   },
//   // Adicione mais apartamentos conforme necessário
// ];

var apartamentos = [];

// Consultar a API de apartamentos
fetch("http://localhost:3000/apartamentos")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro ao buscar os apartamentos.");
    }
    return response.json();
  })
  .then((data) => {
    apartamentos = data;
    console.log(data);
    exibirApartamentos(apartamentos);
  })
  .catch((error) => {
    console.error("Erro:", error);
  });

function exibirApartamentos(apartamentos) {
  const container = $("#apartamentos-container");
  container.empty();

  apartamentos.forEach((apartamento) => {
    const card = $("<div></div>").addClass("card mt-3 p-3 bg-light");
    console.log(JSON.stringify(apartamento));
    card.html(`
          <h3 class="card-title">${apartamento.nome}</h3>
          <p class="card-text">Preço: R$ ${apartamento.preco}</p>
          <p class="card-text">Região: ${apartamento.regiao}</p>
          <button class="btn btn-primary btn-ver-detalhes" data-id="${apartamento.id}">Ver Detalhes</button>
      `);

    container.append(card);
  });
}

function filtrarApartamentosPorNome(nome) {
  const resultadoFiltrado = apartamentos.filter((apartamento) =>
    apartamento.nome.toLowerCase().includes(nome.toLowerCase())
  );
  exibirApartamentos(resultadoFiltrado);
}

// Evento de clique no botão "Filtrar"
$("#btn-filtrar").click(function () {
  // Obter valores do modal de filtro
  // Verificar se os filtros estão ativos e mostrar/ocultar o botão "Limpar Filtros"
  const valorMinimo = $("#valorMinimo").val();
  const valorMaximo = $("#valorMaximo").val();
  const regiao = $("#regiao").val().trim().toLowerCase();
  const tamanhoMinimo = $("#tamanhoMinimo").val();
  const tamanhoMaximo = $("#tamanhoMaximo").val();
  const filtrosAtivos =
    valorMinimo || valorMaximo || regiao || tamanhoMinimo || tamanhoMaximo;

  if (filtrosAtivos) {
    $("#btn-limpar-filtros").css("display", "inline-block"); // Mostrar botão "Limpar Filtros"
  } else {
    $("#btn-limpar-filtros").css("display", "none"); // Ocultar botão "Limpar Filtros"
  }

  // Filtrar apartamentos
  const apartamentosFiltrados = apartamentos.filter(function (apartamento) {
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

$("#btn-filtro").click(function (event) {
  event.preventDefault(); // Evita o comportamento padrão de recarregar a página
  $("#modalFiltro").modal("show");
});

// Evento de clique no botão "Limpar Filtros"
$("#btn-limpar-filtros").click(function () {
  // Exibir todos os apartamentos novamente
  exibirApartamentos(apartamentos);

  // Limpar valores dos campos de filtro
  $("#valorMinimo").val("");
  $("#valorMaximo").val("");
  $("#regiao").val("");
  $("#tamanhoMinimo").val("");
  $("#tamanhoMaximo").val("");

  $(this).css("display", "none");
});

$("#input-busca").on("input keydown", function (event) {
  if (event.type === "input" || event.keyCode === 13) {
    // Verifica se o evento é de digitação ou se a tecla pressionada é Enter (código 13)
    if (event.keyCode === 13) {
      event.preventDefault(); // Evita o comportamento padrão de enviar o formulário
    }
    const nomeBusca = $(this).val().trim();
    filtrarApartamentosPorNome(nomeBusca);
  }
});

// Evento de clique nos botões de detalhes
$("#apartamentos-container").on("click", ".btn-ver-detalhes", function (event) {
  const apartamentoId = $(this).data("id");
  const apartamento = apartamentos.find(
    (ap) => ap.id === parseInt(apartamentoId)
  );

  if (apartamento) {
    $("#modalImovelNome").text(apartamento.nome);
    $("#modalImovelPreco").text(`Preço: R$ ${apartamento.preco}`);
    $("#modalImovelRegiao").text(`Região: ${apartamento.regiao}`);
    $("#modalImovelEndereco").text(`Endereço: ${apartamento.endereco}`);
    $("#modalImovelQuartos").text(`Quartos: ${apartamento.quartos}`);
    $("#modalImovelBanheiros").text(`Banheiros: ${apartamento.banheiros}`);
    $("#modalImovelContato").text(`Contato: ${apartamento.contato}`);

    // Remove qualquer botão "Deletar Anúncio" existente
    $(".btn-deletar-anuncio").remove();

    // Adiciona o botão de Deletar Anúncio
    $("#modalImovelContato").after(
      `<button class="btn btn-danger btn-deletar-anuncio" data-id="${apartamento.id}">Deletar Anúncio</button>`
    );

    const carouselInner = $("#carouselImovel .carousel-inner");
    carouselInner.empty();

    // Convertendo apartamento.fotos para um array, se necessário
    if (typeof apartamento.fotos === "string") {
      apartamento.fotos = JSON.parse(apartamento.fotos);
    }

    if (Array.isArray(apartamento.fotos) && apartamento.fotos.length > 0) {
      apartamento.fotos.forEach((fotoData, index) => {
        const item = $("<div></div>")
          .addClass("carousel-item")
          .appendTo(carouselInner);
        if (index === 0) item.addClass("active");
        const fotoSrc = fotoData.startsWith("data:")
          ? fotoData
          : `data:image/jpeg;base64,${fotoData}`;
        $("<img>")
          .addClass("d-block w-100")
          .attr("src", fotoSrc)
          .appendTo(item);
      });
    } else {
      carouselInner.append("<p>Nenhuma foto disponível</p>");
    }

    $("#modalDetalhes").modal("show");
  } else {
    console.log("Apartamento não encontrado");
  }
});

function exibirDetalhes(id) {
  const apartamento = apartamentos.find((ap) => ap.id === id);
  if (apartamento) {
    // Preencher o modal com os detalhes do apartamento
    $("#modalImovelNome").text(apartamento.nome);
    $("#modalImovelPreco").text(`Preço: R$ ${apartamento.preco}`);
    $("#modalImovelRegiao").text(`Região: ${apartamento.regiao}`);
    $("#modalImovelEndereco").text(`Endereço: ${apartamento.endereco}`);
    $("#modalImovelQuartos").text(`Quartos: ${apartamento.quartos}`);
    $("#modalImovelBanheiros").text(`Banheiros: ${apartamento.banheiros}`);
    $("#modalImovelContato").text(`Contato: ${apartamento.contato}`);

    // // Preencher o carrossel de fotos do imóvel
    // const carouselInner = $("#carouselImovel .carousel-inner");
    // carouselInner.empty();
    // apartamento.fotos.forEach((foto, index) => {
    //   const item = $("<div></div>").addClass("carousel-item");
    //   if (index === 0) item.addClass("active"); // Definir o primeiro item como ativo
    //   $("<img>").addClass("d-block w-100").attr("src", foto).appendTo(item);
    //   carouselInner.append(item);
    // });

    // Abrir o modal de detalhes do imóvel
    $("#modalDetalhes").modal("show");
  }
}

// Evento de clique no botão "Criar Anúncio"
$("#btn-criar-anuncio").click(function () {
  // Limpar o formulário de criação de anúncio
  //$("#form-criar-anuncio")[0].reset();
});

// Evento de clique no botão "Criar Anúncio"
$("#btn-criar-anuncio").click(function (event) {
  event.preventDefault(); // Evita o comportamento padrão de envio do formulário
  $("#modalCriarAnuncio").modal("show");
});

// Evento de mudança no campo de input de arquivo
// $("#foto").on("change", function () {
//   const files = $(this)[0].files; // Captura os arquivos selecionados pelo usuário

//   // Verifica se há arquivos selecionados
//   if (files.length > 0) {
//     // Loop sobre os arquivos selecionados
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];

//       // Verifica se o arquivo é uma imagem
//       if (file.type.match("image.*")) {
//         // Crie um objeto URL temporário para a imagem
//         const imageUrl = URL.createObjectURL(file);

//         // Aqui você pode fazer o que quiser com a imagem,
//         // como exibi-la em uma prévia ou fazer upload dela para o servidor.

//         console.log(imageUrl);
//         // Por exemplo, exibindo uma prévia da imagem:
//         const preview = $("<img>")
//           .attr("src", imageUrl)
//           .addClass("img-thumbnail");
//         $("#foto-preview").append(preview);
//       } else {
//         // Se o arquivo não for uma imagem, você pode lidar com isso aqui
//         console.log("O arquivo selecionado não é uma imagem.");
//       }
//     }
//   }
// });

// Evento de mudança no campo de input de arquivo
$("#foto").on("change", function () {
  const files = $(this)[0].files; // Captura os arquivos selecionados pelo usuário

  // Verifica se há arquivos selecionados
  if (files.length > 0) {
    // Loop sobre os arquivos selecionados
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Crie um novo FileReader
      const reader = new FileReader();

      // Defina o evento onload para executar quando a leitura for concluída
      reader.onload = function (event) {
        // A variável event.target.result contém o conteúdo do arquivo em base64
        const base64String = event.target.result;
        console.log("Base64 da imagem:", base64String);

        // Aqui você pode fazer o que quiser com o base64 da imagem,
        // como enviá-lo para o servidor ou realizar outras operações.
      };

      // Ler o conteúdo do arquivo como uma URL de dados (data URL)
      reader.readAsDataURL(file);

      // Verifica se o arquivo é uma imagem
      if (file.type.match("image.*")) {
        const imageUrl = URL.createObjectURL(file);

        console.log(imageUrl);
        const preview = $("<img>")
          .attr("src", imageUrl)
          .addClass("img-thumbnail");
        $("#foto-preview").append(preview);
      } else {
        console.log("O arquivo selecionado não é uma imagem.");
      }
    }
  }
});

// Evento de clique no botão "Salvar Anúncio"
$("#btn-salvar-anuncio").click(function () {
  // Obter os valores do formulário de criação de anúncio
  const nome = $("#nome").val();
  const preco = $("#preco").val();
  const regiao = $("#regiaoCriar").val();
  const tamanho = $("#tamanho").val();
  const endereco = $("#endereco").val();
  const quartos = $("#quartos").val();
  const banheiros = $("#banheiros").val();
  const contato = $("#contato").val();
  const fotoInput = $("#foto")[0]; // Obter o elemento input de foto
  const foto = fotoInput.files[0]; // Obter o arquivo de foto selecionado pelo usuário

  console.log("REGIAO: " + $("#regiao").val());

  // Validar os valores do formulário
  if (nome === "" || preco === "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Criar um novo objeto de apartamento com os valores do formulário
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
    fotos: [], // Inicializar um array vazio para as fotos
  };

  // Verificar se uma foto foi selecionada pelo usuário
  if (foto) {
    // Ler a foto como uma URL de dados (data URL)
    const reader = new FileReader();
    reader.onload = function (e) {
      const fotoDataURL = e.target.result;
      novoApartamento.fotos.push(fotoDataURL); // Adicionar a foto ao array de fotos do apartamento
      // Exibir a foto na página ou realizar outras operações necessárias
      console.log("Foto carregada:", fotoDataURL);

      // Enviar o novo anúncio para a API
      criarNovoAnuncio(novoApartamento);
    };
    // Ler a foto como uma URL de dados (data URL)
    reader.readAsDataURL(foto);
  } else {
    // Se nenhuma foto foi selecionada, enviar o novo anúncio para a API sem a foto
    criarNovoAnuncio(novoApartamento);
  }

  console.log("NOVO APARTAMENTO:");
  console.log(novoApartamento);

  // Adicionar o novo apartamento ao array de apartamentos
  apartamentos.push(novoApartamento);

  // Exibir os apartamentos atualizados na página
  exibirApartamentos(apartamentos);

  // Fechar o modal de criação de anúncio
  $("#modalCriarAnuncio").modal("hide");
});

// Função para criar um novo anúncio
function criarNovoAnuncio(novoAnuncio) {
  fetch("http://localhost:3000/apartamentos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(novoAnuncio),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao criar novo anúncio.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Novo anúncio criado:", data);
      // Aqui você pode fazer algo com os dados do novo anúncio, se necessário
    })
    .catch((error) => {
      console.error("Erro ao criar novo anúncio:", error);
    });
}

// Chamada inicial para exibir os apartamentos na página
exibirApartamentos(apartamentos);
