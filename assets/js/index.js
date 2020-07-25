var indexStop = 0;
const currentDate = moment(new Date('2020-07-24 00:00:00').toUTCString()).format('YYYY-MM-DD');
var stoppages = [];

var interval;


$(function () {

    OEESimulator();

    $('#input-scrap-date').datetimepicker({
        format: 'DD/MM/YYYY HH:mm:ss'
    })

    // ------------------------------------------ MODAL CONFIGS -----------------------------------------

    $('#scrap-modal').on('show.bs.modal', function () {
        resetScrapModal()
        buildProductScrap();
    });
    //  -----------------------------------------  SCRAP REASONS -----------------------------------------

    $('#scrapReason1').on('change', function () {
        if ($(this).val() != "Selecione") {
            $("#scrapReason2").attr('disabled', false)
        } else {
            $("#scrapReason2").attr('disabled', true)
        }
    })

    //  --------------------------------------------  STOPS  ---------------------------------------
    $('#reason1-select').on('change', function () {
        if ($(this).val() != 0) {
            buildStopsReasonsLevel2();
            $('#reason2-select').attr('disabled', false)
        } else {
            $('#reason2-select').attr('disabled', true).val(0)
        }

    })

    $('#justify-modal').on('hide.bs.modal', function () {
        indexStop = 0;
    })

    $(".td-cause").on('click', function () {
        interval = $(this).parent().children().first().html().split("-") // FIXO
        buildStoppage()
    })

})

//  =================================================================================================================================
//  -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# STOPPAGE MODAL FUNCS -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
//  =================================================================================================================================

function buildStoppage() {

    const stops = getStopData(interval);
    resumeStops(interval, stops);

    resetStoppageModal();
    $("#stoppage-div").addClass("selected-stoppage-type");
    $("#minor-div").removeClass("selected-stoppage-type");

    const stoppages = stops.filter(function (s) { return s.classification == "stoppage" })
    indexStop = indexStop >= stoppages.length ? stoppages.length - 1 : indexStop

    $("#stoppage-id").val(stoppages[indexStop].id)
    $("#work-station").html(`Estação: ${stoppages[indexStop].workstation}`)
    $("#stop-interval").html(`Horario: </br> ${stoppages[indexStop].startDate.substring(11)} - ${stoppages[indexStop].endDate.substring(11)}`)

    //  ------------------ CHECKs IF JUSTIFIED -----------------
    if (stoppages[indexStop].justified) {
        $("#is-justified").children().addClass('fa-check-circle').removeClass('fa-minus-circle').css('color', 'green');
        buildJustified(stoppages[indexStop]);
    } else {
        $("#is-justified").children().removeClass('fa-check-circle').addClass('fa-minus-circle').css('color', 'red');
    }
}
function buildMinorStoppage() {

    resetStoppageModal();

    $("#minor-div").addClass("selected-stoppage-type");
    $("#stoppage-div").removeClass("selected-stoppage-type");

    const stops = getStopData(interval)
    resumeStops(interval, stops);

    const minorStoppages = stops.filter(function (s) { return s.classification == "minor" })
    indexStop = indexStop >= minorStoppages.length ? minorStoppages.length - 1 : indexStop

    //  ------------------ CHECK IF JUSTIFIED ----------------- 
    $("#stoppage-id").val(minorStoppages[indexStop].id)
    $("#work-station").html(`Estação: ${minorStoppages[indexStop].workstation}`)
    $("#stop-interval").html(`Horario: </br> ${minorStoppages[indexStop].startDate.substring(11)} - ${minorStoppages[indexStop].endDate.substring(11)}`)

    if (minorStoppages[indexStop].justified) {
        $("#is-justified").children().addClass('fa-check-circle').removeClass('fa-minus-circle').css('color', 'green');
        buildJustified(minorStoppages[indexStop]);
    } else {
        $("#is-justified").children().removeClass('fa-check-circle').addClass('fa-minus-circle').css('color', 'red');
    }
}
function buildJustified(stop) {
    $("#reason1-select").val(stop.reason1).attr('disabled', true)
    buildStopsReasonsLevel2()
    $("#reason2-select").val(stop.reason2).attr('disabled', true)
    $("#comment").val(stop.comment).attr('disabled', true)
}
function getNextStop() {
    indexStop += 1
    $("#stoppage-div").hasClass("selected-stoppage-type") ?
        buildStoppage() :
        buildMinorStoppage()
}
function getPreviousStop() {
    indexStop += indexStop > 0 ? -1 : indexStop
    $("#stoppage-div").hasClass("selected-stoppage-type") ?
        buildStoppage() :
        buildMinorStoppage()
}
function resumeStops(interval, stoppages) {
    const type = ["minor", "stoppage"];

    const start = currentDate + ' ' + interval[0].trim()
    const end = currentDate + ' ' + interval[1].trim()

    $("#stoppage-interval, #minor-interval").html(`${start.substring(11)} - ${end.substring(11)}`);

    type.forEach(function (classification) {

        let stops = stoppages.filter(function (s) { return s.classification == classification });

        let resume = [0, 0, 0];

        stops.map(function (stop) {
            resume[0] += 1; // COUNT
            resume[1] += stop.amountProducts; // PRODUCTS
            resume[2] += stop.intervalMinutes; // MINUTES
        })
        $(`#${classification}-resume`).html(`${resume[0]} Parada(s) - ${resume[1]} Produto(s) - ${resume[2]} Minuto(s)`)
    })


}
function buildStopsReasonsLevel2() {
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
        $('#reason2-select').append(option);
    })

}
function resetStoppageModal() {
    $("#reason1-select").val("0").attr('disabled', false)
    $("#reason2-select").val("0").attr('disabled', true)
    $("#comment").val(null).attr('disabled', false)
}
function getStopData(interval) {

    const startDate = currentDate + ' ' + interval[0].trim()
    const endDate = currentDate + ' ' + interval[1].trim()

    const stoppages = stops.filter(function (s) {
        return new Date(s.startDate) >= new Date(startDate) &&
            new Date(s.endDate) <= new Date(endDate)
    })
    return stoppages.sort(compareDate)

}
function saveNewJustification() {
    if (validateEmptyRequiredFields('justify-modal') == "invalid") { return }

    const reason1 = $("#reason1-select").val()
    const reason2 = $("#reason2-select").val()
    const comment = $("#comment").val()
    const id = $("#stoppage-id").val()

    let stop = stops.find(stop => stop.id == id)

    stop.reason1 = reason1
    stop.reason2 = reason2
    stop.comment = comment
    stop.justified = true;

    Swal.fire("", "Justificativa salva com sucesso", "success")

    $("#justify-modal").modal("toggle");

}

//  =================================================================================================================================
//  -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# SPLIT MODAL FUNCS -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
//  =================================================================================================================================

function buildSplitModal() {

    const stopId = $("#stoppage-id").val();
    const [startDate, endDate] = $("#stop-interval").html().split("<br>")[1].trim().split("-")

    $("#split-stoppage").html(`Parada ID: ${stopId}`)
    $("#split-interval").html(`Horario: ${startDate} - ${endDate}`);

    $('#datetimepicker1').datetimepicker('destroy')

    $('#datetimepicker1').datetimepicker({
        format: 'HH:mm:ss',
        minDate: new Date(`${currentDate} ${startDate.trim()}`),
        maxDate: new Date(`${currentDate} ${endDate.trim()}`)

    })

}
function saveSplit() {
    const stopID = $("#stoppage-id").val();
    const originalStop = stops.find(function (s) { return s.id == stopID });

    const newEndDate = $("#input-split-date").val()

    const newStop = {
        "id": stops.length + 1,
        "startDate": "2020-07-24 " + newEndDate,
        "endDate": originalStop.endDate,
        "workstation": originalStop.workstation,
        "justified": originalStop.justified,
        "reason1": originalStop.reason1,
        "reason2": originalStop.reason2,
        "comment": originalStop.comment,
        "classification": originalStop.classification,
        "intervalMinutes": originalStop.intervalMinutes,
        "amountProducts": originalStop.amountProducts
    }

    originalStop.endDate = currentDate + " " + newEndDate;

    stops.push(newStop);

    Swal.fire("", "Divisao inserida com sucesso", "success");

    buildStoppage()
    $("#split-modal").modal('toggle');


}

//  =================================================================================================================================
//  -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# SCRAP MODAL FUNCS -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
//  =================================================================================================================================

function buildProductScrap() { // REFERENTE AO MODAL DE SCRAP
    resetScrapModal()
    $('#div_apontamentoSerial').removeClass('btn-info').addClass('btn-secondary');
    $('#div_apontamentoSKU').removeClass('btn-secondary').addClass('btn-info');

    $('#serial-number-input, #serial-number-div').attr('disabled', true)
    $('#selectProduct').attr('disabled', false);
    $("#amount-div, #amount-scrap-input").show().attr('disabled', false);
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
function resetScrapModal() {

    $('#selectMachine, #selectProduct, #scrapReason1, #scrapReason2').val('Selecione');
    $('#amount-scrap-input, #serial-number-input, #scrap-comment').val('');
    $('#inputDateScrap').val(new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
    $('#scrapReason2').attr('disabled', true);

    $('#selectSKUScrap').val(null);
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
//  -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# MAINTENANCE FUNCS-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
//  =================================================================================================================================

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
function OEESimulator() {

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
function compareDate(a, b) {
    // Use toUpperCase() to ignore character casing
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.endDate);

    let comparison = 0;
    if (dateA > dateB) {
        comparison = 1;
    } else if (dateA < dateB) {
        comparison = -1;
    }
    return comparison;
}

//  =================================================================================================================================
//  -#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-# DATA MOCK-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
//  =================================================================================================================================

var oee = [55, 57, 59, 62, 65, 77, 80, 85, 83, 85, 87, 90, 88, 85, 83, 80, 83, 84, 87, 90, 91, 95, 94, 96, 98, 94, 93, 89];

var stops = [
    {
        "id": 1,
        "startDate": "2020-07-24 10:07:00",
        "endDate": "2020-07-24 10:11:00",
        "workstation": "WS0010",
        "justified": false,
        "reason1": null,
        "reason2": null,
        "comment": null,
        "classification": "stoppage",
        "intervalMinutes": 3,
        "amountProducts": 6
    },
    {
        "id": 2,
        "startDate": "2020-07-24 10:15:00",
        "endDate": "2020-07-24 10:18:00",
        "workstation": "WS0010",
        "justified": true,
        "reason1": 1,
        "reason2": 2,
        "comment": "Funcionario solicitou pausa",
        "classification": "stoppage",
        "intervalMinutes": 4,
        "amountProducts": 8
    },
    {
        "id": 3,
        "startDate": "2020-07-24 10:36:00",
        "endDate": "2020-07-24 10:42:00",
        "workstation": "WS0010",
        "justified": false,
        "reason1": null,
        "reason2": null,
        "comment": null,
        "classification": "stoppage",
        "intervalMinutes": 6,
        "amountProducts": 12
    },
    {
        "id": 4,
        "startDate": "2020-07-24 10:12:00",
        "endDate": "2020-07-24 10:12:50",
        "workstation": "WS0010",
        "justified": false,
        "reason1": null,
        "reason2": null,
        "comment": null,
        "classification": "minor",
        "intervalMinutes": 0.8,
        "amountProducts": 1
    },
    {
        "id": 5,
        "startDate": "2020-07-24 13:16:00",
        "endDate": "2020-07-24 13:20:50",
        "workstation": "WS0010",
        "justified": false,
        "reason1": null,
        "reason2": null,
        "comment": null,
        "classification": "stoppage",
        "intervalMinutes": 4.8,
        "amountProducts": 9
    },
    {
        "id": 6,
        "startDate": "2020-07-24 13:32:00",
        "endDate": "2020-07-24 13:38:50",
        "workstation": "WS0010",
        "justified": false,
        "reason1": null,
        "reason2": null,
        "comment": null,
        "classification": "stoppage",
        "intervalMinutes": 6.8,
        "amountProducts": 13
    },
    {
        "id": 7,
        "startDate": "2020-07-24 13:43:00",
        "endDate": "2020-07-24 13:44:50",
        "workstation": "WS0010",
        "justified": false,
        "reason1": null,
        "reason2": null,
        "comment": null,
        "classification": "minor",
        "intervalMinutes": 1.8,
        "amountProducts": 4
    },
    {
        "id": 8,
        "startDate": "2020-07-24 13:52:00",
        "endDate": "2020-07-24 13:54:50",
        "workstation": "WS0010",
        "justified": true,
        "reason1": 2,
        "reason2": 2,
        "comment": "Pausa para lanche",
        "classification": "minor",
        "intervalMinutes": 2.8,
        "amountProducts": 6
    },
]