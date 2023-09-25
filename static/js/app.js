//STEP 1: Using D3 to read in samples.json 
//URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Reading in the URL and confiming in the console log that the data has been pulled. 
d3.json(url).then(function(data) {
   console.log(data);
  });

//STEP 6 (Moving this up), add all items in the names array from the json data to the page's drop down menu and use the first id as the default display data. It made more sense to have this at the top. 

function init() {
    //selects the dropdown id on the webpage
    let dropdownMenu = d3.select("#selDataset");

    //Feteches the json data from our url above
    d3.json(url).then((data) => {
        //assign the array of names from the json file to a variable
        let names = data.names;

        //Append each id number in names to the dropdown menu
        names.forEach((id) => {
            dropdownMenu.append("option").text(id).property("value", id);
        });

        //Assign the first item in names as the default value
        let id = names[0];

        barChart(id);
        bubbleChart(id);
        demoChart(id);
        gaugeChart(id);

    });
};

//Update all data on the page when a different id on the dropdown menu is selected. This updates based on "optionChanged" in the HTML and the value slected in "optionChanged"
function optionChanged(id_no) {
    barChart(id_no);
    bubbleChart(id_no);
    demoChart(id_no);
    gaugeChart(id);
};


//STEP 2: Make horizontal bar chart of top 10 OTUS found in individual

//Create a function to create the bar chart based on the selected ID number
function barChart(id_no) {
    //Get json data
    d3.json(url).then((data) => {

        //set the samples data to a variable.
        let samples = data.samples;
        //filter the data based on the id numer from the droptdown
        let samplesData = samples.filter((sample) => sample.id == id_no);
        //access the first case in the data
        let result = samplesData[0];
        
        //create trace data for plotting. All data is already orderd from smallest to largest so no additional sorting is needed. Data can be sliced as is for the top 10 OTUs and then reversed for the horizontal bar chart. 
        let trace = [{
            x: result.sample_values.slice(0,10).reverse(),
            y: result.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: result.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h",
            marker: {
                color: "rgb(24, 120, 181)"
            },
        }];

        //Set a layout so the chart is not too big
        let layout = {
            height: 600,
            width: 400,
            title: {
                text:`Top 10 OTUs Found in Test Subject No. ${id_no}`}
          };

        //Plot the data in the bar chart. 
        Plotly.newPlot("bar",trace, layout)
    }); 
};

//STEP 3: Bubble chart

//Create a function to create the bar chart based on the selected ID number
function bubbleChart(id_no) {
    //Get json data
    d3.json(url).then((data) => {

        //set the samples data to a variable.
        let samples = data.samples;
        //filter the data based on the id numer from the droptdown
        let samplesData = samples.filter((sample) => sample.id == id_no);
        //access the first case in the data
        let result = samplesData[0];
        
        //create trace data for plotting.
        let trace = [{
            x: result.otu_ids,
            y: result.sample_values,
            text: result.otu_labels,
            type: "bubble",
            mode:"markers",
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: "Earth"
            },
        }];

        //Set a layout so the chart is not too big
        let layout = {
            height: 500,
            width: 1500,
            title: {
                text:`OTUs in Test Subject No. ${id_no}`},
            xaxis: {
                title: {text:"OTU IDs"}
            }
          };

        //Plot the data in the bar chart. 
        Plotly.newPlot("bubble",trace, layout)
    }); 
};

//STEP 4/5: Display sample metadata / each key-value pair from the metadata

function demoChart(id_no) {
    //Get json data
    d3.json(url).then((data) => {

        //set the samples data to a variable.
        let metadata = data.metadata;
        //filter the data based on the id numer from the droptdown
        let metadataID = metadata.filter((meta) => meta.id == id_no);
        //access the first case in the data
        let result = metadataID[0];

        //clear any existing data
        d3.select("#sample-metadata").html("");

        //assign the demo box of the page to a variable
        let demotable = d3.select("#sample-metadata")
        //add each key-value pair to the demo box
        Object.entries(result).forEach(([key,value]) => {
            demotable.append("h6").text(`${key}: ${value}`)
        });

    }); 
};

//Initiate all charts and data on the page
init();