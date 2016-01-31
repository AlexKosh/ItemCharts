    var myConfig = {
        "type":"line",
        "csv":{
            "url":"export.csv",
            

        }
    };


    zingchart.render({
        id: 'myChart',
        data: myConfig,
        height: 500,
        width: "100%"
    });