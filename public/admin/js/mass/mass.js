(function($) {
    $(function() {
        var questTable = $('#questTable');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);

        questTable.delegate('.gm-search', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var msg_id = questTable.find('#msg_id').val();
            var media_id = 111;//questTable.find('#media_id').val();
            alert(msg_id);
            alert(media_id);
            if(msg_id != 'undefined' && media_id != 'undefined'){
                alert('ok')
                //$.ajax({
                //    url: questTable.attr('action'),
                //    headers: {
                //        'X-CSRF-Token': csrfKey
                //    },
                //    type: 'POST',
                //    data: questTable.serialize(),
                //    dataType: 'json',
                //    success: function(res) {
                //        if (res.ret == 0) {
                //            alert(res.msg);
                //        } else {
                //            alert('(╯‵□′)╯︵┻━┻ 失败......');
                //        }
                //    }
                //});
            }else{
                alert('(╯‵□′)╯︵┻━┻ 先创建一个图文消息才能群发啊！...');
            }
        });
    });
})($);


