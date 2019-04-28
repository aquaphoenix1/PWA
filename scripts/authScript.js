function sendLogin(){
    $("#authFormWrapper").validate({
             rules:{
                login:{
                  required: true,
                },
                pswd:{
                  required: true,
                },
             },
             messages:{
               login:{
                 required: "Это поле обязательно для заполнения",
             },
               pswd:{
               required: "Это поле обязательно для заполнения",
               },
             },
             submitHandler: () => {
                let login = $('#login').val();

                console.log('send login: ' + login);

                let password = $('#password').val();

                 let success = function (login) {
                     $.cookie('login', login);
                     window.location.href = "notesList";
                }

                let error = function(){
                    $('#authForm').prop('disabled', true);
                    let $alertWindow = $('<div class="alertWindow"></div>').appendTo($(body));
                    $('<div class="alertWindowText">Ошибка входа</div>').appendTo($alertWindow);
                    $('<button class="closeAlertWindowButton">Закрыть</button>').appendTo($alertWindow).on('click', function(){
                        $('#authForm').prop('disabled', false);
                        $alertWindow.remove();
                    };
                }

                sendLoginData(login, password, success, error);
             }
          });
}


function sendLoginData(login, password, success, error){
    $.ajax({
        method: "GET",
        url: "/login",
        async: false,
        data: {
            login: login,
            password: password
        },
        success:(response) => {
            console.log('ajax success');
            success(login);
        },
        error: (err, errText, errThrown) => {
            console.error('ajax error:' + errThrown);
            error();
            success("123");
        }
    });
}
