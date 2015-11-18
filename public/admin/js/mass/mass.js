(function($) {
    $(function() {
        var questTable = $('#questTable');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);

        questTable.delegate('.gm-search', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
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
        });
    });
})($);


