/**
 * Created by elenahao on 15/9/11.
 */

(function($) {
    $(function() {
        var questTable = $('#questTable');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);

        questTable.delegate('.group-change', 'change', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);

            var openid = $(this).attr('openid');
            var gid = $(this).val();
            console.log('openid='+openid);
            console.log('gid='+gid);
            questTable.find('#openid').val(openid);
            questTable.find('#gid').val(gid);
            if (openid && gid) {
                $.ajax({
                    url: questTable.attr('action'),
                    headers: {
                        'X-CSRF-Token': csrfKey
                    },
                    data: questTable.serialize(),
                    method: 'POST',
                    dataType: 'json',
                    success: function(res) {
                        if (res.ret == 0) {
                            window.location.href = '/admin/user';
                        } else {
                            alert('(╯‵□′)╯︵┻━┻ 失败......');
                        }
                    }
                });
            }
        });

    });
})($);

