const currentDate = moment(new Date()).format('DD/MM');

var oee = [55, 57, 59, 62, 65, 77, 80, 85, 83, 85, 87, 90, 88, 85, 83, 80, 83, 84, 87, 90, 91, 95, 94, 96, 98, 94, 93, 89];

$(function () {


    OEESimulator();

    $('#inputDateScrap').datetimepicker({
        format: 'DD/MM/YYYY HH:mm:ss'
    })

    // ----------------------------- MODAL CONFIGS -----------------------------------------------------

    $('#scrap-modal').on('show.bs.modal', function () {
        resetScrapModal()
        buildProductScrap();
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
            $("#scrapReason2").attr('disabled', true)
        }
    })


    //  ----------------------------------------- MOTIVOS PARADAS -----------------------------------------
    $('#reason1-select').on('change', function () {
        if ($(this).val() != 0) {
            buildReasonLevel2();
            $('#reason2-select').attr('disabled', false)
        } else {
            $('#reason2-select').attr('disabled', true).val(0)
        }

    })

    // ------------------------------------------- CLICK/CHANGE EVENTS -------------------------------------

    $('#btnModalDivisoes').on('click', function () {
        montaModalDivisao(parameGetDadosParada.classificacaoParada);
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


function buildStoppage(classificacaoParada) {
    $("#stoppage-div").addClass("selected-stoppage-type");
    $("#minor-div").removeClass("selected-stoppage-type")
}
function buildMinorStoppage(classificacaoParada) {
    $("#minor-div").addClass("selected-stoppage-type");
    $("#stoppage-div").removeClass("selected-stoppage-type")
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

//  =================================================================================================================================
//  -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# FUNCS DE MANUTENCAO -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
//  =================================================================================================================================

function buildReasonLevel2() {
    const reasons = [
        {
            "idPai": 1,
            "motivos": [
                { "id": 1, "nome": 'Banheiro' },
                { "id": 2, "nome": 'Ginastica' },
                { "id": 3, "nome": 'Lanche' },
                { "id": 4, "nome": 'Almoco' }
            ]
        },
        {
            "idPai": 2,
            "motivos": [
                { "id": 1, "nome": 'Parafuso' },
                { "id": 2, "nome": 'Placa' },
                { "id": 3, "nome": 'Fio de cobre' },
                { "id": 4, "nome": 'Estanho' }
            ]
        },
        {
            "idPai": 3,
            "motivos": [
                { "id": 1, "nome": 'Maquina Quebrada' },
                { "id": 2, "nome": 'Reposicao Solda' },
                { "id": 3, "nome": 'Reposicao de Estoque' },
                { "id": 4, "nome": 'Esteira travada' }
            ]
        },

    ]

    const reason1 = parseInt($("#reason1-select").val())
    const reason2 = reasons.find(function (reason) { return reason.idPai == reason1 }).motivos

    $('#reason2-select option').remove()
    $('#reason2-select').append(`<option value="0">Selecione</option>`)
    reason2.forEach(function (m) {
        const option = `<option value="${m.id}">${m.nome}</option>`
        console.log(option);
        $('#reason2-select').append(option);
    })

}

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