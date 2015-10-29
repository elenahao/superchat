/**
 * Created by elenahao on 15/9/21.
 */

(function($) {
    $(function() {
        var configTable = $('#x_div');
        var questTable = $('#questTable');
        var csrfKey = $('#csrfKey').val();
        console.log(csrfKey);

        configTable.delegate('.country-change', 'change', function(e) {
            e.preventDefault();
            console.log('in country change');
            var country_val = $('.country-change').val();
            if(country_val == '') {
                //如果国家下拉框为空，则后面的省份和城市下拉均制空
                $('.province-change').empty();
                $('.province-change').append('<option value="",selected="selected">--请选择--</option>');
                $('.city-change').empty();
                $('.city-change').append('<option value="",selected="selected">--请选择--</option>');
                return false;
            }else{
                questTable.find('#country').val(country_val);
                $.ajax({
                    url: '/admin/api/area/findProvinceByCountry/' + country_val,
                    headers: {
                        'X-CSRF-Token': csrfKey
                    },
                    data: questTable.serialize(),
                    method: 'POST',
                    dataType: 'json',
                    success: function(res) {
                        alert(res);
                        if (res.ret == 0) {
                            var obj = res.data;
                            var options = '';
                            $(obj).each(function(index){
                                var val = obj[index];
                                if (typeof val === 'object') {
                                    var option = '<option value='+val.name+'>'+val.name+'</option>';
                                    options = options + option;
                                } else {
                                    alert('(╯‵□′)╯︵┻━┻ 失败......');
                                }
                            });
                            $('.province-change').append(options);
                        } else {
                            alert('(╯‵□′)╯︵┻━┻ 失败......');
                        }
                    }
                });
            }
        });
    });
})($);
