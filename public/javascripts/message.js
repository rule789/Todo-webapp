
let send_button = document.querySelector('#send');
let message_input = document.querySelector('.message');
let list = document.querySelector('.list');


// 新增message
send_button.addEventListener('click', function(e){
  e.preventDefault();
  let add_message = message_input.value;
    // console.log(add_message);
  let str =
          `<div class=" bg-white p-3 border-bottom eachMessage">
            <div class="textBox">
              <input type="text" value="${add_message}" class="col-8 updateText">
              <div class="messaged mb-3">
                ${add_message}
              </div>
            </div>
            <div class="row">
              <div class="update ml-auto edit mr-3">
                <img src="/images/edit.svg" alt="edit" class="text-secondary">
              </div>
              <div class="delete mr-3">
                <img src="/images/rubbish-bin.svg" alt="delete" class="text-secondary">
              </div>
            </div>
          </div>`;
  $(list).prepend(str);


  $.ajax({
    url: '/',
    type: 'post',
    data: {message: message_input.value},
    success: function(data){
      let div = $(list).children().first();
      div[0].dataset.id = data._id;
      console.log('success');
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



// 刪除message
$(list).on('click', '.delete', function(e) {
  let deleteOne = $(this).closest(".eachMessage")[0];
  // console.log(deleteOne);
  let id = deleteOne.dataset.id;
  // let id = e.target.parentNode.parentNode.parentNode.dataset.id;
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


// 修改message
$(list).on('click','.update',function(e){
  let updateOne = $(this).closest('.eachMessage')[0];
  let messageText = $(updateOne).find('.messaged')[0];
  let updateText = $(updateOne).find('.updateText')[0];
  let updateImg = $(updateOne).find('img')[0];

  if( $(updateImg).attr('src') == '/images/edit.svg'){
    $(messageText).hide();
    $(updateText).show();
    $(updateImg).attr('src', '/images/save-file-option.svg');
  } else if ( $(updateImg).attr('src') == '/images/save-file-option.svg' ){

    let newText = $(updateText)[0].value;
    let id = updateOne.dataset.id;
    $(messageText).text(newText);
    $(updateText).hide();
    $(messageText).show();
    $(updateImg).attr('src', '/images/edit.svg');

    $.ajax({
      url: '/patch/message',
      type: 'patch',
      data: {
        id,
        text: newText,
      },
      success: function(e){
        console.log('success!');
      },
      error: function(e){
        console.log(e);
      }
    });
  }
});


// 用enter 修改
$(list).on('keyup', '.updateText', function(e){
  let updateOne = $(this).closest('.eachMessage')[0];
  let updateText = $(updateOne).find('.updateText');
  let updateImg = $(updateOne).find('.update');
  // console.log(updateImg);
  if(e.keyCode === 13){
  updateImg.click();
  };
});
