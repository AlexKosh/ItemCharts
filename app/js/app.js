(function () {

    angular.module('A-Fina', []);

    angular.module('A-Fina')
    .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope'];

    function HomeController($scope) {
        //view model
        var vm = this; 
        
        //����� �������� �������� ����� � ����������� ������� ���������, ������ ���������� ����, � ���� ��� false
        vm.exportData = false;
        var leftCtx = {};
        var leftChart = {};
        var rightCtx = {};        
        var rightChart = {};

        //
        vm.chooseChangedData = chooseChangedData;
        vm.chooseExportData = chooseExportData;
        vm.clearCanva = clearCanva;
        vm.chooseDefaultData = chooseDefaultData;
        //���� ���������� ������ �� csv ����� ����� ����� �������� � ���� ��������
        vm.roughData = null;
        /*����� ��������� ���� ��������� � input[id="fileOpener"], ���� ������ ���� ������ �� ������� �� TradeGecko Exporter
         *������ csv � json � ������� papaParse.js, ���� ������� �������� ������� - ���������� ������� 'complete'         
         */
        vm.tryParseFile = tryParseFile;
                
        init();

        function clearCanva() {
            document.getElementById("leftChart").remove();
            document.getElementById("rightChart").remove();

            initCanva();
        };
        function chooseChangedData() {
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

            clearCanva();
            leftChart = new Chart(leftCtx).Line(vm.data);
            rightChart = new Chart(rightCtx).Line(vm.data);
        };
        function chooseExportData() {
            var labels = [];
            var datasetsData = [];
            for (var i = 0; i < vm.exportData.length; i++) {
                labels.push(vm.exportData[i].Date);
                datasetsData.push(vm.exportData[i].Quantity);
            }
            //console.log(datasetsData);

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

            clearCanva();
            leftChart = new Chart(leftCtx).Line(vm.data);
            rightChart = new Chart(rightCtx).Line(vm.data);
        };
        function chooseDefaultData() {
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
            clearCanva();
            leftChart = new Chart(leftCtx).Line(vm.data);
            rightChart = new Chart(rightCtx).Line(vm.data);
        }
        //��� ������� ����������� ������ ��� ������� ��������
        function init() {
            initCanva();
        };
        //������� ������� canvas ��� ���� �������� �� ��������: ������ � ������� � ������ �� ������/������ ��� � ������������� ��-��
        function initCanva() {
            document.getElementById("leftCanvasHolder").innerHTML = '<canvas id="leftChart"></canvas>';
            document.getElementById("rightCanvasHolder").innerHTML = '<canvas id="rightChart"></canvas>';
            leftCtx = document.getElementById("leftChart").getContext("2d");
            leftCtx.canvas.width = document.getElementById("leftCanvasHolder").clientWidth;
            leftCtx.canvas.height = document.getElementById("leftCanvasHolder").clientHeight;
            rightCtx = document.getElementById("rightChart").getContext("2d");
            rightCtx.canvas.width = document.getElementById("rightCanvasHolder").clientWidth;
            rightCtx.canvas.height = document.getElementById("rightCanvasHolder").clientHeight;
        };  
        function tryParseFile() {
            var file = document.getElementById("fileOpener").files[0];

            Papa.parse(file, {
                //complete - �������, ������� ����������, ����� ������� ������ �������
                complete: function (results) {
                    vm.roughData = results.data;
                    console.log('file have been parsed');

                    selectTargetColumns();
                    //� csv ����� �� ������� TradeGecko Exportera ������ 20 �������, ��� ������� �������� ����� �� ������
                    function selectTargetColumns() {
                        //������ ������ �������� �������, � ���������� ���� ������ �������������� � ��������� ������ ������� � �����
                        var targetColumns = ['Variant SKU', 'Item Product', 'Item Name', 'Item Quantity', 'Issue Date'];
                        //������ �������� ������� �� csv �����
                        var header = vm.roughData[0];

                        var indexes = getHeaderIndexes(targetColumns);
                        var data = getJsonObjects(vm.roughData);
                        vm.exportData = data;

                        /*���������� ������� ������ ��� ������� � ������� ����� csv �����, � � �� 20 ������� �� ������ 5 ����,
                         * � �������, [1, 4, 6, 12, 15] - ��� � ����� ������ ������ ��� ������� � ������� vm.roughData */
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
                        /*������� ��������� vm.roughData ��� �������������� ������ ������, �������� �� ���� ������ ������ �������
                         * ������� ������ � �������� � ��� �������� �������� �� ������ �������, ���������� ������ ��������*/
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

                            //console.log(objects);
                            return objects;
                        }
                    }
                }
            });
        };
               
    }
})();