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
    //Derek
    var oRadio = $(".submit_radio");
    console.log(oRadio);
    for(var i = 0; i<oRadio.length; i++){
        (function(){
            var p = i;
            oRadio[p].onclick = function(){
                console.log(p);
                switch(p){
                    case 0:
                        showSelect("#select_sex");
                        break;
                    case 1:
                        showSelect("#select_city");
                        break;
                    case 2:
                        showSelect("#select_country");
                        break;
                    case 3:
                        showSelect("#select_province");
                        break;
                    case 4:
                        showSelect("#select_language");
                        break;
                    default :
                        showSelect("#select_sex1");
                        break;
                }
            };
        })();
    }
    function showSelect(id) {
        $(".submit_select").removeClass("display");
        $(id).removeClass("display");
        $(id).siblings().addClass("display");
    }
})($);

