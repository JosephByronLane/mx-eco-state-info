let mouseX = 0
let mouseY = 0

const root = document.getElementById('root')

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

document.addEventListener('DOMContentLoaded', function() {


    
    //load json data to display in hover
    let jsonData;

    loadJsonData().then(data =>{
        jsonData = data
    })    

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

        console.log(`Data for ${layerId}`)


        tooltipTitle.textContent = layerId;
        tooltipEstados.textContent = `Estados: ${regionData.Estados.join(', ')}`;
        tooltipActividades.textContent = `Actividades Económicas: ${regionData["Actividades-Economicas"]}`;
        tooltipPIB.textContent = `PIB: ${regionData.PIB}`;
        tooltipSueldos.textContent = `Sueldos: ${regionData["Sueldos-y-salarios"]}`;
        tooltipHabitantes.textContent = `Habitantes: ${regionData.Habitantes}`;

        
        tooltip.classList.remove('hidden')
        layer.style.fill = 'rgba(255,0,0,1)'

        scaleElement(layer, 1.05)
    }

    function hideHoverElement(event, data){
        const layer = event.target
        tooltip.classList.add('hidden')
        layer.style.fill='rgba(255,255,255,1)'
        layer.style.transform = `scale(1.0)`
        scaleElement(layer, 1.0)
    }

    function scaleElement(element, scale){

        //scaling the SVG makes it go from the svg's origin (0,0)
        //so we manually calculate the individual layer's center point and scale it from there
        const layerBbox = element.getBBox()

        console.log(layerBbox)

        const cx = layerBbox.x + (layerBbox.height/2)
        const cy = layerBbox.y + (layerBbox.width/2) - pixelOffset

        const transform = `translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})`;
        element.setAttribute('transform', transform);

        //after applying the transform, it get saved to CSS with a scale of 1 (when hovering out)
        //and it stops the element from updating, so we just remove it to not have to deal with it
        element.style.removeProperty('transform')
        console.log(`set scale of ${element.id} to ${scale}`)

    }

    //debug function only, used to debug bboxes graphically
    function visualizeBBox(element){
        let dotsElements = []
        const elementBBox = element.getBBox()

        const dotLL = [elementBBox.x, elementBBox.y]
        const dotLR = [elementBBox.x + elementBBox.width , elementBBox.y]
        const dotUL = [elementBBox.x, elementBBox.y + elementBBox.height]
        const dotUR = [elementBBox.x + elementBBox.width, elementBBox.y + elementBBox.height] 

        const dotPos = [dotLL, dotLR, dotUL, dotUR]
        const dotColors= ["red","blue","green","black"]
        let i = 0
        console.log(dotPos)
        try{
            dotPos.forEach(dotPosition => {
                const dot = document.createElement("div")
                dot.classList.add('dot')
                dot.style.backgroundColor= dotColors[i]
                dot.style.top =`${dotPosition[1]+ pixelOffset}px`
                dot.style.left = `${dotPosition[0]}px`
                root.appendChild(dot)
                console.log("applied pos")
                i = i+1
            });
        }catch(error){
            console.error(error)
        }

                
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
    mouseX = event.clientX
    mouseY = event.clientY

    if (tooltip == undefined){
        console.error(`tooltip is undefined. Not moving it.`)
        return;
    }

    tooltip.style.left = `${mouseX+50}px`
    tooltip.style.top = `${mouseY}px`


}