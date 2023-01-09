var filterData = {
    "begin_date": (new Date()).setFullYear(2022, 01, 01),
    "end_date": (new Date).setFullYear(2023, 01, 01),
    "status": "Any",
    "client_type": "in-state"
}

var allDataHeaders = [
    "invoice_id",
    "client_name",
    "client_type",
    "date",
    "due_date",
    "total",
    "balance",
    "status"
]
var sortKey = ""

function parseJsonData() {
    var itemElement = document.getElementById("main_items")
    itemElement.innerHTML = ''
    fetch("data.json").then(Response => Response.json()).then(listOfData => {
        if (sortKey != "") {
            listOfData.sort(customSort)
        }
        listOfData.forEach(invoiceData => {
            var isFilterCheckPassed = true
            var itemInnerDiv = document.createElement('div')
            for (let [key, value] of Object.entries(invoiceData)) {

                if (key == "date") {
                    var cTime = new Date(value).getTime()
                    var beginDate = new Date(filterData.begin_date).getTime()
                    var end_date = new Date(filterData.end_date).getTime()
                    if (cTime < beginDate || cTime > end_date) {
                        isFilterCheckPassed = false
                        break
                    }
                }
                if (key in filterData && filterData[key] != 'Any' && filterData[key] != value) {
                    isFilterCheckPassed = false
                    break
                }

                if (key == "status") {
                    const ele = document.createElement('div')
                    var innerElement = document.createElement('div');
                    if (value == "Draft") {
                        innerElement.style.backgroundColor = "rgb(246, 140, 147)"
                    } else if (value == "Partial Payment") {
                        innerElement.style.backgroundColor = "rgb(88, 88, 186)"
                    } else if (value == "Paid") {
                        innerElement.style.backgroundColor = "rgb(111, 142, 250)"
                    }
                    innerElement.style.color = "white"
                    innerElement.style.width = "fit-content"

                    innerElement.innerHTML = value
                    ele.appendChild(innerElement)
                    itemInnerDiv.appendChild(ele)
                } else {
                    const ele = document.createElement('p')
                    if (key == "date" || key == "due_date") 
                        value = formateDate(new Date(value))


                    ele.innerHTML = value
                    itemInnerDiv.appendChild(ele)
                }
            }
            if (isFilterCheckPassed) 
                itemElement.appendChild(itemInnerDiv)


            


        });
    });
}

function sortKeySet() {
    let allHeaders = document.querySelector(".headers").children

    for (let i = 0; i < allHeaders.length; i++) {
        allHeaders[i].addEventListener("click", function () {
            sortKey = allDataHeaders[i]
            console.log(i)
            parseJsonData()
        })
    }
}

function changeFilterData() {
    var begin_date = document.getElementById("begin_date")
    var end_date = document.getElementById("end_date")
    var status = document.getElementById("status")
    var client_type = document.getElementById("client_type")
    begin_date.addEventListener("change", function () {
        filterData.begin_date = begin_date.value
        parseJsonData()
    })
    end_date.addEventListener("change", function () {
        filterData.end_date = end_date.value
        parseJsonData()
    })
    status.addEventListener("change", function () {
        filterData.status = status.value
        parseJsonData()
    })
    client_type.addEventListener("change", function () {
        filterData.client_type = client_type.value
        parseJsonData()
    })

}

parseJsonData()
changeFilterData()
sortKeySet()

function formateDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (day < 10) 
        day = '0' + day;
    


    if (month < 10) 
        month = '0' + month;
    


    return day + '/' + month + '/' + year;
}

function customSort(x, y) {
    a = x[sortKey]
    b = y[sortKey]
    if (typeof a === "number") {
        return a - b
    } else if (typeof b === "string" && sortKey != "date" && sortKey != "due_date") {
        let lowerA = a.toLowerCase(),
            lowerB = b.toLowerCase();

        if (lowerA < lowerB) {
            return -1;
        }
        if (lowerA > lowerB) {
            return 1;
        }
        return 0;
    } else {
        var dateA = new Date(a).getTime()
        var dateB = new Date(b).getTime()

        return dateA - dateB
    }
}
