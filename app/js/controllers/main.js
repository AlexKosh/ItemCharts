(function() {
    angular.module('A-Fina')
    .controller('MainController', MainController);

    MainController.$inject = ['$scope'];

    function MainController($scope) {
        //view model
        var vm = this;

        
        //после удачного парсинга файла и последующей удачной обработки, данные помещаются сюда, а пока это false
        vm.exportData = false;
        $scope.data = false;

        //сюда помещаются данные из csv файла сразу после парсинга в виде массивов
        vm.roughData = null;
        /*метод принимает файл выбранный в input[id="fileOpener"], файл должен быть только по шаблону от TradeGecko Exporter
         *парсит csv в json с помощью papaParse.js, если парсинг проходит успешно - вызывается функция 'complete'         
         */
        vm.tryParseFile = tryParseFile;

        function tryParseFile() {
            var file = document.getElementById("fileOpener").files[0];

            Papa.parse(file, {
                //complete - функция, которая срабатыват, когда парсинг прошел успешно
                complete: function (results) {
                    vm.roughData = results.data;
                    console.log('file have been parsed');

                    selectTargetColumns();
                    //в csv файле по шаблону TradeGecko Exportera больше 20 колонок, эта функция отделяет зерна от плевел
                    function selectTargetColumns() {
                        //массив нужных названий колонок, в дальнейшем этот массив сопоставляется с названием каждой колонки в файле
                        var targetColumns = ['Variant SKU', 'Item Product', 'Item Name', 'Item Quantity', 'Issue Date'];
                        //массив названий колонок из csv файла
                        var header = vm.roughData[0];

                        var indexes = getHeaderIndexes(targetColumns);
                        var data = getJsonObjects(vm.roughData);
                        vm.exportData = data;
                        $scope.data = data;

                        /*возвращает индексы нужных нам колонок в массиве всего csv файла, т е из 20 колонок он вернет 5 цифр,
                         * к примеру, [1, 4, 6, 12, 15] - это и будут номера нужных нам колонок в массиве vm.roughData */
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
                        /*функция принимает vm.roughData как необработанный массив данных, отделяет от него только нужные колонки
                         * создает объект и помещает в его свойства значения из нужных колонок, возвращает массив объектов*/
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