let name = document.getElementById('name');
let email = document.getElementById('email');
let opinion = document.getElementById('opinionText');
let send = document.querySelector('.send');

$(send).on('click', function(e){
  if(!name.value || !email.value || !opinion.value){
    return alert('有空格沒填!!!');
  }
  $.ajax({
    url: '/opinion',
    type: 'post',
    data: {
      name: name.value,
      email: email.value,
      opinion: opinion.value
    },
    success: function(data){
      console.log(data);
    },
    error: function(){
      console.log('opinion error');
    }
  });
});
