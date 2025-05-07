let mouseX = 0
let mouseY = 0


//hover getters for the tooltip info
const tooltip = document.getElementById('region-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipEstados = document.getElementById('tooltip-estados');
const tooltipActividades = document.getElementById('tooltip-actividades');
const tooltipPIB = document.getElementById('tooltip-pib');
const tooltipSueldos = document.getElementById('tooltip-sueldos');
const tooltipHabitantes = document.getElementById('tooltip-habitantes');

document.addEventListener('DOMContentLoaded', function() {

    //load json data to display in hover
    let jsonData;

    loadJsonData().then(data =>{
        jsonData = data
    })    

    //map hover stuff
    const mapObject = document.getElementById('map')

    mapObject.addEventListener('load', function(){
        const mapDoc = mapObject.contentDocument;

        if (mapDoc == undefined){
            console.error("Couldn't find mapDoc. Is the SVG structure the same?")
            return;
        }

        //the svg exports each layer as a separate <path> attribute.
        const automatedLayers = mapDoc.querySelectorAll('path')

        if (automatedLayers === undefined) {
            console.error("Error finding SVG layers. Please check output data format.")
        }

        automatedLayers.forEach(layer => {            

            if (layer == null || layer == undefined){
                console.error(`Couldn't find layer ${layer}. Check SVG layer namings.`);
                return;
            }


            layer.addEventListener('mouseenter', (event)=>{
                showHoverElement(event, layer.id)
            })
            layer.addEventListener('mouseleave', hideHoverElement)
        });   


        mapDoc.addEventListener('mousemove', moveTooltip)

        
    })


    function showHoverElement(event, layerId){
        const layer = event.target;
        const regionData = jsonData[layerId]

        if (regionData == undefined){
            console.error(`Error reading JSON data for ${layerId}. Check JSON formatting.`)
            return;
        }

        console.log(`Data for ${layerId}`)
        console.log(regionData)


        tooltipTitle.textContent = layerId;
        tooltipEstados.textContent = `Estados: ${regionData.Estados.join(', ')}`;
        tooltipActividades.textContent = `Actividades Económicas: ${regionData["Actividades-Economicas"]}`;
        tooltipPIB.textContent = `PIB: ${regionData.PIB}`;
        tooltipSueldos.textContent = `Sueldos: ${regionData["Sueldos-y-salarios"]}`;
        tooltipHabitantes.textContent = `Habitantes: ${regionData.Habitantes}`;
        tooltip.classList.remove('hidden')
        layer.style.fill = 'rgba(255,0,0,1)'
    }

    function hideHoverElement(event, data){
        const layer = event.target
        tooltip.classList.add('hidden')
        layer.style.fill='rgba(255,255,255,1)'
    }

    async function loadJsonData(){
        try{
            const dataResponse = await fetch('data.json')
            if (!dataResponse.ok){
                throw new Error("Error fetching map's JSON data.")
            }
            const data = await dataResponse.json()

            return data

        }
        catch(error){
            console.error(`Error while loading JSON: ${error}`)
        }
    }

    
})

//only used for updating the position of the infobox
document.addEventListener('mousemove', moveTooltip)
function moveTooltip(event){
    console.log("mouse move")
    mouseX = event.clientX
    mouseY = event.clientY

    if (tooltip == undefined){
        console.error(`tooltip is undefined. Not moving it.`)
        return;
    }

    console.log("moved tooltip")
    tooltip.style.left = `${mouseX+50}px`
    tooltip.style.top = `${mouseY}px`

    console.log(mouseX)

}