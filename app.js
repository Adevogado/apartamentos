var apartamentos = [];

console.log("teste");
// Consultar a API de apartamentos
fetch(
  "https://d9bfee03-5f66-43c5-98c6-432aba8665e8-00-1tty19cavysgh.worf.replit.dev/apartamentos"
)
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

// function exibirApartamentos(apartamentos) {
//   const container = $("#apartamentos-container");
//   container.empty();
//   apartamentos.forEach((apartamento) => {
//     const card = $("<div></div>").addClass("card mt-3 p-3 bg-light");
//     card.html(`
//           <h3 class="card-title">${apartamento.nome}</h3>
//           <p class="card-text">Preço: R$ ${apartamento.preco}</p>
//           <p class="card-text">Região: ${apartamento.regiao}</p>
//           <button class="btn btn-primary btn-ver-detalhes" data-id="${apartamento.id}">Ver Detalhes</button>
//       `);

//     container.append(card);
//   });
// }

function exibirApartamentos(apartamentos) {
  const container = $("#apartamentos-container");
  container.empty();

  apartamentos.forEach((apartamento) => {
    const card = $("<div></div>").addClass("card mt-3 p-3 bg-light");
    const imgSrc =
      Array.isArray(apartamento.fotos) && apartamento.fotos.length > 0
        ? apartamento.fotos[0]
        : "placeholder.jpg"; // Se não houver fotos, você pode usar uma imagem de placeholder
    card.html(`
          <h3 class="card-title">${apartamento.nome}</h3>
          <img src="${imgSrc}" class="card-img-top" alt="Foto do Apartamento"> <!-- Adicione a tag img aqui -->
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

$("#modalDetalhes").on("click", ".btn-editar-anuncio", function (event) {
  $(".btn-editar-anuncio").hide();
  const apartamentoId = $(this).data("id");
  const apartamento = apartamentos.find(
    (ap) => ap.id === parseInt(apartamentoId)
  );

  if (apartamento) {
    // Ativar campos para edição
    $(
      "#modalImovelPreco, #modalImovelRegiao, #modalImovelEndereco, #modalImovelTamanho, #modalImovelQuartos, #modalImovelBanheiros, #modalImovelContato"
    ).removeAttr("readonly");

    $("#modalImovelNome").attr("contenteditable", true);

    // Adicionar botão de confirmar alterações
    $(".btn-confirmar-alteracoes").remove();
    $(".btn-editar-anuncio").after(
      `<button class="btn btn-success btn-confirmar-alteracoes" data-id="${apartamento.id}">Confirmar Alterações</button>`
    );

    // Adicionar botão de cancelar alterações
    $(".btn-cancelar-alteracoes").remove();
    $(".btn-editar-anuncio").after(
      `<button class="btn btn-secondary btn-cancelar-alteracoes" data-id="${apartamento.id}">Cancelar</button>`
    );

    // Desativar botão de editar
    $(this).attr("disabled", "disabled");
  } else {
    console.log("Apartamento não encontrado");
  }
});

// Evento de clique no botão Cancelar
$("#modalDetalhes").on("click", ".btn-cancelar-alteracoes", function (event) {
  $(".btn-editar-anuncio").show();
  // Desativar campos
  $(
    "#modalImovelPreco, #modalImovelRegiao, #modalImovelEndereco, #modalImovelTamanho, #modalImovelQuartos, #modalImovelBanheiros, #modalImovelContato"
  ).attr("readonly", "readonly");

  $("#modalImovelNome").attr("contenteditable", false);

  // Remover botão de confirmar alterações
  $(".btn-confirmar-alteracoes").remove();

  // Remover botão de cancelar alterações
  $(".btn-cancelar-alteracoes").remove();

  // Ativar botão de editar
  $(".btn-editar-anuncio").removeAttr("disabled");
});

$("#modalDetalhes").on("click", ".btn-confirmar-alteracoes", function (event) {
  const apartamentoId = $(this).data("id");

  // Coletar os novos valores dos campos editados
  const nome = $("#modalImovelNome").text();
  const preco = $("#modalImovelPreco").val();
  const regiao = $("#modalImovelRegiao").val();
  const endereco = $("#modalImovelEndereco").val();
  const tamanho = $("#modalImovelTamanho").val();
  const quartos = $("#modalImovelQuartos").val();
  const banheiros = $("#modalImovelBanheiros").val();
  const contato = $("#modalImovelContato").val();

  // Montar o objeto com os dados atualizados
  const dadosAtualizados = {
    nome: nome,
    preco: preco,
    regiao: regiao,
    endereco: endereco,
    tamanho: tamanho,
    quartos: quartos,
    banheiros: banheiros,
    contato: contato,
  };

  // Desativar todos os campos
  $(
    "#modalImovelPreco, #modalImovelRegiao, #modalImovelEndereco, #modalImovelTamanho, #modalImovelQuartos, #modalImovelBanheiros, #modalImovelContato"
  ).prop("disabled", true);

  $("#modalImovelNome").attr("contenteditable", false);

  // Ocultar os botões de confirmar e cancelar alterações
  $(".btn-confirmar-alteracoes, .btn-cancelar-alteracoes").hide();

  // Exibir o botão de editar anúncio
  $(".btn-editar-anuncio").show();
  $(".btn-editar-anuncio").removeAttr("disabled");

  // Enviar uma solicitação PUT para a API com os dados atualizados usando Fetch
  fetch(
    `https://d9bfee03-5f66-43c5-98c6-432aba8665e8-00-1tty19cavysgh.worf.replit.dev/apartamentos/${apartamentoId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosAtualizados),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao confirmar alterações");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Alterações confirmadas:", data);
      // Recarregar a página ou atualizar os dados do apartamento na interface, se necessário
      // ...
    })
    .catch((error) => {
      console.error("Erro ao confirmar alterações:", error);
      // Exibir uma mensagem de erro ao usuário, se necessário
      // ...
    });

  setTimeout(() => {
    location.reload();
  }, 2000);
});

// Evento de clique nos botões de detalhes
$("#apartamentos-container").on("click", ".btn-ver-detalhes", function (event) {
  const apartamentoId = $(this).data("id");
  const apartamento = apartamentos.find(
    (ap) => ap.id === parseInt(apartamentoId)
  );

  if (apartamento) {
    $("#modalImovelNome").text(apartamento.nome);
    $("#modalImovelPreco").val(apartamento.preco);
    $("#modalImovelRegiao").val(apartamento.regiao);
    $("#modalImovelEndereco").val(apartamento.endereco);
    $("#modalImovelTamanho").val(apartamento.tamanho);
    $("#modalImovelQuartos").val(apartamento.quartos);
    $("#modalImovelBanheiros").val(apartamento.banheiros);
    $("#modalImovelContato").val(apartamento.contato);

    // Remove botões já existentes
    $(".btn-deletar-anuncio").remove();
    $(".btn-editar-anuncio").remove();

    // Adiciona o botão de Deletar Anúncio após o campo de contato
    $("#modalImovelContato")
      .closest(".form-group")
      .after(
        `<div class="form-group row">
       <div class="col-sm-9 offset-sm-3">
         <button class="btn btn-danger btn-deletar-anuncio" data-id="${apartamento.id}">Deletar Anúncio</button>
         <button class="btn btn-warning btn-editar-anuncio" data-id="${apartamento.id}">Editar Anúncio</button>
       </div>
     </div>`
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

$("#modalDetalhes").on("click", ".btn-deletar-anuncio", function (event) {
  const apartamentoId = $(this).data("id");
  // Chama a função para deletar o anúncio
  deletarAnuncio(apartamentoId);
});

// Função para deletar o anúncio
function deletarAnuncio(apartamentoId) {
  console.log("apartamentoId");
  console.log(apartamentoId);
  // Fazer a requisição DELETE para a API
  fetch(
    `https://d9bfee03-5f66-43c5-98c6-432aba8665e8-00-1tty19cavysgh.worf.replit.dev/apartamentos/${apartamentoId}`,
    {
      method: "DELETE",
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao deletar o anúncio.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Anúncio deletado com sucesso:", data);
      $("#apartamento-" + apartamentoId).remove();
      $("#modalDetalhes").modal("hide");
    })
    .catch((error) => {
      console.error("Erro ao deletar o anúncio:", error);
    });

  setTimeout(() => {
    location.reload();
  }, 2000);
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

$("#preco").on("input", function () {
  // Obter o valor atual do campo de preço
  let preco = $(this).val();

  // Verificar se o valor é um número inteiro positivo
  if (
    preco !== "" &&
    (isNaN(preco) ||
      parseInt(preco) !== parseFloat(preco) ||
      parseInt(preco) < 0)
  ) {
    // Se o valor não for um número inteiro positivo, definir o valor como vazio
    $(this).val("");
  }
});

$(".form-control").on("input", function () {
  if ($(this).val() !== "") {
    $(this).removeClass("campo-invalido");
  }
});

$("#btn-salvar-anuncio").click(function () {
  const nome = $("#nome");
  const preco = $("#preco");
  const regiao = $("#regiaoCriar");
  const tamanho = $("#tamanho");
  const endereco = $("#endereco");
  const quartos = $("#quartos");
  const banheiros = $("#banheiros");
  const contato = $("#contato");
  const fotoInput = $("#foto")[0]; // Obter o elemento input de foto
  const fotos = fotoInput.files; // Obter todos os arquivos de foto selecionados pelo usuário

  const campos = [
    { campo: $("#nome"), mensagem: "Nome" },
    { campo: $("#preco"), mensagem: "Preço" },
    { campo: $("#regiaoCriar"), mensagem: "Região" },
    { campo: $("#tamanho"), mensagem: "Tamanho" },
    { campo: $("#endereco"), mensagem: "Endereço" },
    { campo: $("#quartos"), mensagem: "Quartos" },
    { campo: $("#banheiros"), mensagem: "Banheiros" },
    { campo: $("#contato"), mensagem: "Contato" },
  ];

  // Remover classes de erro de todos os campos
  $(".form-control").removeClass("campo-invalido");

  // Remover classes de erro de todos os campos
  $(".form-control").removeClass("campo-invalido");

  let camposVazios = false;
  let camposNaoPreenchidos = [];

  // Verificar se algum campo está vazio e marcar campos vazios
  campos.forEach(({ campo, mensagem }) => {
    if (campo.val() === "") {
      campo.addClass("campo-invalido");
      camposVazios = true;
      camposNaoPreenchidos.push(mensagem);
    }
  });

  let toastElement;
  if (camposVazios) {
    const camposNaoPreenchidosStr = camposNaoPreenchidos.join(", ");
    const toast = `
    <div class="alert alert-danger" role="alert">
      Preencha todos os campos
    </div>
  `;
    $(toast).appendTo(".modal-body");
    $(".toast").toast("show");
    return;
  } else {
    if (toastElement) {
      toastElement.remove();
    }
  }

  const novoApartamento = {
    id: apartamentos.length + 1,
    nome: nome.val(),
    preco: parseFloat(preco.val()),
    regiao: regiao.val(),
    tamanho: parseFloat(tamanho.val()),
    endereco: endereco.val(),
    quartos: parseFloat(quartos.val()),
    banheiros: parseFloat(banheiros.val()),
    contato: contato.val(),
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
  fetch(
    "https://d9bfee03-5f66-43c5-98c6-432aba8665e8-00-1tty19cavysgh.worf.replit.dev/apartamentos",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoAnuncio),
    }
  )
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
