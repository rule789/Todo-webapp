let account = document.querySelector('#account');
let pwd = document.querySelector('#pwd');
let sendBtn = document.querySelector('#send');


$(sendBtn).on('click', function(e){
  e.preventDefault();
  $.ajax({
    url: '/user/login',
    type: 'post',
    data: {
      email: account.value,
      password: pwd.value
    },
    success: function(data){
      console.log(data);
      if(data.result == 'success'){
        window.location.href = '/';
      } else if (data.result == 'noUser'){
        $('.errorText').text('無此帳號');
        $('.errorTextBorder').css('display','flex');
      } else if (data.result == 'pwdError'){
        $('.errorText').text('密碼有誤');
        $('.errorTextBorder').css('display','flex');
      }
    },
    error: function(e){
      console.log(e);
    }
  });

});
