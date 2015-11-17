(function($) {
<<<<<<< HEAD
=======

    $(function() {
>>>>>>> 8ce38693a855acec38d94fc1ab633a1d87cae415
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
            // 将这个作为标签的一个属性来调
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
                        alert(res.msg);
                        $('#cover').attr('src', res.msg);
                        $('#msg_id').val(res.id);
                        $('#coverMask').css('display', 'block');
                    } else {
                        alert('(╯‵□′)╯︵┻━┻ 失败......');
                    }
                }
            });
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
                //左边栏实时显示输入
                var content = $('#'+name).val();
                
            });
        }
        countchar("title");
        countchar("author");
        var summary_num = 0;
        $('#digest').on('keyup',function(){
            summary_num++;
            var $summary_num = $('#digest+.item>.char_number');
            $summary_num.text(summary_num);
            if(summary_num >120){
                    $('#digest+.item').css('color','#f87171');
                };

        });

        // 点击『+』增加图文副本列表项 增加编辑框
        function addItem(){
            // return;
            var i = 0;
            $('#addMsg').on('click',function(){
                i++;
                var $templateItem = $('.templateItem');
                var $templateEdit = $('.templateEdit');
                var $item = "<div id='' class='msgItem'>"+$templateItem.html()+"</div>";
                var $edit = "<section id='' class='main'>"+$templateEdit.html()+"</section>";
                $('#msgPrivew').append($item);
                $('.matMsg').append($edit);

                // item个数动态变化 
                var index = $(".msgItem:not(.templateItem)").length-1;
                // console.log(index);
                var top = (index-1) * 100+150;
                var mainbox = $('.main:not(.templateEdit)').eq(index);
                mainbox.show();
                mainbox.find('.inner').css('margin-top',top);
                mainbox.siblings(".main").hide();
                
                var item_len = $('#msgPrivew .msgItem').length;
                if(item_len >8){
                    alert('最多只能添加8条！');
                    $(this).off();
                }
                
            });
        }
        addItem();
        // 鼠标滑过弹层显示
            function showEditMask(){
                $('#msgPrivew').delegate('.msgItem','mouseenter',function(){
                    $(this).find('.editMask').show();
                });
                $('#msgPrivew').delegate('.msgItem','mouseleave',function(){
                    $(this).find('.editMask').hide();
                });
            }
        showEditMask();

<<<<<<< HEAD
        //编辑器
        var ue = UE.getEditor('editor');

        function getContent() {
            var content = UE.getEditor('editor').getContent();
            var $content = $(content);
            var imgList = $content.find("img");
            console.log(imgList);
            imgList.each(function(i,v){
                var toUrl = $(v).attr("wx_img_url");
                if(toUrl!=undefined){
                    $(v).attr("src",toUrl);
                }else{
                    $(v).attr("src","http://www.baidu.com");
                } 
            });
            console.log($content.html());
            return $content.html();        
        }
        function parseString(str){
            //var str = $("#rightForm #title").val();//str;
            console.log(str);
            str=str.replace(/\\/g,"\\\\");
            str=str.replace(/\'/g,"\\'");
            str=str.replace(/\"/g,"\\\"");
            console.log(str);
            return str;
           
        }
        $(".foot .sub").click(function(){
            var content = getContent();
            //console.log(content);
            parseString("");
            var msgArray = new Array();
            var list = $(".msgItem:not(.template)");
            list.each(function(i,v){
                var item = {};
                    item.msg_id = 1;
                    item.thumb_media_id="";
                    item.title = "";
                    item.content = "";
                    item.show_cover_pic = "";
                    item.digest = "";
                    item.author = "";
                    item.content_source_url = "";
                msgArray.push(item);

            });
            console.log(msgArray);

            // {
            //     "msg_id": 10,
            //     "thumb_media_id": "BZ9DVu2UGJwQaEP4mPmacAVfsJ-Cq6_lmuIokKIQjD7kA0RIFdlX1RBawkI__tB9",
            //     "title": "猫知识!一到冬天就变黑脸！很多人不晓得！",
            //     "content": "一到冬天就变黑脸，暹罗猫毛色随体温变化",
            //     "show_cover_pic": 1,
            //     "digest": "",
            //     "author": "白兔大白",
            //     "content_source_url": "www.jd.com"
            // },
            
        });
=======
        //实时输入 显示
        function showInfo( ){
            // $('#main-' + index )
            $('.matMsg').delegate('.title-input','keydown',function(){
                var index = $('.title-input').length-1;
                console.log('index'+index);
                var title_value = $('.title-input').eq(index).val();
                console.log('title_value'+$('.title-input'));
                $('.msgItem').eq(index).find('h4').text(title_value);

            });
            
        }
        showInfo( );   
                
>>>>>>> 8ce38693a855acec38d94fc1ab633a1d87cae415

})($);



