// the user account profile with the cars they liked, their name, preferred brand etc.
function load_user(user) {
    console.log("after loading liked: ",user.liked);
    $('#name').text(user.fullname);
    $('#brand').text(user.brand);
    $('#profile_img').attr('src', user.profile);

    user.liked.forEach((car) => {
        $('#car_list').append(`<li class="list-group-item">${car.year} ${car.make} ${car.model}, $${car.price}</li>`)
    });
}
let user = {};

$(document).ready(function () {
    $.getJSON('/get_current_user')
        .done(function (data) {
            if (data['message'] === "success") {
                user = data["data"];
                load_user(user);
            }
        });
});