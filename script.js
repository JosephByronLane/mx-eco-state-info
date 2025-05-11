let mouseX = 0
let mouseY = 0

const root = document.getElementById('root')

const regionInfo = document.getElementById('region-info')

//hover getters for the tooltip info
const tooltip = document.getElementById('region-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipEstados = document.getElementById('tooltip-estados');
const tooltipActividades = document.getElementById('tooltip-actividades');
const tooltipPIB = document.getElementById('tooltip-pib');
const tooltipSueldos = document.getElementById('tooltip-sueldos');
const tooltipHabitantes = document.getElementById('tooltip-habitantes');


//for some reason the bounding box doesn't take into account all the height differences
//with the parent elements
const pixelOffset = 20 + 80 + 35

let jsonData;

let searchTerm = ""

document.addEventListener('DOMContentLoaded', function() {

    //load json data to display in hover

    loadJsonData().then(data => {
        jsonData = data;
        console.log('Data loaded successfully');
    }).catch(error => {
        console.error('Failed to load data:', error);
    });

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
            //visualizeBBox(layer)
            
            layer.addEventListener('click', (event)=>{
                showRegionInfo(event, layer.id)
            })

            //hover up scale transition
            layer.style.transition = "transform 0.2s";

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

        
        tooltipTitle.textContent = layerId;

        const estadoNames = regionData.Estados ? Object.keys(regionData.Estados) : [];
        tooltipEstados.textContent = `Estados: ${estadoNames.join(', ')}`;
        
        tooltipActividades.textContent = `Actividades Económicas: ${regionData["Actividades-Economicas"]}`;
        tooltipPIB.textContent = `PIB: ${regionData.PIB}`;
        tooltipSueldos.textContent = `Sueldos: ${regionData["Sueldos-y-salarios"]}`;
        tooltipHabitantes.textContent = `Habitantes: ${regionData.Habitantes}`;    
        
        tooltip.classList.remove('hidden')
        layer.style.fill = '#061f57'
        scaleElement(layer, 1.05)
    }

    function hideHoverElement(event, data){
        const layer = event.target
        tooltip.classList.add('hidden')
        layer.style.fill='rgb(255, 255, 255)'
        layer.style.transform = `scale(1.0)`
        scaleElement(layer, 1.0)
    }

    function scaleElement(element, scale){

        //scaling the SVG makes it go from the svg's origin (0,0)
        //so we manually calculate the individual layer's center point and scale it from there
        const layerBbox = element.getBBox()


        const cx = layerBbox.x + (layerBbox.height/2)
        const cy = layerBbox.y + (layerBbox.width/2) - pixelOffset

        const transform = `translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})`;
        element.setAttribute('transform', transform);

        //after applying the transform, it get saved to CSS with a scale of 1 (when hovering out)
        //and it stops the element from updating, so we just remove it to not have to deal with it
        element.style.removeProperty('transform')

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

function showRegionInfo(event, layerId){

    const selectedRegion = jsonData[layerId]
    console.log(selectedRegion)

    const regionStates = selectedRegion.Estados

    console.log(regionStates)

    regionInfo.innerHTML = '';

    for (const stateName in regionStates){
        const stateData = regionStates[stateName];
        createStateInfo(stateName, stateData);
    }
}



function createStateInfo(stateName, stateData){

    console.log(`Creating state info for ${stateName}`)

    const stateInfo = document.createElement('div')
    stateInfo.classList.add('state-info')

    const stateNameEl = document.createElement('h3')
    stateNameEl.textContent = stateName

    const stateActividades = document.createElement('p')
    stateActividades.textContent = `Actividades Económicas: ${stateData["Actividades-Economicas"]}`

    const statePIB = document.createElement('p')
    statePIB.textContent = `PIB: ${stateData["PIB"]}`

    const stateSueldos = document.createElement('p')
    stateSueldos.textContent = `Sueldos y salarios: ${stateData["Sueldos-y-salarios"]}`

    const stateHabitantes = document.createElement('p')
    stateHabitantes.textContent = `Habitantes: ${stateData["Habitantes"]}`

    stateInfo.appendChild(stateNameEl)
    stateInfo.appendChild(stateActividades)
    stateInfo.appendChild(statePIB)
    stateInfo.appendChild(stateSueldos)
    stateInfo.appendChild(stateHabitantes)    

    regionInfo.appendChild(stateInfo)
}

//debug function only, used to debug bboxes graphically
function visualizeBBox(elementBBox){

    const dotLL = [elementBBox.x, elementBBox.y]
    const dotLR = [elementBBox.x + elementBBox.width , elementBBox.y]
    const dotUL = [elementBBox.x, elementBBox.y + elementBBox.height]
    const dotUR = [elementBBox.x + elementBBox.width, elementBBox.y + elementBBox.height] 

    const dotPos = [dotLL, dotLR, dotUL, dotUR]
    const dotColors= ["red","blue","green","black"]
    let i = 0
    try{
        dotPos.forEach(dotPosition => {
            const dot = document.createElement("div")
            dot.classList.add('dot')
            dot.style.backgroundColor= dotColors[i]
            dot.style.top =`${dotPosition[1]+ pixelOffset}px`
            dot.style.left = `${dotPosition[0]}px`
            root.appendChild(dot)
            i = i+1
        });
    }catch(error){
        console.error(error)
    }                
}

//only used for updating the position of the infobox
document.addEventListener('mousemove', moveTooltip)
function moveTooltip(event){
    const distanceFromMouseX = 350

    if (tooltip == undefined){
        console.error(`tooltip is undefined. Not moving it.`)
        return;
    }

    const tooltipRect = tooltip.getBoundingClientRect()

    let posX = event.clientX + distanceFromMouseX;
    let posY = event.clientY
    const viewportWidth = window.innerWidth -20;
    const viewportHeight = window.innerHeight - 20;

    if (posX + tooltipRect.width > viewportWidth) {
        posX = viewportWidth - tooltipRect.width ;
    }

    if (posY + tooltipRect.height > viewportHeight){
        posY = viewportHeight - tooltipRect.height
    }
    
    tooltip.style.left = `${posX}px`;
    tooltip.style.top = `${posY}px`;


}