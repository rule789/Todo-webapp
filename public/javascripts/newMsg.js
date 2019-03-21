let send_button = document.querySelector('#send');
let message_input = document.querySelector('.message');
let list = document.querySelector('.list');


// 新增message
if(send_button){
  send_button.addEventListener('click', function(e){
    e.preventDefault();
    let add_message = message_input.value.trim();

    if(add_message.length == 0){
      return message_input.value = '';
    }

    let str =
            `<div class=" bg-white p-3 border-bottom eachMessage m-1">
              <div class="textBox">
                <div class="messaged">
                </div>
              </div>
            </div>`;
    $(list).prepend(str);

    $.ajax({
      url: '/message',
      type: 'post',
      data: {message: add_message},
      success: function(data){
        // 加入msg的id
        let div = $(list).children().first();
        div[0].dataset.id = data._id;
        // 加入新msg文字
        let message = `${data.nickname} 說： ${add_message}` ;
        $(div[0]).find('.messaged').text(message);
      },
      error: function(err){
        console.log(e);
        alert('哭哭~有錯誤');
      }
    });

    message_input.value = '';
  });


  // 用enter 新增
  message_input.addEventListener('keyup', function(e){
    if(e.keyCode === 13){
      send_button.click();
    };
  });
}



// 刪除message
$(list).on('click', '.delete', function(e) {
  let deleteOne = $(this).closest(".eachMessage")[0];
  let id = deleteOne.dataset.id;
  $.ajax({
    url: '/message/delete',
    type: 'delete',
    data: {id: id},
    success: function(data){
      console.log('success');
      $(deleteOne).remove();
    },
    error: function(e){
      console.log(e);
    }
  });
});
