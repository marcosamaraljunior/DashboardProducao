const currentDate = moment(new Date()).format('DD/MM');

var oee = [55, 57, 59, 62, 65, 77, 80, 85, 83, 85, 87, 90, 88, 85, 83, 80, 83, 84, 87, 90, 91, 95, 94, 96, 98, 94, 93, 89];

var tipoVisao, idItemOrg, estacaoParada
var dataParada
var index = 0;
var refereTurnoAnterior = false;
var parameGetDadosParada, ultimoSelect = {}
var arrayParadas = [];
var tempoRefresh

var firstLoad = true;

var popUpAberto = false;

var listaInfoHeader, listaTurnosAnteriores, listaTurnoAtual, listaParadas, listaPausas, listaEstacoes, listaProdutos, listaMotivosScrap, listaOrigem = [];

let counter = 0;

$(function () {


    OEESimulator();

    $('#datetimepicker1').datetimepicker({
        // format: 'DD/MM/YYYY HH:mm:ss'
    });

    $('#inputDateScrap').datetimepicker({
        format: 'DD/MM/YYYY HH:mm:ss'

        // maxDate: moment(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }), 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    })

    // $('.bootstrap-datetimepicker-widget.dropdown-menu').css('width', 'auto !important').attr('style', 'font-size: 15px !important');


    // ----------------------------- MODAL CONFIGS -----------------------------------------------------

    $('.modal').on("show.bs.modal", function () {
        // clearInterval(tempoRefresh);
        // popUpAberto = true;
    })
    $('#scrap-modal').on('show.bs.modal', function () {
        resetScrapModal()
        buildProductScrap();
    });
    $('#modalSKU').on('show.bs.modal', function () {
        $('#selectSKU').val(null)
        // getProdutoAtual();
    });

    // ----------- HIDE ---------------
    $('.modal').on('hide.bs.modal', function () {
        // index = 0;
        // refereTurnoAnterior = false;
        // getDados();
        // popUpAberto = false
    })

    //  ----------------------------------------- MOTIVOS SCRAP -----------------------------------------
    $('#selectSKUScrap').on('change', function () {
        let idProduto = $(`#selectSKUScrapList option[value='${$('#selectSKUScrap').val()}']`).attr('data-id') == null ? 0 : $(`#selectSKUScrapList option[value='${$('#selectSKUScrap').val()}']`).attr('data-id');
        carregarMotivoScrap(idProduto, '', 'scrapReason1', () => { })
    })
    $('#scrapReason1').on('change', function () {
        if ($(this).val() != "Selecione") {
            $("#scrapReason2").attr('disabled', false)
        } else {
            $("#scrapReason2").attr('disabled', true).val("Selecione")
        }
    })
    $('#dplNivel2Scrap').on('change', function () {
        let idProduto = $(`#selectSKUScrapList option[value='${$('#selectSKUScrap').val()}']`).attr('data-id') == null ? 0 : $('#selectSKUScrapList option[value=' + $('#selectSKUScrap').val() + ']').attr('data-id');
        let valorNivel = $('#dplNivel2Scrap').val();
        carregarMotivoScrap(idProduto, valorNivel, 'dplNivel3Scrap', () => { })
    })
    $('#dplNivel3Scrap').on('change', function () {
        let idProduto = $(`#selectSKUScrapList option[value='${$('#selectSKUScrap').val()}']`).attr('data-id') == null ? 0 : $(`#selectSKUScrapList option[value='${$('#selectSKUScrap').val()}']`).attr('data-id');
        let valorNivel = $('#dplNivel3Scrap').val();
        carregarMotivoScrap(idProduto, valorNivel, 'dplNivel4Scrap', () => { })

    })

    //  ----------------------------------------- MOTIVOS PARADAS -----------------------------------------
    $('#dplNivel1').on('change', function () {
        let valor = $('#dplNivel1').val();
        carregarProximoMotivo(valor, 'dplNivel2', () => { });
    })
    $('#dplNivel2').on('change', function () {
        let valor = $('#dplNivel2').val();
        carregarProximoMotivo(valor, 'dplNivel3', () => { });
    })
    $('#dplNivel3').on('change', function () {
        let valor = $('#dplNivel3').val();
        carregarProximoMotivo(valor, 'dplNivel4', () => { });
    })

    // ------------------------------------------- CLICK/CHANGE EVENTS -------------------------------------
    $('#btnVoltarModalParada').on('click', function () {
        index -= 1;
        montarParada(parameGetDadosParada.classificacaoParada);
    })
    $('#btnAvancarModalParada').on('click', function () {
        index += 1;
        montarParada(parameGetDadosParada.classificacaoParada);
    })

    $('#btnModalDivisoes').on('click', function () {
        montaModalDivisao(parameGetDadosParada.classificacaoParada);
    })


    $('#inputSerialApontamento').on("change", function () {
        getSerialNumber(function () {

        });

    })

})

//  =================================================================================================================================
//-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# REQUEST DE DADOS -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
//  =================================================================================================================================

function getProdutoAtual() {
    let produto = {}

    $.ajax({
        url: trxProduto,
        type: 'GET',
        datatype: 'XML',
        data: {
            'tipo': 'SELECT',
            'idItemOrg': idItemOrg,
            'visao': tipoVisao
        },
        success: function (data) {
            $(data).find('Row').each(function () {
                produto.idProduto = $(this).find('IdProduto').text();
                produto.modelo = $(this).find('Modelo').text();
                produto.nomeProduto = $(this).find('NomeProduto').text();
            });
        }
    }).done(function () {
        montarModalProduto(produto);
    })
}

function getDados() { // ESTE METODO CHAMA OS 3 REQUESTS PRINCIPAIS DA TELA
    getInfoHeader(() => {
        montarInfoHeader(listaInfoHeader, () => {
            alreadyLoaded.info = true;
            verificarFullLoaded(() => {
                resize_to_fit('divItemOrgInfo', 'textItemOrgInfo')
                resize_to_fit('divSKUInfo', 'textSKUInfo')
                refit_obseracao();
            })
        })
    })
    getTurnosAnteriores(() => {
        montarTurnosAnteriores(listaTurnosAnteriores, () => {
            alreadyLoaded.anteriores = true;
            verificarFullLoaded(() => {
                resize_to_fit('divItemOrgInfo', 'textItemOrgInfo')
                resize_to_fit('divSKUInfo', 'textSKUInfo')
                refit_obseracao();
            })
        })
    })
    getTurnoAtual(() => {
        montarTurnoAtual(listaTurnoAtual, () => {
            montarTotalDia();
            alreadyLoaded.atual = true;
            verificarFullLoaded(() => {
                resize_to_fit('divItemOrgInfo', 'textItemOrgInfo')
                resize_to_fit('divSKUInfo', 'textSKUInfo');
                refit_obseracao();
            })
        })
    })
}



function getSerialNumber(callback) { // USADO PARA VERIFICAR SE O SERIAL NUMBER INSERIDO NO MODAL DE SCRAP EXISTE

    let input = $('#inputSerialApontamento').val();

    $.ajax({
        url: selectSerialNumber,
        type: 'GET',
        datatype: 'XML',
        data: {
            'Param.1': input
        }
    }).done(function (data) {
        $(data).find('Row').each(function () {
            let produto = parseInt($(this).find('IdProduto').text());

            if (produto != 0) {
                $('#selectSKUScrap').val($('#selectSKUScrapList option[data-id="' + produto + '"]').val());
                $('#labelExiste').html('Numero serial encontrado').addClass('text-success').removeClass('text-danger')

            } else {
                $('#selectSKUScrap').val(null);
                $('#labelExiste').html('Numero serial inexistente').addClass('text-danger').removeClass('text-success')
            }


        })
    }).done(function () {
        let idProduto = $(`#selectSKUScrapList option[value='${$('#selectSKUScrap').val()}']`).attr('data-id') == null ? 0 : $(`#selectSKUScrapList option[value='${$('#selectSKUScrap').val()}']`).attr('data-id');;
        carregarMotivoScrap(idProduto, '', 'scrapReason1', () => { })

        callback();
    })
}


function infoParadas() { // JA NO MODAL DE PARADAS, PEGA AS INFORMACOES SOBRE AS PARADAS, COMO QUANTIDADE, TEMPO, TOTAL PRODUTOS...


    let spanModalProdutosHeaderParada = 0
    let spanModalMinutosHeaderParada = 0;
    let spanModalProdutosHeaderMicro = 0
    let spanModalMinutosHeaderMicro = 0;


    let infoParadas = listaParadas.filter(function (parada) {
        return parada.classificacaoParada == 4
    })



    for (let i = 0; i < infoParadas.length; i++) {
        if (isNaN(infoParadas[i].qtdeProd) != true) {
            spanModalProdutosHeaderParada += parseInt(infoParadas[i].qtdeProd);

        }
        if (infoParadas[i].diferencaMinutos > 0) {
            spanModalMinutosHeaderParada += parseInt(infoParadas[i].diferencaMinutos);

        }
    }

    $('#spanParadasHeaderModal').html(infoParadas.length + ' Parada(s) - ' + spanModalProdutosHeaderParada + ' Produto(s) - ' + spanModalMinutosHeaderParada + ' Minuto(s)')

    let infoMicro = listaParadas.filter(function (parada) {
        return parada.classificacaoParada == 3
    })

    for (let i = 0; i < infoMicro.length; i++) {
        if (isNaN(infoMicro[i].qtdeProd) != true) {
            spanModalProdutosHeaderMicro += parseInt(infoMicro[i].qtdeProd);

        }
        if (infoMicro[i].diferencaMinutos > 0) {
            spanModalMinutosHeaderMicro += parseInt(infoMicro[i].diferencaMinutos);

        }
    }

    $('#spanMicroHeaderModal').html(infoMicro.length + ' Micro Parada(s) - ' + spanModalProdutosHeaderMicro + ' Produto(s) - ' + spanModalMinutosHeaderMicro + ' Minuto(s)')

}

function montarParada(classificacaoParada) {
    if (classificacaoParada == null) {
        loading.parada = false;
        return
    }

    arrayParadas = listaParadas.filter(function (parada) {
        return parada.classificacaoParada == classificacaoParada
    })


    if (refereTurnoAnterior == true) {
        arrayParadas = arrayParadas.filter(function (x) {


            return x.flagJust == 'NA' || x.flagJust == 0
        })
        if (arrayParadas.length <= 0) {
            arrayParadas = listaParadas.filter(function (parada) {
                return parada.classificacaoParada == classificacaoParada
            })
        }
    }


    infoParadas()
    montarBotoesPausas(listaPausas, arrayParadas);
    resetScrapModal()
    verificarBotaoProximo()

    switch (classificacaoParada) {
        case 4:
            $('#divHeaderModalParada').css({ 'border': "solid #007bff 5px" }).removeClass('text-muted').addClass('text-black')
            $('#divHeaderModalMicro').css({ 'border': "solid black 0px" }).removeClass('text-black').addClass('text-muted')
            break;
        case 3:
            $('#divHeaderModalMicro').css({ 'border': "solid #007bff 5px" }).removeClass('text-muted').addClass('text-black')
            $('#divHeaderModalParada').css({ 'border': "solid black 0px" }).removeClass('text-black').addClass('text-muted')
            $('#div_btnPausas button, #btnModalDivisoes, #pPausas').addClass('hide').attr('disabled')
            break
        default:
            break;
    }


    let parada = arrayParadas[index];
    parada.comentario = parada.comentario == 'NA' ? '' : parada.comentario

    let naoJustificadas = arrayParadas.filter(function (parada) {
        return parada.flagJust != 1
    })

    carregarMotivosNivel1(parada.idItemOrganizacao, 'dplNivel1');
    estacaoParada = parada.idItemOrganizacao;

    // -------------------  Monta Origem ---------------------   ESTE METODO DEVE SER RETRABALHADO E RETIRADO DAQUI
    $('#dplOrigem option').remove();
    listaOrigem.map(function (origem) {

        $('#dplOrigem').append(`<option value='${origem.idItemOrg}'>${origem.local}</option>`)
    })

    $('#dplOrigem').val(parada.idItemOrganizacao);
    //  -------------------- FIM -------------------------------

    $('#spanParadaEstacao').html(parada.itemNome);
    $('#spanParadasRestantes').html('Não justificadas: ' + naoJustificadas.length);
    $('#spanParada').html('Parada ' + (index + 1))
    $('#spanHorarioParada').html('Horário: ' + moment(parada.dataInicio).format("HH:mm:ss") + ' - ' + moment(parada.dataFim).format("HH:mm:ss"))

    if (parada.flagJust == 1) {
        $('#iconeJustificada').css('color: green;')
        $('#iconeJustificada').removeClass('fa-close').addClass('fa-check-circle')
        $('#iconeJustificada').css('color', 'green')
        $('#div_btnPausas button, #btnModalDivisoes, #div_btnCopiar').addClass('hide').attr('disabled')
    } else {
        $('#iconeJustificada').css('color', 'red').addClass('fa-close').removeClass('fa-check-circle')
    }

    if (parada.idMotivo1 != 'NA' && parada.paradaOuPausa == 'PARADA') {
        $('#dplNivel1,  #comentario, #pPausas, #dplOrigem').attr('disabled', true).addClass('hide')
        $('#motivoNv1').html('Motivo Nivel 1:   ' + parada.nomeMotivo1)
        $('#labelComentario').html('Comentario:   ' + parada.comentario);
        $('#origem').html('Origem:   ' + parada.origemNome);
    }
    if (parada.idMotivo2 != 'NA' && parada.paradaOuPausa == 'PARADA') {
        $('#dplNivel2').attr('disabled', true).addClass('hide')
        $('#motivoNv2').html('Motivo Nivel 2:   ' + parada.nomeMotivo2)
        $('#div_dplNivel2').removeClass('hide');
        $('#labelComentario').html('Comentario:   ' + parada.comentario);
    }
    if (parada.idMotivo2 != 'NA' && parada.paradaOuPausa == 'PAUSA') {
        $('#dplNivel2, #dplNivel1,  #comentario, #div_comentario, #pPausas, #div_dplNivel1, #dplOrigem, #div_dplOrigem').attr('disabled', true).addClass('hide')
        $('#motivoNv2').html('Pausa:   ' + parada.nomeMotivo2)
        $('#div_dplNivel2').removeClass('hide');
    }
    if (parada.idMotivo3 != 'NA' && parada.paradaOuPausa == 'PARADA') {
        $('#dplNivel3').attr('disabled', true).addClass('hide')
        $('#motivoNv3').html('Motivo Nivel 3:   ' + parada.nomeMotivo3)
        $('#div_dplNivel3').removeClass('hide');
        $('#labelComentario').html('Comentario:   ' + parada.comentario);
    }
    if (parada.idMotivo4 != 'NA' && parada.paradaOuPausa == 'PARADA') {
        $('#dplNivel4').attr('disabled', true).addClass('hide')
        $('#motivoNv4').html('Motivo Nivel 4:   ' + parada.nomeMotivo4)
        $('#div_dplNivel4').removeClass('hide');
        $('#labelComentario').html('Comentario:   ' + parada.comentario);
    }

    loading.parada = false;

}

function montarBotoesPausas(listaPausas, arrayParadas) {
    let parada = arrayParadas[index];

    $('#div_btnPausas button').remove()

    listaPausas.map((pausa) => {

        let botaoPausa = `<button id='${pausa.idPausa}' style='margin: 2px;' onclick='inserirPausa(${parada.idItemOrganizacao}, "${parada.dataInicio}", "${parada.dataFim}",${pausa.idPausa})' class='btn btn-rounded btn-outline-warning'>${pausa.nomePausa}</button>`
        $('#div_btnPausas').append(botaoPausa);
    })
}

function montaModalDivisao() {
    let parada = arrayParadas[index];
    if (parada.flagJust == 1) { return }

    let dataInicial = moment(parada.dataInicio).format("YYYY-MM-DD HH:mm:ss");
    let dataFim = moment(parada.dataFim).format("YYYY-MM-DD HH:mm:ss");


    $("#datetimepicker1").datetimepicker("destroy");
    $('#spanHorarioDivisaoParada').html('Horário: ' + moment(parada.dataInicio).format("HH:mm:ss") + ' - ' + moment(parada.dataFim).format("HH:mm:ss"))
    $('#datetimepicker1').datetimepicker({
        format: 'DD/MM/YYYY HH:mm:ss',

        minDate: dataInicial,
        maxDate: dataFim
    })


}

function montarModalProduto(produto) {
    if (produto.modelo != null) {
        $('#spanSKU').html(`Modelo: ${produto.modelo} - ${produto.nomeProduto}`);
    } else {
        $('#spanSKU').html(`Nenhum Modelo selecionado`);
    }


}


function buildProductScrap() { // REFERENTE AO MODAL DE SCRAP
    resetScrapModal()
    $('#div_apontamentoSerial').removeClass('btn-info').addClass('btn-secondary');
    $('#div_apontamentoSKU').removeClass('btn-secondary').addClass('btn-info');

    $('#serial-number-input, #serial-number-div').attr('disabled', true)
    $('#amount-div, #inputQuantidadeScrap').removeClass('hide').attr('disabled', false);
    $('#selectProduct').attr('disabled', false);
    $("#amount-div").show()
    $("#serial-number-div").hide()

}
function buildSerialNumberScrap() { // REFERENTE AO MODAL DE SCRAP
    resetScrapModal()
    $('#div_apontamentoSKU').removeClass('btn-info').addClass('btn-secondary');
    $('#div_apontamentoSerial').removeClass('btn-secondary').addClass('btn-info');

    $('#selectProduct').attr('disabled', true).val('Selecione');
    $('#serial-number-div, #serial-number-input').show().attr('disabled', false)
    $('#amount-scrap-input, #amount-div').attr('disabled', true).hide()

}

function saveNewScrap() {
    if (validateEmptyRequiredFields('scrap-modal') == "invalid") return

    const amountScrap = $("#amount-scrap-input").is(":enabled") ? parseInt($("#amount-scrap-input").val()) : 1;
    const currentScraps = parseInt($('#scrap-text').html().substring(8));

    Swal.fire('', 'Salvo com sucesso', 'success');
    $('#scrap-text').html(`SCRAP : ${currentScraps + amountScrap} `);
    $('#scrap-modal').modal('toggle');

}

function montarSelectProdutos(ListID) {  // REFERENTE AO MODAL DE SKU (DISPONIVEL SOMENTE NA VISAO oee OU ole)
    listaProdutos.map((info) => {
        $('#' + ListID).append(`< option value = '${info.nomeProduto}' data - id='${info.idProduto}' ></option > `);
    })
}
function montarselectMachineScrap() { // ESTE E O UNICO SELECT QUE FOI MONTADO SEPARADAMENTE DE SUA REQUISICAO
    listaEstacoes.map((info) => {
        $('#selectMachine').append(`< option value = '${info.idEstacao}' > ${info.local}</option > `);
    })
}


//  =================================================================================================================================
//  -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# FUNCS DE MANUTENCAO -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
//  =================================================================================================================================

function resetScrapModal() {

    $('#selectMachine, #selectProduct, #scrapReason1, #scrapReason2').val('Selecione');
    $('#amount-scrap-input, #serial-number-input, #scrap-comment').val('');
    $('#inputDateScrap').val(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
    $('#scrapReason2').attr('disabled', true);

    $('#selectSKUScrap').val(null);
}

function resetStoppageModal() {

    $('#dplNivel1, #pPausas, #dplOrigem').attr('disabled', false).val('Selecione').removeClass('hide');
    $('#pPausas, #div_dplNivel1, #btnModalDivisoes, #div_btnCopiar, #div_dplOrigem').attr('disabled', false).removeClass('hide');
    $('#motivoNv1').html('Motivo Nivel 1: ')
    $('#origem').html('Origem: ')

    for (let i = 2; i <= 4; i++) {
        $('#dplNivel' + i + ', #div_dplNivel' + i).attr('disabled', true).addClass('hide').val('Selecione');
        $('#motivoNv' + i).html('Motivo Nivel ' + i)
    }
    $('#comentario, #div_comentario').val('').attr('disabled', false).removeClass('hide');
    $('#labelComentario').html('Comentario: ')

}

function verificarBotaoProximo() {
    if (index <= 0) {
        $('#btnVoltarModalParada').attr('disabled', true);
    } else {
        $('#btnVoltarModalParada').attr('disabled', false);
    }

    if (index < arrayParadas.length - 1 && index >= 0) {
        $('#btnAvancarModalParada').attr('disabled', false);
    } else {
        $('#btnAvancarModalParada').attr('disabled', true);
    }
}

function validateEmptyRequiredFields(modal) {
    const filledFields = $('#scrap-modal input,#scrap-modal textarea,#scrap-modal select')
        .filter('[required]:visible:enabled')
        .map(function () { return $(this).val() })
        .get();

    if (filledFields.includes('Selecione') || filledFields.includes('')) {
        Swal.fire("", "Preencha os campos corretamente", "error")
        return "invalid";
    } else {
        return "valid"
    }
}

OEESimulator = function () {

    oee.forEach((oee, i) => {
        setTimeout(() => {
            $("#OEE-text").html(`OEE : ${oee}%`)
            setOEEColor(oee);
        }, i * 3000);
    });
    setTimeout(() => {
        OEESimulator();
    }, 3000 * oee.length);

}

function setOEEColor(oee) {

    if (oee < 90 && oee > 75) {
        $("#oee-status-circle").css({ 'background-color': '#ffd500' })
        $("#oee-status-circle").removeClass('flash');
    } else if (oee < 75) {
        $("#oee-status-circle").css({ 'background-color': '#ED2939' })
        $("#oee-status-circle").addClass('flash');
    } else {
        $("#oee-status-circle").css({ 'background-color': '#2e956e' })
        $("#oee-status-circle").removeClass('flash');
    }
}