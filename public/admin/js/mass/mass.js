(function($) {
    $(function() {
        var questTable = $('#questTable');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);
        var _msg_id = $('#msg_id').val();
        var _media_id = $('#media_id').val();
        console.log(_msg_id);
        console.log(_media_id);
        if(_msg_id != 'undefined' && _media_id != 'undefined'){
            console.log('send ok');
            $('.tips').text('您的图文信息已生成，编号为：'+_media_id+'，请进行分组');
        }

        questTable.delegate('.gm-search', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var msg_id = questTable.find('#msg_id').val();
            var media_id = questTable.find('#media_id').val();
            if(msg_id != 'undefined' && media_id != 'undefined'){
                $.ajax({
                    url: questTable.attr('action'),
                    headers: {
                        'X-CSRF-Token': csrfKey
                    },
                    type: 'POST',
                    data: questTable.serialize(),
                    dataType: 'json',
                    success: function(res) {
                        if (res.ret == 0) {
                            alert(res.msg);
                        } else {
                            alert('(╯‵□′)╯︵┻━┻ 失败......');
                        }
                    }
                });
            }else{
                alert('(╯‵□′)╯︵┻━┻ 先创建一个图文消息才能群发啊！...');
            }
        });
    });
})($);


