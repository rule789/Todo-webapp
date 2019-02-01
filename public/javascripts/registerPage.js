let account = document.querySelector('#account');
let pwd = document.querySelector('#pwd');

// 帳號驗證
$(account).on('blur', function(e){
  let accountText = $(account).val();
  $.ajax({
    url: '/user/register/validator_account',
    type: 'post',
    data: {account: accountText},
    success: function(res){
      let result = res.result;
      console.log(res);
      let notice = $('#account').siblings('small');

      if(result == 'accountFormatError'){
        $(notice).css('color','red').text('**格式有錯喔!!').show();
      } else if (result == 'existed') {
        $(notice).css('color', 'red').text('**帳號已存在').show();
      } else if (result == 'ok') {
        $(notice).hide();
      }
    },
    error: function(e){
      console.log(e, 'acc error');
    }
  });
});


// 密碼驗證
$(pwd).on('blur',function(e){
  let pwdText = $(pwd).val();
  $.ajax({
    url: '/user/register/validator_pwd',
    type: 'post',
    data: {pwd: pwdText},
    success: function(res){
      if(res.result == 'pwdFormatError') {
        $(pwd).siblings('small').text('**要6位數喔!!').css('color','red').show();
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

// 註冊送出 驗證
$(send).on('click', function(e){
  let checkResultText = $('.checkResultText') ;
  let checkWhich;
  let checkError;
  for (var i=0; i < checkResultText.length; i++){
    checkWhich = $(checkResultText)[i];
    checkError = $(checkWhich).css('display');
    if( checkError != 'none' ){
      e.preventDefault();
      // alert('帳號或密碼有誤喔');
    }
  }
});