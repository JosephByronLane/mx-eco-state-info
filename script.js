document.addEventListener('DOMContentLoaded', function() {

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
            layer.addEventListener('mouseenter', showHoverElement)
            layer.addEventListener('mouseleave', hideHoverElement)
        });   
        
    })

    function showHoverElement(event, data){
        const layer = event.target;
    
        layer.style.fill = 'rgba(255,0,0,1)'
    }

    function hideHoverElement(event, data){
        const layer = event.target

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

