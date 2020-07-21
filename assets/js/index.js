const currentDate = moment(new Date()).format('DD/MM');

var oee = [77, 80, 85, 83, 85, 87, 90, 88, 85, 83, 80, 83, 84, 87, 90, 91, 95, 94, 96, 98, 94, 93, 89];

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

OEESimulator = async function () {

    await oee.forEach((oee, i) => {
        setTimeout(() => {
            $("#OEE-text").html(`OEE : ${oee}%`)
        }, i * 3000);
    });
    setTimeout(() => {
        OEESimulator();
    }, 3000 * oee.length);

}

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

function montarInfoHeader(listaInfoHeader, callback) {

    listaInfoHeader.map((info) => {

        $('#divAYInfo').css('background-color', info.AY_cor).css('color', info.AY_cor_fonte);
        $('#divFPYInfo').css('background-color', info.FPY_cor).css('color', info.FPY_cor_fonte);
        //  $('#textSKUInfo').css({ 'font-size': '50px', 'font-weight': 'bold' });
        $('#textAYInfo, #textFPYInfo').css({ 'font-size': '90px', 'font-weight': 'bold' });

        $('#textItemOrgInfo').html(info.ItemNome)


        $('#textSKUInfo').html(info.SKU)

        // $.when($('#textItemOrgInfo').html(info.ItemNome)).then(function () {
        //     resize_to_fit('divItemOrgInfo', 'textItemOrgInfo')
        // });
        // $.when($('#textSKUInfo').html(info.SKU)).then(function () {
        //     resize_to_fit('divSKUInfo', 'textSKUInfo')
        // });



        switch (tipoVisao) {
            case 'LINHA':
                $('#textAYInfo').html('AY: ' + info.AY_valor + '%')
                $('#textFPYInfo').html('FPY: ' + info.FPY_valor + '%');

                break;
            case 'FLUXO':
                $('#textAYInfo').html('OLE: ' + info.AY_valor + '%')
                $('#textFPYInfo').html('SCRAP: ' + info.FPY_valor)
                if (userPermitido() == true) {
                    $('#divFPYInfo').attr({ 'data-toggle': 'modal', 'data-target': '#modalScrap' });
                    $('#divSKUInfo').attr({ 'data-toggle': "modal", 'data-target': "#modalSKU" });
                }
                break;
            case 'MAQUINA':
                $('#textAYInfo').html('OEE: ' + info.AY_valor + '%')
                $('#textFPYInfo').html('SCRAP: ' + info.FPY_valor)
                if (userPermitido() == true) {

                    $('#divFPYInfo').attr({ 'data-toggle': 'modal', 'data-target': '#modalScrap' });
                    $('#divSKUInfo').attr({ 'data-toggle': "modal", 'data-target': "#modalSKU" });
                }
                break;

            default:
                break;
        }
    })
    callback();
}

function montarTurnosAnteriores(listaTurnosAnteriores, callback) {
    $('#tabelaTurno1 tbody').html(" ")
    $('#tabelaTurno2 tbody').html(" ")
    $('#tabelaTurno3 tbody').html(" ")
    $('#tabelaTurno4 tbody').html(" ")

    let corBackGround = '';
    let campoTurno = 1;


    listaTurnosAnteriores.map((info) => {
        let cardParada = '';
        let cardMicro = '';



        if (moment(info.data).format('DD/MM') == currentDate) {
            corBackGround = '#012f60';
            $('#tabelaTurno' + campoTurno).addClass('hoje');
        } else {
            corBackGround = 'gray'
        }

        switch (info.temParadaInt) {
            case "1":
                cardParada = `<div class="col-sm-3" style='border-radius: 5px; background-color: red'></div>`

                break;
            case "2":
                cardParada = `<div class="col-sm-3" style='border-radius: 5px; background-color: red'></div>`

                break;
            default:
                cardParada = '<div class="col-sm-3"></div>'
                break;
        }

        let linha = `<tr>
            <td>${info.capacidadeTotal}</td>
            <td>${info.capaciReal}</td>
            <td>${info.prodMeta}</td>
            <td>${info.diferenca}</td>
            <td>${info.prodReal}</td>
        </tr>`;



        $('#tituloTabelaTurno' + campoTurno).html(`
        <div class='row'>
            <div class='col-sm-2'> </div>   
            <div class='col-sm-8'>${info.nomeTurno.toUpperCase()} - ${info.data == '1900-01-01T00:00:00' ? '' : moment(info.data).format('DD/MM')}</div>
            <div class='col-sm-1 m-0 p-0'></div>
            <div class='col-sm-1 m-0 p-0'>
                <div class='row m-0' style='height:100%'>
                <div class="col-sm-3 mr-1"></div>
                ${cardParada}

                
                </div>

        </div>

  
        </div>
        </div>
        `).css('background-color', corBackGround)
        $('#tabelaTurno' + campoTurno + ' tbody').append(linha);
        campoTurno += 1;
    })
    $('.divTable td').css({ 'font-size': '25px', 'border': '2px solid #F8F8F8', 'padding': '0' })
    $('.divTable th').css({ 'font-size': '25px', 'border': '2px solid #F8F8F8' });
    $('.tituloAnteriores').css('font-size', '25px')

    $('#tituloTabelaTurno1,#tituloTabelaTurno2,#tituloTabelaTurno3,#tituloTabelaTurno4').off()


    for (let i = 1; i < 5; i++) {
        $('#tituloTabelaTurno' + i).on('click', function () {
            refereTurnoAnterior = true;
            let parada = listaTurnosAnteriores[i - 1]
            getDadosParadas(parada.temParada, parada.data, parada.horaFim, parada.classificacaoParada);
        })
    }

    callback();
}

function montarTurnoAtual(listaTurnoAtual, callback) {

    $('#turno_atual tbody').html('');
    $('#tituloTurnoAtual').html(`${listaTurnoAtual[0].nomeTurno.toUpperCase()} - ${moment(listaTurnoAtual[0].dataInicial).format('DD/MM')}`)
    listaTurnoAtual.map((info) => {
        let cardMicro = '';
        let cardParada = '';
        switch (info.temParadaInt) {
            case "1":
                cardParada = `<div class="col-sm-4  mr-1 " style='border-radius: 5px; background-color: red'></div>`
                break;
            case '2':
                cardParada = `<div class="col-sm-4  mr-1 " style='border-radius: 5px; background-color: red'></div>`
                cardMicro = `<div class="col-sm-4 bg-warning" style='border-radius: 5px'></div>`

                break;
            case "3":
                cardParada = '<div class="col-sm-4  mr-1"></div>'
                cardMicro = `<div class="col-sm-4 bg-warning" style='border-radius: 5px'></div>`

                break;

            default:
                break;
        }

        info.corBack = info.horaInicio.trim() == 'Total' ? 'white' : info.corBack; // GAMBIARRA ADICIONAL



        let linha =
            `<tr style='height: 30px !important'>
            <td class='info'>${info.horaInicio}${info.horaFim}</td>
            <td class='info'>${info.capacidadeTotal}</td>
            <td class='info'>${info.capaciReal}</td>
            <td class='info'>${info.prodMeta}</td>
            <td class='info' style='background-color: ${info.corBack}; color: ${info.corFonte} !important'>${info.diferenca}</td>
            <td class='info'>${info.prodReal}</td>
            <td class='p-1 causa' style='display:block;;height:60px; font-size: 31px; border-radius: 10px;background-color: #D8D8D8;' onclick='getDadosParadas(${info.temParada}, "${info.dataInicial}", "${info.horaFim}", ${info.classificacaoParada})'> 
            <div class='row causadiv' style='height: 100%'>
                <div class='col-sm-11' ><span class='obs' >${info.observacaoDash}</span></div>
                <div class='col-sm-1 p-0'>
                    <div class="row m-0" style='height: 100%'>
                        ${cardParada}
                        ${cardMicro}
                    </div>
                </div>
            </div>
            </td>
            </tr>`;

        $('#turno_atual tbody').append(linha);



    })

    $('#turno_atual tbody tr:last .causa').css('color', 'Darkblue').css({ 'background-color': 'white', 'border-radius': '0px' }).html('')
    $(`#turno_atual tbody tr:eq(${$(`#turno_atual tbody tr`).length - 1}) .causa`).css({ 'background-color': 'white !important', 'border-radius': '0px' }).html('');



    callback();
    // resize_to_fit('.causa', '.observacao');
}

function refit_obseracao() {
    $('.causadiv').each(function () {
        var fontsize = $(this).children().children().first().css('font-size');
        let paiHeight = $(this).height();
        let paiWidth = $(this).width();

        while (paiHeight <= $(this).children().children().first().height() - 20 || paiWidth <= $(this).children().children().first().width()) {
            $(this).children().children().first().css('fontSize', parseFloat(fontsize) - 3);
            fontsize = $(this).children().children().first().css('font-size');
        }
    })
}

function buildProductScrap() { // REFERENTE AO MODAL DE SCRAP
    resetScrapModal()
    $('#div_apontamentoSerial').removeClass('btn-info').addClass('btn-secondary');
    $('#div_apontamentoSKU').removeClass('btn-secondary').addClass('btn-info');
    $('#inputSerialApontamento, #serial-number-div').attr('disabled', true)
    $('#amount-div, #inputQuantidadeScrap').removeClass('hide').attr('disabled', false);
    $('#selectSKUScrap').attr('disabled', false);
    $("#amount-div").show()
    $("#serial-number-div").hide()

}
function buildSerialNumberScrap() { // REFERENTE AO MODAL DE SCRAP
    resetScrapModal()
    $('#div_apontamentoSKU').removeClass('btn-info').addClass('btn-secondary');
    $('#div_apontamentoSerial').removeClass('btn-secondary').addClass('btn-info');

    $('#serial-number-div, #inputSerialApontamento, #labelExiste').removeClass('hide').attr('disabled', false)
    $('#selectSKUScrap').attr('disabled', true).val('Selecione');
    $('#labelExiste').html('Numero serial inexistente').addClass('text-danger').removeClass('text-success');
    $('#serial-number-div').show();
    $("#amount-div").hide()

}

function saveNewScrap() {
    const amountScrap = parseInt($("#amount-scrap-input").val());
    const currentScraps = parseInt($('#scrap-text').html().substring(8, 9));
    const totalScraps = currentScraps + amountScrap
    Swal.fire({
        position: 'top-middle',
        icon: 'success',
        title: 'Salvo com sucesso',
        showConfirmButton: false,
        timer: 1500
    })
    $('#scrap-modal').modal('toggle');
    $('#scrap-text').html(`SCRAP : ${totalScraps} `);

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

function montarTotalDia() {
    let totalDia = calcularTotalDia();

    let linha = `< tr >
    <td class='info'>Total Dia</td>
    <td class='info'>${totalDia.totalCap}</td>
    <td class='info'>${totalDia.TotaldifCapacidade}</td>
    <td class='info'>${totalDia.totalProdPlan}</td>
    <td class='info'>${totalDia.totalDifPlan}</td>
    <td class='info'>${totalDia.totalProdReal}</td>
        </tr > `;

    $('#turno_atual tbody').append(linha);
    $('#turno_atual tbody tr:last .info').css('color', 'Darkblue');
    $(`#turno_atual tbody tr: eq(${$(`#turno_atual tbody tr`).length - 2}) .info`).css('color', 'Royalblue')
}

//  =================================================================================================================================
//  -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# FUNCS DE MANUTENCAO -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
//  =================================================================================================================================

function resetScrapModal() {

    $('#selectMachine, #selectProduct, #scrapReason1, #scrapReason2').val('Selecione');
    $('#inputDateScrap, #amount-scrap-input, #serial-number-input, #scrap-comment').val('');
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

function verificaSelectsInvalidos(modal) {
    let valoresDosSelects = $('#' + modal + ' select:enabled').map(function () { return $(this).val() }).get();


    return (valoresDosSelects.includes('Selecione')) ? true : false
}
