let pwd = document.querySelector('#pwd');
let pwdText;

// 密碼驗證
$(pwd).on('blur',function(e){
  pwdText = $(pwd).val();
  // console.log(pwdText);
  $.ajax({
    url: '/user/register/validator_pwd',
    type: 'post',
    data: {pwd: pwdText},
    success: function(res){
      // console.log(res);
      if(res.result == 'pwdFormatError') {
        $(pwd).siblings('small').text('要6位數喔!!').css('color','red').show();
      } else if (res.result == 'ok') {
        $(pwd).siblings('small').hide();
      }
    },
    error: function(e){
      console.log(e, 'pwd error');
    }
  });
});


// 確認密碼
$('#pwd_again').on('blur', function(e){
  if( $(pwd).val() !== $('#pwd_again').val()){
    $('#pwd_again').siblings('small').text('**密碼有誤').css('color','red').show();
  } else {
    $('#pwd_again').siblings('small').hide();
  }
});


// 送出驗證
$('#send').on('click', function(e){
  // e.preventDefault();
  let checkResultText = $('.checkResultText') ;
  let checkWhich;
  let checkError;
  for (var i=0; i < checkResultText.length; i++){
    checkWhich = $(checkResultText)[i];
    checkError = $(checkWhich).css('display');
    if( checkError != 'none' ){
     return e.preventDefault();
    }
  }


});