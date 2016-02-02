(function () {

    angular.module('A-Fina', []);

    angular.module('A-Fina')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope'];

    function HomeController($scope) {
        var vm = this; 
        init();
        vm.exportData = false;

        //
        vm.changedData = changedData;
        vm.defaultData = defaultData;
        vm.chooseExportData = chooseExportData;

        function init() {
            vm.data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            };
            // Get the context of the canvas element we want to select
            var ctx = document.getElementById("myChart").getContext("2d");

            var myNewChart = new Chart(ctx).Line(vm.data);

        }
        function changedData() {
            vm.data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,120,120,0.2)",
                        strokeColor: "rgba(220,120,120,1)",
                        pointColor: "rgba(220,120,120,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,120,120,1)",
                        data: [45, 29, 70, 41, 86, 55, 60]
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            };
            var ctx = document.getElementById("myChart").getContext("2d");
            var myNewChart = new Chart(ctx).Line(vm.data);
        }
        function defaultData() {
            vm.data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            };
            var ctx = document.getElementById("myChart").getContext("2d");
            var myNewChart = new Chart(ctx).Line(vm.data);
        }
        function chooseExportData() {
            var labels = [];
            var datasetsData = [];
            for (var i = 0; i < vm.exportData.length; i++) {
                labels.push(vm.exportData[i].Date);
                datasetsData.push(vm.exportData[i].Quantity);
            }
            console.log(datasetsData);

            vm.data = {
                labels: labels,
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,120,120,0.2)",
                        strokeColor: "rgba(220,120,120,1)",
                        pointColor: "rgba(220,120,120,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,120,120,1)",
                        data: datasetsData
                    }]
            }
            var ctx = document.getElementById("myChart").getContext("2d");
            var myExportChart = new Chart(ctx).Line(vm.data);
        };


        vm.tryParseFile = tryParseFile;

        vm.roughData = null;

        function tryParseFile() {
            var file = document.getElementById("fileOpener").files[0];

            Papa.parse(file, {
                complete: function (results) {
                    vm.roughData = results.data;
                    console.log('file have been parsed');

                    selectTargetColumns();

                    function selectTargetColumns() {
                        var targetColumns = ['Variant SKU', 'Item Product', 'Item Name', 'Item Quantity', 'Issue Date'];
                        var header = vm.roughData[0];

                        var indexes = getHeaderIndexes(targetColumns);
                        var data = getJsonObjects(vm.roughData);
                        vm.exportData = data;

                        function getHeaderIndexes(targCol) {
                            var indexes = [];
                            for (var i = 0; i < header.length; i++) {
                                for (var j = 0; j < targCol.length; j++) {
                                    if (header[i] == targCol[j]) {
                                        indexes.push(i);
                                        break;
                                    }
                                }
                                if (indexes.length == targCol.length) {
                                    break;
                                }
                            }
                            return indexes;
                        }
                        function getJsonObjects(arr) {
                            var objects = [];
                            var tempObject = new Object();
                            var newObject = new Object();

                            for (var i = 1; i < arr.length; i++) {
                                tempObject = new Object();
                                newObject = new Object();

                                if (arr[i][indexes[0]] == undefined) {
                                    break;
                                }

                                for (var j = 0; j < indexes.length; j++) {
                                    
                                    tempObject[arr[0][indexes[j]]] = arr[i][indexes[j]];                                    
                                }
                                
                                newObject.Name = tempObject['Item Product'];
                                newObject.SKU = tempObject['Variant SKU'];                                
                                newObject.Quantity = parseInt(tempObject['Item Quantity']);
                                newObject.Date = tempObject['Issue Date'];   
                                
                                function getColorAndSize() {                                    
                                    var colorDashSize = tempObject['Item Name'];                                    
                                    var dashIndex = 0;

                                    for (var i = 0; i < colorDashSize.length; i++) {                                        
                                        if (colorDashSize[i] == '/') {
                                            dashIndex = i;
                                            break;
                                        }
                                    }
                                    
                                    newObject.Size = colorDashSize.slice(0, 2);                                    
                                    newObject.Color = colorDashSize.slice(3);
                                }

                                getColorAndSize();
                                
                                objects.push(newObject);
                            }

                            console.log(objects);
                            return objects;
                        }
                    }
                }
            });
        }
               
    }
})();