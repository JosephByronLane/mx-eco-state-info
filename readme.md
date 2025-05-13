# Mexico Economy's Zone Info Viewer

A simple web app made for our "Analisis Politico y Socioeconomico de Mexico" class.

## What is this?

This interactive web application visualizes the geoeconomic zones of Mexico, providing information about each region and its constituent states. The app displays economic data such as GDP, wage levels, economic activities, and population statistics for Mexico's seven major economic regions (and their states).

## Features

- Interactive SVG map of Mexico divided into economic regions
- Hover functionality displaying region overview data
- Click interaction to view detailed information about states within each region
- All in pure CSS, HTML and JS. 

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mx-eco-state-info.git
   cd mx-eco-state-info
   ```
2. Get a `.json` with all the apropiate state data. Follow the format in the provided `data.json` for the proper structure.

3. No build steps required - this is a static web application (yay).

4. Open `index.html` in your browser to run the application.

## Technologies Used

- HTML5 for structure
- CSS3 for styling
- JavaScript (vanilla) for interactivity
- SVG for the interactive map
- Font Awesome for icons
- Google Fonts (Montserrat)


## Data Sources

The economic data includes:
- GDP (Producto Interno Bruto)
- Wages and salaries (Sueldos y salarios)
- Population (Habitantes)
- Economic activities (Actividades Económicas)

All data was obtained from INEGI's 2020 census, except for the wages, which was from ENOE's survey.

Created for the "Analisis Politico y Socioeconomico de Mexico" class.
