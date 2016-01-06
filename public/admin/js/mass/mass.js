'use strick';
(function($) {
    $(function() {
        var questTable = $('#questTable');
        var csrfKey = $('#csrfKey').val();
        questTable.delegate('.gm-search', 'click', function(e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var group_id = $('.gname option:selected') .val();//groupId
            var media_id = $(".msgList .con").find(".select").data("mediaid");
            if(msg_id != 'undefined' && media_id != 'undefined'){
                $.ajax({
                    url: "/admin/api/mass/group",
                    headers: {
                        'X-CSRF-Token': csrfKey
                    },
                    type: 'POST',
                    data: {group_id:group_id,media_id:media_id},
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

        function renderList(pageNum){
          $.ajax({
          		type:"get",
          		url:"http://192.168.101.24:3000/admin/api/material/?page="+pageNum,
          		async:false,
          		dataType:"jsonp",
          		jsonp:"callback",
          		jsonpCallback:"jsonp",
          		success:function(data){
                var total_count = data.total_count;
                var data = data.item;
                $(".msgList .con").empty();
                for(var i=0;i<data.length;i++){
                  var time = data[i].update_time*1000;
                  var date = new Date(time);

                  var msgItem = '';
                      if(i==0){
                        msgItem +='<div class="mItem select" data-mediaid="'+data[i].media_id+'">';
                      }else{
                        msgItem +='<div class="mItem" data-mediaid="'+data[i].media_id+'">';
                      }
                      msgItem +='   <span class="title">'+data[i].content.news_item[0].title+'</span>';
                      msgItem +='   <span class="date">'+date.getFullYear()+"年"+(date.getMonth()+1)+"月"+date.getDate()+'日'+'</span>';
                      msgItem +='   <span class="operation"><a href="'+data[i].content.news_item[0].url+'">查看详情</a></span>';
                      msgItem +='</div>';
                      $(".msgList .con").append(msgItem);
                }

                var page = '';
                var length = total_count/20+1;
                for(var i=1;i<=length;i++){
                    if(i==pageNum){
                      page += '<i class="pageNum active">'+i+'</i>';
                    }else{
                      page += '<i class="pageNum">'+i+'</i>';
                    }
                }
                $(".page .con").empty();
                $(".page .con").append(page);


              },
              error:function(){}
          });
        }
        renderList(1);

        $(".page").delegate(".pageNum","click",function(){
            $(this).addClass("active");
            $(this).siblings().removeClass("active");
            var num = Number($(this).text());
            renderList(num);
        });
        $(".msgList").delegate(".mItem","click",function(){
            $(this).addClass("select");
            $(this).siblings().removeClass("select");
        });

    });
})($);
