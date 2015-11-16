
var massMessage = {
    rightForm:$('#rightForm'),
    templateItem:$('.templateItem'),
    templateEdit:$('.templateEdit'),
    getIndex:function(){
        var index = $(".msgItem:not(.templateItem)").length-1;
        return index;
    },
    currentEditor:function(){    
        return $('.main:not(.templateEdit)').eq(this.getIndex());
    },
    currentMsgItem:function(){
        return $(".msgItem:not(.templateItem)").eq(this.getIndex());
    },
    currentTitleInput:function(){
        return this.currentEditor().find('.title-input');
    },
    currentAuthorInput:function(){
        return this.currentEditor().find('.author-input');
    },
    uploadImg:function(){
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
                        // alert(res.msg);
                        $('#cover').attr('src', res.msg);
                        $('#msg_id').val(res.id);
                        $('#coverMask').css('display', 'block');
                    } else {
                        alert('(╯‵□′)╯︵┻━┻ 失败......');
                    }
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
        this.currentEditor().show();
        this.currentEditor().find('.inner').css('margin-top',top);
        this.currentEditor().siblings(".main").hide();           
    },
    countChar:function(){

        for(var i=0;i<arguments.length;i++){        
            var name = arguments[i];
            var _this = this;
            var num = 0,title_num = 0,author_num = 0,summary_num = 0,maxCharNum =0;
            var title_nums=[8];
            (function(name){
                var $name = _this.currentEditor().find('.'+name);
                $name.on('keyup',function(){
                var $char_num = $name.siblings().find('.char_number');
                var $item = $('.'+name+'+.item');
                if(name == 'title-input'){
                    title_num++;
                    maxCharNum = 64;
                    num = title_num;
                }
                if(name == 'author-input'){
                    author_num++;
                    maxCharNum = 8;
                    num = author_num;
                }
                if(name == 'digest-input'){
                    summary_num++;
                    maxCharNum = 120;
                    num = summary_num;
                }
                $char_num.text(num);

                if(num >maxCharNum){
                    $item.css('color','#f87171');
                };
            });
            })(name);
        };
    },
    // 实时显示输入标题
    showInfo:function(){
        var _this = this; 
        var title_value = _this.currentTitleInput().val();
        _this.currentMsgItem().find('h4').text(title_value);

    }
};

$(function(){
    $('.matMsg').delegate('.title-input','keyup',function(){
        // console.log('title-input '+massMessage.getIndex())
        massMessage.showInfo();
    });
    $('#addMsg').on('click',function(){
        massMessage.addMsgItem();
        var item_len = massMessage.getIndex();
        if(item_len >8){
            alert('最多只能添加8条！');
            $(this).off();
        };
        massMessage.countChar('title-input','author-input','digest-input');
    });
    massMessage.countChar('title-input','author-input','digest-input');

    // 鼠标滑过弹层显示
    $('#msgPrivew').delegate('.msgItem','mouseenter',function(){
        $(this).find('.editMask').show();
    });
    $('#msgPrivew').delegate('.msgItem','mouseleave',function(){
        $(this).find('.editMask').hide();
    });
});
