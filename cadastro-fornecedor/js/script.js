$(document).ready(function () {
  let contadorProdutos = 1;
  let contadorAnexos = 1;

  $('#cep').on('blur', function () {
    let cepDigitado = $('#cep').val();
    cepDigitado = cepDigitado.replace(/\D/g, '');
    if (cepDigitado.length === 8) {
      buscarEnderecoPorCEP(cepDigitado);
    } else {
      alert('CEP deve ter 8 dígitos');
    }
  });

  function buscarEnderecoPorCEP(cep) {
    $.getJSON(`https://viacep.com.br/ws/${cep}/json/`)
      .done(function (dadosEndereco) {
        if (dadosEndereco.erro) {
          alert('CEP não encontrado');
        } else {
          $('#logradouro').val(dadosEndereco.logradouro);
          $('#bairro').val(dadosEndereco.bairro);
          $('#cidade').val(dadosEndereco.localidade);
          $('#estado').val(dadosEndereco.uf);
          alert('Endereço encontrado!');
        }
      })
      .fail(function () {
        alert('Erro ao buscar CEP. Tente novamente.');
      });
  }

  $('#addProduto').click(function () {
    contadorProdutos++;
    let novoProduto = $('.produto-item').first().clone();
    novoProduto.attr('data-index', contadorProdutos);
    novoProduto.find('strong').text(`Produto – ${contadorProdutos}`);
    novoProduto.find('input').val('');
    novoProduto.find('select').val('');
    $('#produtosContainer').append(novoProduto);
  });

  $(document).on('click', '.remover-produto', function () {
    let totalProdutos = $('.produto-item').length;
    if (totalProdutos > 1) {
      $(this).closest('.produto-item').remove();
    } else {
      alert('É obrigatório ter pelo menos 1 produto');
    }
  });

  $(document).on('input', 'input[name="qtdeEstoque"], input[name="valorUnitario"]', function () {
    let linhaProduto = $(this).closest('.produto-item');
    let quantidade = parseFloat(linhaProduto.find('input[name="qtdeEstoque"]').val()) || 0;
    let valorUnitario = parseFloat(linhaProduto.find('input[name="valorUnitario"]').val()) || 0;
    let valorTotal = quantidade * valorUnitario;
    linhaProduto.find('input[name="valorTotal"]').val(valorTotal.toFixed(2));
  });

  $('#addAnexo').click(function () {
    contadorAnexos++;
    let novoAnexo = $('.anexo-item').first().clone();
    novoAnexo.attr('data-index', contadorAnexos);
    novoAnexo.find('input[type="file"]').val('');
    novoAnexo.find('.visualizar-anexo').prop('disabled', true);
    $('#anexosContainer').append(novoAnexo);
  });

  $(document).on('click', '.remover-anexo', function () {
    let totalAnexos = $('.anexo-item').length;
    if (totalAnexos > 1) {
      let anexoParaRemover = $(this).closest('.anexo-item');
      let chaveMemoria = anexoParaRemover.data('chave-arquivo');
      if (chaveMemoria) {
        sessionStorage.removeItem(chaveMemoria);
      }
      anexoParaRemover.remove();
    } else {
      alert('É obrigatório ter pelo menos 1 anexo');
    }
  });

  $(document).on('change', '.anexo-item input[type="file"]', function () {
    let arquivo = this.files[0];
    if (arquivo) {
      let chaveUnica = `arquivo_${Date.now()}`;
      let leitorArquivo = new FileReader();
      leitorArquivo.onload = function (evento) {
        sessionStorage.setItem(chaveUnica, evento.target.result);
        let linhaAnexo = $(arquivo).closest('.anexo-item');
        linhaAnexo.data('chave-arquivo', chaveUnica);
        linhaAnexo.find('.visualizar-anexo').prop('disabled', false);
      };
      leitorArquivo.readAsDataURL(arquivo);
    }
  });

  $(document).on('click', '.visualizar-anexo', function () {
    let linhaAnexo = $(this).closest('.anexo-item');
    let chaveArquivo = linhaAnexo.data('chave-arquivo');
    let arquivoSalvo = sessionStorage.getItem(chaveArquivo);
    if (arquivoSalvo) {
      let inputArquivo = linhaAnexo.find('input[type="file"]')[0];
      let nomeArquivo = inputArquivo.files[0].name;
      let linkDownload = document.createElement('a');
      linkDownload.href = arquivoSalvo;
      linkDownload.download = nomeArquivo;
      linkDownload.click();
    }
  });

  $('#btnSalvar').click(function () {
    if (!verificarSeTemProdutos()) return;
    if (!verificarSeTemAnexos()) return;
    if (!verificarCamposObrigatorios()) return;
    $('#modalLoading').modal('show');
    let dadosCompletos = coletarTodosOsDados();
    setTimeout(function () {
      $('#modalLoading').modal('hide');
      console.log('=== DADOS DO FORNECEDOR ===');
      console.log(JSON.stringify(dadosCompletos, null, 2));
      alert('Fornecedor salvo com sucesso! Verifique o console para ver o JSON.');
    }, 2000);
  });

  function verificarSeTemProdutos() {
    if ($('.produto-item').length < 1) {
      alert('Adicione pelo menos 1 produto');
      return false;
    }
    return true;
  }

  function verificarSeTemAnexos() {
    if ($('.anexo-item').length < 1) {
      alert('Adicione pelo menos 1 anexo');
      return false;
    }
    return true;
  }

  function verificarCamposObrigatorios() {
    let camposVazios = [];
    let camposObrigatorios = [
      { campo: 'razaoSocial', nome: 'Razão Social' },
      { campo: 'nomeFantasia', nome: 'Nome Fantasia' },
      { campo: 'cnpj', nome: 'CNPJ' },
      { campo: 'cep', nome: 'CEP' },
      { campo: 'endereco', nome: 'Endereço' },
      { campo: 'numero', nome: 'Número' },
      { campo: 'bairro', nome: 'Bairro' },
      { campo: 'cidade', nome: 'Cidade' },
      { campo: 'estado', nome: 'Estado' },
      { campo: 'nomeContato', nome: 'Nome do Contato' },
      { campo: 'telefoneContato', nome: 'Telefone' },
      { campo: 'emailContato', nome: 'E-mail' }
    ];
    camposObrigatorios.forEach(function (item) {
      let valor = $(`[name="${item.campo}"]`).val();
      if (!valor || valor.trim() === '') {
        camposVazios.push(item.nome);
      }
    });
    $('.produto-item').each(function () {
      let descricao = $(this).find('[name="descricaoProduto"]').val();
      let unidade = $(this).find('[name="unidadeMedida"]').val();
      let quantidade = $(this).find('[name="qtdeEstoque"]').val();
      let valor = $(this).find('[name="valorUnitario"]').val();
      if (!descricao || !unidade || !quantidade || !valor) {
        camposVazios.push('Dados do produto');
      }
    });
    $('.anexo-item').each(function () {
      let arquivo = $(this).find('input[type="file"]')[0];
      if (!arquivo.files || !arquivo.files[0]) {
        camposVazios.push('Arquivo anexo');
      }
    });
    if (camposVazios.length > 0) {
      alert('Campos obrigatórios não preenchidos:\n- ' + camposVazios.join('\n- '));
      return false;
    }
    return true;
  }

  function coletarTodosOsDados() {
    let dados = {
      razaoSocial: $('[name="razaoSocial"]').val(),
      nomeFantasia: $('[name="nomeFantasia"]').val(),
      cnpj: $('[name="cnpj"]').val(),
      inscricaoEstadual: $('[name="inscricaoEstadual"]').val(),
      inscricaoMunicipal: $('[name="inscricaoMunicipal"]').val(),
      cep: $('[name="cep"]').val(),
      endereco: $('[name="endereco"]').val(),
      numero: $('[name="numero"]').val(),
      complemento: $('[name="complemento"]').val(),
      bairro: $('[name="bairro"]').val(),
      cidade: $('[name="cidade"]').val(),
      estado: $('[name="estado"]').val(),
      nomeContato: $('[name="nomeContato"]').val(),
      telefoneContato: $('[name="telefoneContato"]').val(),
      emailContato: $('[name="emailContato"]').val(),
      produtos: [],
      anexos: []
    };

    $('.produto-item').each(function (indice) {
      let produto = {
        indice: indice + 1,
        descricaoProduto: $(this).find('[name="descricaoProduto"]').val(),
        unidadeMedida: $(this).find('[name="unidadeMedida"]').val(),
        qtdeEstoque: parseFloat($(this).find('[name="qtdeEstoque"]').val()),
        valorUnitario: parseFloat($(this).find('[name="valorUnitario"]').val()),
        valorTotal: parseFloat($(this).find('[name="valorTotal"]').val())
      };
      dados.produtos.push(produto);
    });

    $('.anexo-item').each(function (indice) {
      let inputArquivo = $(this).find('input[type="file"]')[0];
      let chaveArquivo = $(this).data('chave-arquivo');
      let arquivoSalvo = sessionStorage.getItem(chaveArquivo);
      if (inputArquivo.files && inputArquivo.files[0] && arquivoSalvo) {
        let anexo = {
          indice: indice + 1,
          nomeArquivo: inputArquivo.files[0].name,
          tamanhoArquivo: inputArquivo.files[0].size,
          tipoArquivo: inputArquivo.files[0].type,
          blobArquivo: arquivoSalvo
        };
        dados.anexos.push(anexo);
      }
    });

    return dados;
  }
});
