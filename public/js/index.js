function showList(cars) {
    $('#car_list').empty();

    for (let i = 0; i < cars.length; i++) {
        $('#car_list').append("<div class='car_block'></div>");
    }

    $.each($('.car_block'), function (idx) {
        if (idx % 2 === 0) {
            $(this).addClass('even_row');
        } else {
            $(this).addClass('odd_row');
        }
    });

    $('#car_list .car_block')
        .append(function (idx) {
            const body = $(`<div class="row"></div>`);
            body
                .append(`<div class="col-3">${cars[idx].make}</div>`)
                .append(`<div class="col-3">${cars[idx].model}</div>`)
                .append(`<div class="col-3">${cars[idx].year}</div>`)
                .append(`<div class="col-1">${cars[idx].price}</div>`)
                .append(`<div class="col-2 d-flex justify-content-end"><button class="btn btn-outline-primary">Like</button></div>`)
                .on('click', function () {
                    testing($(this).parent().first()[0].innerText.trim());
                    // console.log($(this).parent().first()[0].innerText);
            });
            return body;
        });
}
let user = {};

function testing(input){
    // console.log("input: ",input.split("\n"));
    $.post('/like_car', {user: user, infolist: input.split("\n")}).done((msg) => {
        if(msg.data === "/login.html"){
            console.log("message: ",msg);
            location.href = '/login.html'
        }
    });
}

$(document).ready(function () {
    $.getJSON('/get_current_user').done(function (data) {
        user = data.data;
        if (data['message'] === "success") {
            console.log("skejdbgaed: ",user);
            $('.login').remove();
            $('#showname').text(data.data.fullname);
        } else {
            $('.logout').remove();
        }
    });
});

let cars = [
    {
        "stock_num": "19913071",
        "make": "Toyota",
        "model": "Corolla",
        "year": 2015,
        "color": "Red",
        "url": "https://img2.carmax.com/img/vehicles/19913071/1.jpg?width=800",
        "price": 14715
    },
    {
        "stock_num": "20319754",
        "make": "Hyundai",
        "model": "Sonata",
        "year": 2018,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/20319754/1.jpg?width=800",
        "price": 14102
    },
    {
        "stock_num": "20322507",
        "make": "Kia",
        "model": "Optima",
        "year": 2018,
        "color": "Gray",
        "url": "https://img2.carmax.com/img/vehicles/20322507/1.jpg?width=800",
        "price": 2644
    },
    {
        "stock_num": "20322520",
        "make": "Kia",
        "model": "Optima",
        "year": 2018,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/20322520/1.jpg?width=800",
        "price": 11016
    },
    {
        "stock_num": "20196030",
        "make": "Nissan",
        "model": "Sentra",
        "year": 2019,
        "color": "White",
        "url": "https://img2.carmax.com/img/vehicles/20196030/1.jpg?width=800",
        "price": 7377
    },
    {
        "stock_num": "20196050",
        "make": "Nissan",
        "model": "Sentra",
        "year": 2019,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/20196050/1.jpg?width=800",
        "price": 6988
    },
    {
        "stock_num": "19662328",
        "make": "Mazda",
        "model": "Mazda3",
        "year": 2016,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/19662328/1.jpg?width=800",
        "price": 7497
    },
    {
        "stock_num": "19913278",
        "make": "Ford",
        "model": "Taurus",
        "year": 2017,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/19913278/1.jpg?width=800",
        "price": 12478
    },
    {
        "stock_num": "19912988",
        "make": "Chevrolet",
        "model": "Malibu",
        "year": 2016,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/19912988/1.jpg?width=800",
        "price": 10529
    },
    {
        "stock_num": "20214390",
        "make": "Toyota",
        "model": "Camry",
        "year": 2018,
        "color": "Black",
        "url": "https://img2.carmax.com/img/vehicles/20214390/1.jpg?width=800",
        "price": 14538
    },
    {
        "stock_num": "19912880",
        "make": "Toyota",
        "model": "Corolla",
        "year": 2016,
        "color": "White",
        "url": "https://img2.carmax.com/img/vehicles/19912880/1.jpg?width=800",
        "price": 9314
    },
    {
        "stock_num": "19912965",
        "make": "Honda",
        "model": "Accord",
        "year": 2020,
        "color": "White",
        "url": "https://img2.carmax.com/img/vehicles/19912965/1.jpg?width=800",
        "price": 9769
    },
    {
        "stock_num": "19662236",
        "make": "Honda",
        "model": "Civic",
        "year": 2015,
        "color": "Silver",
        "url": "https://img2.carmax.com/img/vehicles/19662236/1.jpg?width=800",
        "price": 4589
    },
    {
        "stock_num": "19913309",
        "make": "Dodge",
        "model": "Dart",
        "year": 2013,
        "color": "Silver",
        "url": "https://img2.carmax.com/img/vehicles/19913309/1.jpg?width=800",
        "price": 13095
    }
]

showList(cars);