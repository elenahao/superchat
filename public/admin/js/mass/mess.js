
var massMessage = {
    rightForm:$('#rightForm'),
    templateItem:$('.templateItem'),
    templateEdit:$('.templateEdit'),
    getIndex:function(){
        var index = $(".msgItem:not(.templateItem)").length-1;
        return index;
    },
    lastEditor:function(){    
        return $('.main:not(.templateEdit)').eq(this.getIndex());
    },
    lastMsgItem:function(){
        return $(".msgItem:not(.templateItem)").eq(this.getIndex());
    },

    uploadImg:function(){
        $('.fileInput').on('change',function(e){
            var csrfKey = $('#csrfKey').val();
            var currentObj = $(this).parents(".main");
            var index  = $(".main").index(currentObj);
            console.log('当前的上传图片'+index);
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
            if(currentObj.hasClass("mainEdite")){
                if(msg_id && msg_id != ''){
                    //update
                    url = '/admin/api/mass/fileUpdate';
                }else{
                    //insert
                    url = '/admin/api/mass/fileInsert';
                }
            }else{
                if(msg_id && msg_id != ''){
                    //update
                    url = '/admin/api/mass/fileItemUpdate';
                }else{
                    //insert
                    url = '/admin/api/mass/fileItemInsert';
                }
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
                        $('.msgItem').eq(index).find('.curAvatar').attr('src', res.msg);
                        // console.log($('.msgItem').eq(0).find('.curAvatar'));
                        $('.msgItem').eq(index).find('.curAvatar').show();
                        $('.msgItem').eq(index).find('.defaultImg').hide();
                        $(".main").eq(index).find('.msg_id').val(res.id);
                        $('#coverMask').css('display', 'block');
                        $(".main").eq(index).find('.thumb_media_id').val(res.thumb_media_id);
                        
                    } else {
                        alert('(╯‵□′)╯︵┻━┻ 失败......');
                    }
                },error: function(err){
                    alert('(╯‵□′)╯︵┻━┻ 失败......');
                }
            });
        });
    },
    //添加左侧item
    addMsgItem:function(){
        var $item = "<div id='' class='msgItem'>"+this.templateItem.html()+"</div>";
        var $edit = "<section id='' class='main'>"+this.templateEdit.html()+"</section>";
        $('#msgPrivew').append($item);
        $('.matMsg').append($edit);
        var top = (this.getIndex()-1) * 100+150;
        this.lastEditor().show();
        this.lastEditor().find('.inner').css('margin-top',top);
        this.lastEditor().siblings(".main").hide(); 
        var editor = this.lastEditor().find(".editor");
        var id = "editor"+Math.random()*1000;
        editor.attr("id",id); 
        this.initEditor(id);
            
    },
    //统计输入的个数
    countChar:function(){
        for(var i=0;i<arguments.length;i++){        
            var name = arguments[i];
            var _this = this;
            var num = 0,maxCharNum =0;
            (function(name){
                var $name = _this.lastEditor().find('.'+name);
                $name.on('keyup',function(){
                var $char_num = $name.siblings().find('.char_number');
                var $item = $('.'+name+'+.item');
                if(name == 'title-input'){
                    maxCharNum = 64;
                }
                if(name == 'author-input'){
                    maxCharNum = 8;
                }
                if(name == 'digest-input'){
                    maxCharNum = 120;
                }
                var num = $.trim($name.val()).length;
                $char_num.text(num);

                if(num >maxCharNum){
                    $item.css('color','#f87171');
                };
            });
            })(name);
        };
    },
    initEditor:function(id){
        UE.getEditor(id);
    },
    getEditorContent:function(editor){
       
        var content = editor.getContent();
        if(content!=""||content!=null){
            var $content = $(content);
            var imgList = $content.find("img");
            if(imgList.length>0){
                imgList.each(function(i,v){
                    var toUrl = $(v).attr("wx_img_url");
                    if(toUrl!=undefined){
                        $(v).attr("src",toUrl);
                    }else{
                        $(v).attr("src","http://www.baidu.com");
                    } 
                });
            }
            content=$content.html();
        }
        
        return content;   
    },
    parseString:function(){
        console.log(str);
        str=str.replace(/\\/g,"\\\\");
        str=str.replace(/\'/g,"\\'");
        str=str.replace(/\"/g,"\\\"");
        console.log(str);
        return str;
    }


};

$(function(){
    $('.matMsg').delegate('.title-input','keyup',function(){
        var currentObj = $(this).parents(".main");
        var index  = $(".main").index(currentObj);
         var title_value = $(this).val();
        $('.msgItem').eq(index).find('h4').text(title_value);
    });

    //增加
    $('#addMsg').on('click',function(){
        var item_len = massMessage.getIndex();
        if(item_len >7){
            $('.reminder').show();
            var t = setTimeout(function(){
                $('.reminder').hide();
            },1000);
            return;
            //$(this).off();
        };
        massMessage.addMsgItem();
        massMessage.uploadImg();
        massMessage.countChar('title-input','author-input','digest-input');
        $(".label_check").click(function(){
            if($(this).hasClass("c_on")){
                $(this).removeClass("c_on");
                $(this).addClass("c_off");
            }else{
                $(this).removeClass("c_off");
                $(this).addClass("c_on");
            }
        });
    });
    massMessage.countChar('title-input','author-input','digest-input');

    //编辑
    $('#msgPrivew').delegate('.editButn','click',function(){

        var indx = $(this).parents(".msgItem").index();
        console.log("edit==="+indx);
        $('.main').eq(indx).show();
        $('.main').eq(indx).siblings('.main').hide();

    });
    //删除
    $('#msgPrivew').delegate('.deleteButn','click',function(){
        var indx = $(this).parents(".msgItem").index();
        var index = $(".msgItem").length-1;
        if(indx == index){
            // console.log('删除是最后一项');
            $('.main').eq(0).show();
            $('.main').eq(0).siblings('.main').hide();
        }
        else{
            var currentObj = $('.main').eq(indx);
            var list = currentObj.nextAll();
            list.each(function(i,v){
                var obj = $(v);
                var top = obj.find('.inner').css('margin-top');
                    obj.find('.inner').css('margin-top',parseInt(top)-100);
            });
            $('.main').eq(index).show();
            $('.main').eq(index).siblings('.main').hide();
        }
        $('.main').eq(indx).remove();
        $('.msgItem').eq(indx).remove();

    });
    // 鼠标滑过弹层显示
    $('#msgPrivew').delegate('.msgItem','mouseenter',function(){
        $(this).find('.editMask').show();
    });
    $('#msgPrivew').delegate('.msgItem','mouseleave',function(){
        $(this).find('.editMask').hide();
    });

    //编辑图片显示
    massMessage.uploadImg();
    massMessage.initEditor("cover_editor");
    $(".foot .sub,.foot .preview").click(function(){
        var msgArray = new Array(),
            list = $(".msgItem:not(.templateItem)"),
            $mainList = $(".main");
            var isNull = false;
            list.each(function(i,v){
                var index = $(v).index();
                var flag = $(v).hasClass("coverItem");
                var show = 1;
                var item = {};
                var id = $mainList.eq(index).find(".msg_id").val();
                var thumb_media_id = $mainList.eq(index).find(".thumb_media_id").val();
                var title = $mainList.eq(index).find(".title-input").val(); 
                var editorId = $mainList.eq(index).find(".editor").attr("id");
                var editor = UE.getEditor(editorId);
                var content = massMessage.getEditorContent(editor);
                var showObj = $mainList.eq(index).find(".label_check");
                if(title==null||title==""||id==""||id==null||content==""||content==null){
                        isNull = true;
                        alert("信息填写不完整，请检查填写，重新提交！");
                }
                if(showObj.hasClass("c_on")){
                    show = 1;
                }else{
                    show = 0;
                }
                var digest = $mainList.eq(index).find(".digest-input").val();
                var author = $mainList.eq(index).find(".author-input").val();

                if(flag){
                    item.msg_id = id;
                }else{
                    item.id = id;
                }
                item.thumb_media_id= thumb_media_id;
                item.title = title;
                item.content = content;
                item.show_cover_pic = show;
                if(flag){
                    item.digest = digest;
                }
                item.author = author;
                item.content_source_url = "";
                msgArray.push(item);
                
            });
            if(isNull)return;
            console.log(msgArray);
            //调用ajax传参
            var csrfKey = $('#csrfKey').val();
            console.log('csrfKey='+csrfKey);
            var url = "/admin/api/mass/uploadMsg";
            if($(this).hasClass("preview")){
                url = "/admin/api/mass/preview";
            }
            $.ajax({
                url: url,
                headers: {
                    'X-CSRF-Token': csrfKey
                },
                data: {params: msgArray},
                type: 'POST',
                dataType: 'json',
                success: function(res) {
                    if (res.ret == 0) {
                        window.location.href = '/admin/mass?msg_id='+res.id+'&media_id='+res.media_id;
                    } else {
                        alert('(╯‵□′)╯︵┻━┻ 失败......');
                    }
                },error: function(err){
                    alert('(╯‵□′)╯︵┻━┻ 失败......');
                }
            });
    });
    $(".foot .cancel").click(function(){
        window.location.href="/admin/mass";
    });
});
