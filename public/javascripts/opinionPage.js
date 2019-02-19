let name = document.getElementById('name');
let email = document.getElementById('email');
let opinion = document.getElementById('opinionText');
let send = document.querySelector('.send');
let ajax_loader = document.querySelector('.ajax-loader');

$(send).on('click', function(e){
  if(!name.value || !email.value || !opinion.value){
    return alert('有空格沒填!!!');
  }
  $(ajax_loader).show();

  $.ajax({
    url: '/opinion',
    type: 'post',
    data: {
      name: name.value,
      email: email.value,
      opinion: opinion.value
    },
    success: function(data){
      let location = window.location.href;
      if(data = "留言成功"){
        // loading 完成畫面
        $(ajax_loader).find('img').fadeOut(100, function(){
          $(ajax_loader).find('.loader-finish').fadeIn(700, function() {
            // 重新載入網頁
            setTimeout( function(){window.location.href = location;}, 1000);
          });
        });
      }
    },
    error: function(){
      console.log('opinion error');
    }
  });
});
