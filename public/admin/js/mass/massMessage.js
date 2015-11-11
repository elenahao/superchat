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
            }else{
                alert('(╯‵□′)╯︵┻━┻ 请至少选个图片啊......');
                return;
            }
            var msg_id = $('#msg_id').val();
            var url = '';
            if(msg_id && msg_id != ''){
                //update
                url = '/admin/api/mass/fileUpdate';
            }else{
                //insert
                url = '/admin/api/mass/fileInsert';
            }
            $.ajax({
                url: url,
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
                        $('#msg_id').val(res.id);
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

        //实时统计标题、作者表单输入字数
        var char_num = 0,title_num = 0,author_num = 0;
        function countchar(name){
            var $name = $('#'+name);
            $name.on('keydown',function(){
                var char_num = (name == 'title')?++title_num:++author_num;
                var $char_num = $('#'+name+'+.item'+'>.char_number');
                var $item = $('#'+name+'+.item');
                $char_num.text(char_num);
                var maxCharNum = (name == 'title')?64:8;
                if(char_num >maxCharNum){
                    $item.css('color','#f87171');
                };
                
            });
        }
        countchar("title");
        countchar("author");
        var summary_num = 0;
        $('#digest').on('keydown',function(){
            summary_num++;
            var $summary_num = $('#digest+.item>.char_number');
            $summary_num.text(summary_num);
            if(summary_num >120){
                    $('#digest+.item').css('color','#f87171');
                };
        });
        
        
    });
})($);

