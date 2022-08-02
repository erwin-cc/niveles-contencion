let nc2Ejes = [
    { tmda: "r1", bid: 300, unid: 360 },
    { tmda: "r2", bid: 0, unid: 0 },
    { tmda: "r3", bid: 0, unid: 0 },
    { tmda: "r4", bid: 0, unid: 0 }
]

let ncCam = [
    { tmda: "r1", bid: 120, unid: 150 },
    { tmda: "r2", bid: 0, unid: 0 },
]

let ncBusCam = [
    { tmda: "r1", bid: 250, unid: 300 },
    { tmda: "r2", bid: 0, unid: 0 },
]

const checkField = (objColection) => {
    let check = true;
    if (objColection.length > 0) {
        $(objColection).each(function () {
            const inputVal = $(this).val()
            const { emptyErrorMsg } = $(this).data()
            const inputParent = this.closest("div")
            if (inputVal === "" || inputVal === null) {
                $("span", inputParent).html(`${emptyErrorMsg}`)
                $("span", inputParent).css({ "visibility": "visible", "opacity": "1" })
                check = false;
            }
        });
    }
    return check;
}

const checkNumVal = (objColection) => {
    let check = true;
    if (objColection.length > 0) {
        $(objColection).each(function () {
            const inputVal = $(this).val()
            const { typeErrorMsg } = $(this).data()
            let inputParent = this.closest("div")
            if (isNaN(inputVal)) {
                $("span", inputParent).html(`${typeErrorMsg}`)
                $("span", inputParent).css({ "visibility": "visible", "opacity": "1" })
                check = false;
            }
        });
    }
    return check;
}

const checkFields = (event) => {
    const id = event.target.id
    const selectObj = $(`#${id} select`)
    const inputObj = $(`#${id} input`)
    checkField(selectObj)
    checkField(inputObj)
    checkNumVal(inputObj)
    if (checkField(selectObj) && checkField(inputObj) && checkNumVal(inputObj)) {
        return true
    } else {
        return false
    }
}

const limpiarErrores = (event) => {
    let id = event.target.id
    $(`#${id} select, #${id} input`).on("focus", (e) => {
        let inputParent = e.target.closest("div")
        $("span", inputParent).css({ "visibility": "hidden", "opacity": "0" })
    })
}

$(function () {

    $("#paso1-zona").change(() => {
        $("#paso2, #paso3, #paso4, #paso5, #paso6, #paso7").addClass("off")
        let riesgo = $("#paso1-zona").val()
        riesgo === "alto" ? (
            $("#paso1-conclusion").html("Ha seleccionado zona de riesgo alto, por lo que debe disponer de un sistema de contención. Avance al Paso 2 para determinar su nivel de contención (N.C)."),
            $("#paso2").removeClass("off")
        ) : (
            $("#paso1-conclusion").html("Ha seleccionado zona de riesgo normal. Avance al paso 4 para determinar si debe usar o no, un sistema de contención."),
            $("#paso4").removeClass("off")
        )
    })

    $("#formPaso2").submit(function (e) {
        e.preventDefault()
        let tipoCalzada = $("#paso2-tipo").val();
        let tmdaVal = $("#paso2-tmda").val()
        let tmda2EjesVal = $("#paso2-tmda2Ejes").val()
        let tmda = parseFloat(tmdaVal)
        let tmda2Ejes = parseFloat(tmda2EjesVal)

        const tablaPaso2 = () => {
            nc2Ejes[1].bid = 300 + 0.1 * (tmda - 1000)
            nc2Ejes[1].unid = 300 + 0.12 * (tmda - 1000)
            nc2Ejes[2].bid = 500 + 0.08 * (tmda - 3000)
            nc2Ejes[2].unid = 600 + 0.1 * (tmda - 3000)
            nc2Ejes[3].bid = 820 + 0.06 * (tmda - 7000)
            nc2Ejes[3].unid = 1000 + 0.08 * (tmda - 7000)

            let tmdaRow = tmda <= 1000 ? "r1" : tmda <= 3000 ? "r2" : tmda <= 7000 ? "r3" : "r4";
            let filtered = nc2Ejes.filter(row => row.tmda === tmdaRow)[0]
            let tmdaMax = tipoCalzada === "bidireccional" ? filtered.bid : filtered.unid
            $("#tablaNcCam2Ejes tbody").html(`
                    <tr>
                        <td>${tmda}</th>
                        <td>${tmdaMax}</th>
                    </tr>    
            `)

            if (tipoCalzada == "bidireccional") {
                tmda2Ejes < filtered.bid ? (
                    $("#paso2-conclusion").html("No hay aumento del N.C debido a camiones de  más de 2 ejes. Continúe al Paso 3."),
                    $("#paso3").removeClass("off")
                ) : (
                    $("#paso3").addClass("off"),
                    $("#paso2-conclusion").html('Se debe considerar Nivel de Contención "MUY ALTO"')
                )
            } else if (tipoCalzada == "unidireccional") {
                tmda2Ejes < filtered.unid ? (
                    $("#paso2-conclusion").html("No hay aumento del N.C debido a camiones de más de 2 ejes. Continúe al Paso 3."),
                    $("#paso3").removeClass("off")
                ) : (
                    $("#paso3").addClass("off"),
                    $("#paso2-conclusion").html('Se debe considerar Nivel de Contención "MUY ALTO"')
                )
            }

            $("#paso2-resultados").removeClass("off");
        }

        checkFields(e) && tablaPaso2()
        limpiarErrores(e)
    });

    $("#formPaso3").submit(function (e) {
        e.preventDefault()

        let tipoCalzada = $("#paso2-tipo").val();
        let tmdaVal = $("#paso2-tmda").val()
        let tmdaCamVal = $("#paso3-tmdaCam").val()
        let tmda = parseFloat(tmdaVal)
        let tmdaCam = parseFloat(tmdaCamVal)

        const tablaPaso3 = () => {
            ncCam[1].bid = 0.12 * tmda
            ncCam[1].unid = 0.15 * tmda
            let tmdaRow = tmda <= 1000 ? "r1" : "r2";
            let filtered = ncCam.filter(row => row.tmda === tmdaRow)[0]
            let tmdaMax = tipoCalzada === "bidireccional" ? filtered.bid : filtered.unid
            $("#tablaNcCam tbody").html(`
                    <tr>
                        <td>${tmda}</th>
                        <td>${tmdaMax}</th>
                    </tr>    
            `)

            if (tipoCalzada == "bidireccional") {
                tmdaCam < filtered.bid ? $("#paso3-conclusion").html('Se debe considerar Nivel de Contención "MEDIO ALTO"') : $("#paso3-conclusion").html('Se debe considerar Nivel de Contención "ALTO"')
            } else if (tipoCalzada == "unidireccional") {
                tmdaCam < filtered.unid ? $("#paso3-conclusion").html('Se debe considerar Nivel de Contención "MEDIO ALTO"') : $("#paso3-conclusion").html('Se debe considerar Nivel de Contención "ALTO"')
            }
            $("#paso3-resultados").removeClass("off");
        }

        checkFields(e) && tablaPaso3()
        limpiarErrores(e)
    });

    $("#formPaso4Talud").submit(function (e) {
        e.preventDefault()
        let HtaludVal = $("#paso4-Htalud").val()
        let Htalud = parseFloat(HtaludVal)
        let descrip = $("#paso4-descrip")
        let conclusion = $("#paso4-terraplenConclusion")

        descrip.html("")

        const evalTerraplen = () => {
            if (Htalud >= 4) {
                descrip.html('El talud es <b>"recuperable"</b>, lo que quiere decir que un conductor que ha perdido el control de su vehículo podría retornar a la plataforma del camino, siempre que en su trayecto no hayan obstáculos o situaciones de riesgo.')
                conclusion.html('No se requiere sistema de contención si se cumple lo anterior.')
            } else if (Htalud >= 3) {
                descrip.html('El talud es <b>"traspasable"</b>, lo que quiere decir que un conductor que ha perdido el control de su vehículo podría descender hasta el pie del terraplen, siempre que en su trayecto no hayan obstáculos o situaciones de riesgo.')
                conclusion.html('No se requiere sistema de contención si se cumple lo anterior.')
            } else if (Htalud >= 1.5) {
                descrip.html('')
                conclusion.html('El talud no es <b>"traspasable"</b>. Debe evaluar si se requiere o no sistema de contención, de acuerdo a los criterios señalados en el numeral 6.502.504 del Manual de Carreteras.')
            } else {
                conclusion.html('Se requiere uso de sistema de contención.')
            }
        }

        checkFields(e) && evalTerraplen()
        limpiarErrores(e)
    });

    $("#formPaso4Mediana").submit(function (e) {
        e.preventDefault()
        let tmdaVal = $("#paso4-medianaTmda").val()
        let vpVal = $("#paso4-medianaVp").val()
        let anchoVal = $("#paso4-medianaAncho").val()
        let tmda = parseFloat(tmdaVal)
        let vp = parseFloat(vpVal)
        let ancho = parseFloat(anchoVal)

        $("#paso4-medianaConclusion").html("")
        $("#error4medianaVp").css({ "visibility": "hidden", "opacity": "0" })
        const evalMediana = () => {
            let anchoMin;
            if (vp <= 60) {
                if (tmda <= 7500) {
                    anchoMin = 6
                } else {
                    anchoMin = 7
                }
            } else if (vp >= 70 && vp <= 80) {
                if (tmda <= 7500) {
                    anchoMin = 8
                } else {
                    anchoMin = 9
                }
            } else if (vp >= 90) {
                anchoMin = 9
            } else {
                const { vpErrorMsg } = $("#paso4-medianaVp").data()
                $("#error4medianaVp").html(`${vpErrorMsg}`)
                $("#error4medianaVp").css({ "visibility": "visible", "opacity": "1" })
            }
            if(anchoMin) {
                if (ancho >= anchoMin) {
                    $("#paso4-medianaConclusion").html(`El <b>ancho mínimo</b> requerido para la mediana es de <b>${anchoMin} m</b>, por lo que <b>no se requiere sistema de contención.</b>`)
                } else {
                    $("#paso4-medianaConclusion").html(`El <b>ancho mínimo</b> requerido para la mediana es de <b>${anchoMin} m</b>, por lo que <b>se debe disponer de un sistema de contención.</b>`)
                }
            }
        }

        checkFields(e) && evalMediana()
        limpiarErrores(e)

    })

    $("#paso4-criterio").change(() => {
        $("#paso5").removeClass("off")
        let criterio = $("#paso4-criterio").val()
        criterio === "no" ? (
            $("#paso6, #paso7").addClass("off"),
            $("#paso5-conclusion").html("Sobre la base de los antecedentes analizados en el paso 4. <b>No se requiere del uso de un sistema de contención</b> en la zona de riesgo normal evaluada, sin embargo, se debe estudiar la necesidad de alguna medida suplementaria, como demarcación, señales alertadoras u otras.")
        ) :
        ( $("#paso5-conclusion").html("Sobre la base de los antecedentes analizados en el paso 4, se ha determinado que <b>se requiere del uso de un sistema de contención</b> para la zona de riesgo normal evaluada. <br> Avance al Paso 6 para determinar su nivel de contención."),
        $("#paso6").removeClass("off") )
    })

    $("#formPaso6").submit(function (e) {
        e.preventDefault()
        let tipoCalzada = $("#paso6-tipo").val();
        let tmdaVal = $("#paso6-tmda").val()
        let tmdaBusCamVal = $("#paso6-tmdaBusCam").val()
        let tmda = parseFloat(tmdaVal)
        let tmdaBusCam = parseFloat(tmdaBusCamVal)

        $("#paso7").addClass("off")
        const analisisPaso7 = () => {
            if (tmda <= 1000) {
                $("#paso7-conclusion").html('Se debe considerar nivel de contención "LIVIANO".')
            } else {
                $("#paso7-conclusion").html('Se debe considerar nivel de contención "MEDIO".')
            }
        }

        const tablaPaso6 = () => {
            ncBusCam[1].bid = 0.25 * tmda
            ncBusCam[1].unid = 0.30 * tmda
            let tmdaRow = tmda <= 1000 ? "r1" : "r2";
            let filtered = ncBusCam.filter(row => row.tmda === tmdaRow)[0]
            let tmdaMax = tipoCalzada === "bidireccional" ? filtered.bid : filtered.unid
            $("#tablaNcBusCam tbody").html(`
                    <tr>
                        <td>${tmda}</th>
                        <td>${tmdaMax}</th>
                    </tr>    
            `)

            if (tipoCalzada == "bidireccional") {
                tmdaBusCam > filtered.bid ? $("#paso6-conclusion").html('Se debe considerar Nivel de Contención "MEDIO ALTO".') : (
                    $("#paso6-conclusion").html('No se produce aumento del nivel de contención debido al flujo de buses y camiones. Avance al Paso 7.'),
                    analisisPaso7(),
                    $("#paso7").removeClass("off")
                )
            } else if (tipoCalzada == "unidireccional") {
                tmdaBusCam > filtered.unid ? $("#paso6-conclusion").html('Se debe considerar Nivel de Contención "MEDIO ALTO".') : (
                    $("#paso3-conclusion").html('No se produce aumento del nivel de contención debido al flujo de buses y camiones. Avance al Paso 7.'),
                    analisisPaso7(),
                    $("#paso7").removeClass("off")
                )
            }
            $("#paso6-resultados").removeClass("off");
        }

        checkFields(e) && tablaPaso6()
        limpiarErrores(e)
    });

})