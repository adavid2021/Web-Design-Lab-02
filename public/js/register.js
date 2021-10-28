const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("error")) {
    $('#error_msg').text(urlParams.get("error"));
}

$('form').on('submit', function () {
    let errorMessage = null

    $.each($('input,textarea'), function () {
        $(this).removeClass('is-invalid text-danger')
    });

    $.each($('.requ'), function () {
        if (!$(this).val()) {
            errorMessage = `${$(this).parent().find('label').text()} cannot be empty`;
            $(this).addClass('is-invalid text-danger');
            $('#error_msg').text(errorMessage);
            return false
        }
    });

    console.log("err: " + errorMessage);

    if(!errorMessage){
        if($('#email').val().length < 3) {
            errorMessage = "username must be at least 3 characters long";
            $('#password').addClass('is-invalid text-danger');
            $('#error_msg').text(errorMessage);
            return false;
        }

        if($('#password').val().length < 5) {
            errorMessage = "password must be at least 5 characters long";
            $('#password').addClass('is-invalid text-danger');
            $('#error_msg').text(errorMessage);
            return false;
        }

        if($('#password').val() !== $('#confirm').val()){
            errorMessage = "password and confirm password must be the same";
            $('#password').addClass('is-invalid text-danger');
            $('#confirm').addClass('is-invalid text-danger');
            $('#error_msg').text(errorMessage);
            return false;
        }
    }
    // console.log("pw: ",$('#password').val().length,$('#confirm').val().length);
    // console.log("pw: ",$('#password').val());




    console.log("em is now: " + errorMessage);

    if (errorMessage !== null) {
        console.log("error on client side");
        $('#error_msg').text(errorMessage);
        return false;
    }
});