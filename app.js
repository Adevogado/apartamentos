var apartamentos = [];

// Consultar a API de apartamentos
fetch("https://9978ca43-3279-4312-a2c5-1fda59e3ff3b-00-2fdbb7cudds1a.worf.replit.dev/apartamentos")
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
    $("#modalImovelNome").text(apartamento.nome);
    $("#modalImovelPreco").text(`Preço: R$ ${apartamento.preco}`);
    $("#modalImovelRegiao").text(`Região: ${apartamento.regiao}`);
    $("#modalImovelEndereco").text(`Endereço: ${apartamento.endereco}`);
    $("#modalImovelQuartos").text(`Quartos: ${apartamento.quartos}`);
    $("#modalImovelBanheiros").text(`Banheiros: ${apartamento.banheiros}`);
    $("#modalImovelContato").text(`Contato: ${apartamento.contato}`);

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
  }
}

$("#modalDetalhes").on("click", ".btn-deletar-anuncio", function (event) {
  const apartamentoId = $(this).data("id");

  // Chama a função para deletar o anúncio
  deletarAnuncio(apartamentoId);
});

// Função para deletar o anúncio
function deletarAnuncio(apartamentoId) {
  // Fazer a requisição DELETE para a API
  fetch(`https://9978ca43-3279-4312-a2c5-1fda59e3ff3b-00-2fdbb7cudds1a.worf.replit.dev/apartamentos/${apartamentoId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao deletar o anúncio.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Anúncio deletado com sucesso:", data);
      // Aqui você pode fazer algo após deletar o anúncio, se necessário
      // Por exemplo, atualizar a lista de apartamentos exibidos na página
      // ou fechar o modal de detalhes do imóvel
      $("#modalDetalhes").modal("hide");
    })
    .catch((error) => {
      console.error("Erro ao deletar o anúncio:", error);
    });
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
$("#foto").on("change", function () {
  const files = $(this)[0].files; // Captura os arquivos selecionados pelo usuário

  // Verifica se há arquivos selecionados
  if (files.length > 0) {
    // Loop sobre os arquivos selecionados
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Verifica se o arquivo é uma imagem
      if (file.type.match("image.*")) {
        // Crie um objeto URL temporário para a imagem
        const imageUrl = URL.createObjectURL(file);

        // Aqui você pode fazer o que quiser com a imagem,
        // como exibi-la em uma prévia ou fazer upload dela para o servidor.

        console.log(imageUrl);
        // Por exemplo, exibindo uma prévia da imagem:
        const preview = $("<img>")
          .attr("src", imageUrl)
          .addClass("img-thumbnail");
        $("#foto-preview").append(preview);
      } else {
        // Se o arquivo não for uma imagem, você pode lidar com isso aqui
        console.log("O arquivo selecionado não é uma imagem.");
      }
    }
  }
});

$("#btn-salvar-anuncio").click(function () {
  const nome = $("#nome").val();
  const preco = $("#preco").val();
  const regiao = $("#regiaoCriar").val();
  const tamanho = $("#tamanho").val();
  const endereco = $("#endereco").val();
  const quartos = $("#quartos").val();
  const banheiros = $("#banheiros").val();
  const contato = $("#contato").val();
  const fotoInput = $("#foto")[0]; // Obter o elemento input de foto
  const fotos = fotoInput.files; // Obter todos os arquivos de foto selecionados pelo usuário

  if (nome === "" || preco === "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }

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
    fotos: [],
  };

  for (let i = 0; i < fotos.length; i++) {
    const foto = fotos[i];

    if (!foto.type.match("image.*")) {
      console.error("O arquivo selecionado não é uma imagem.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const fotoDataURL = e.target.result;

      if (fotoDataURL.startsWith("data:image/")) {
        novoApartamento.fotos.push(fotoDataURL);

        console.log("Foto carregada:", fotoDataURL);

        if (novoApartamento.fotos.length === fotos.length) {
          // Enviar o novo anúncio para a API somente após todas as fotos serem processadas
          criarNovoAnuncio(novoApartamento);
        }
      } else {
        console.error("A imagem não está codificada em base64.");
        console.log(fotoDataURL);
      }
    };

    reader.readAsDataURL(foto);
  }

  console.log("NOVO APARTAMENTO:");
  console.log(novoApartamento);

  apartamentos.push(novoApartamento);

  exibirApartamentos(apartamentos);

  $("#modalCriarAnuncio").modal("hide");
});

function criarNovoAnuncio(novoAnuncio) {
  fetch("https://9978ca43-3279-4312-a2c5-1fda59e3ff3b-00-2fdbb7cudds1a.worf.replit.dev/apartamentos", {
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

exibirApartamentos(apartamentos);
