(function($) {
    $(function() {
        var rightForm = $('#rightForm');
        var leftForm = $('#leftForm');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);

        rightForm.delegate('.fileInput', 'change', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var formData = new FormData();
            var files = $(this)[0].files;
            if(files){
                formData.append('fileInput', files[0]);
            }
            $.ajax({
                url: '/admin/api/mass/fileUpload',
                data: formData,
                headers: {
                    'X-CSRF-Token': csrfKey
                },
                type: 'POST',
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.ret == 0) {
                        $('#cover').attr('src', res.msg);
                        $('#coverMask').css('display', 'block');
                    } else {
                        alert('(╯‵□′)╯︵┻━┻ 失败......');
                    }
                }
            });
        });
        leftForm.delegate('.fileInput', 'change', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var formData = new FormData();
            var files = $(this)[0].files;
            if(files){
                formData.append('fileInput', files[0]);
            }
            $.ajax({
                url: '/admin/api/mass/fileUpload',
                data: formData,
                headers: {
                    'X-CSRF-Token': csrfKey
                },
                type: 'POST',
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function(res) {
                    if (res.ret == 0) {
                        $('#cover').attr('src', res.msg);
                        $('#coverMask').css('display', 'block');
                    } else {
                        alert('(╯‵□′)╯︵┻━┻ 失败......');
                    }
                }
            });
        });

        leftForm.delegate('#addMsg', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var msgPrivew = $('#msgPrivew');
            var msgItem_last_id = msgPrivew.children().last().attr('id');
            var _id = 'msgItem'+parseInt(msgItem_last_id.charAt(msgItem_last_id.length-1))+1;
            //var node = document.createTextNode($('#msgItem_add').attr('id', _id));

            var msgItem = $('#msgItem_add');
            //msgItem.css('display', 'block');
            //msgItem.attr('id', 'msgItem'+parseInt(msgItem_last_id.charAt(msgItem_last_id.length-1))+1);
            msgPrivew.append(msgItem.attr('id', _id));
            $('#'+_id).css('display', 'block');
        });
    });
})($);

