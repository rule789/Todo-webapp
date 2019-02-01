
// 暱稱
let nick = document.getElementById('nickChange');
let nickBtn = document.getElementById('nickBtn');


if(nick.value){
  $(nick).attr('readonly', true);
  nickBtn.innerHTML = '修改';
}

nickBtn.addEventListener('click', function(e){
  // console.log(nickBtn.innerHTML);
  e.preventDefault();
  if(nick.value && nickBtn.innerHTML == '確定'){
    $.ajax({
      url: '/user/nickname',
      type: 'post',
      data: {nickname: nick.value},
      success: function(res){
        console.log(res);
        nickBtn.innerHTML = '修改';
        $(nick).attr('readonly', true);
      }
    });
  } else if(nick.value && nickBtn.innerHTML == '修改'){
    $(nick).attr('readonly', false);
    nickBtn.innerHTML = '確定';
  }
});

nick.addEventListener('keyup', function(e) {
  if(e.keyCode === 13){
    nickBtn.click();
  }
});


// 上傳圖片
function uploadFile(){
  let file = document.getElementById('file');
  let formData = new FormData();
  formData.append('file', file.files[0]);
  console.log(formData);
  $.ajax({
    url: '/user/picture',
    type: 'post',
    data: formData,
    contentType: false,
    processData: false,
    success: function(data){
      console.log(data);
      if(200 === data.code && data.data) {
        $('#result').html("上傳成功！");
        $('#img').attr('src',data.data);
        $('.modal').modal('hide');
      } else if (data.code === 200 && data.msg == 'no picture'){
        $('#result').html('沒有上傳檔案喔');
      } else if (data.code === 200 && data.msg == 'File too large'){
        $('#result').html('上傳失敗，檔案過大');
      }
      else {
        $('#result').html("上傳失敗！");
      }
    },
    error: function(){
      $("#result").html("與伺服器通訊發生錯誤");
    }
  });

}

// 按鈕新增事件
let upload = document.getElementById('upload');
  upload.addEventListener('click', function() {
    uploadFile();
  });

