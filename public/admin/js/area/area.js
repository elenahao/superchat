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
                    url: '/admin/api/area/findProvinceByCountry',
                    headers: {
                        'X-CSRF-Token': csrfKey
                    },
                    data: questTable.serialize(),
                    method: 'POST',
                    dataType: 'json',
                    success: function(res) {
                        if (res.ret == 0) {
                            var obj = res.data;
                            var options = '';
                            $(obj).each(function(index){
                                var val = obj[index];
                                var option = '<option value='+val.name+'>'+val.name+'</option>';
                                options = options + option;
                            });
                            $('.province-change').append(options);
                        } else {
                            alert('(╯‵□′)╯︵┻━┻ 失败......');
                        }
                    }
                });
            }
        });

        configTable.delegate('.province-change', 'change', function(e) {
            e.preventDefault();
            console.log('in province change');
            var province_val = $('.province-change').val();
            if(province_val == '') {
                //如果省份下拉框为空，则后面的城市下拉置空
                $('.city-change').empty();
                $('.city-change').append('<option value="",selected="selected">--请选择--</option>');
                return false;
            }else{
                questTable.find('#province').val(province_val);
                $.ajax({
                    url: '/admin/api/area/findCityByProvince',
                    headers: {
                        'X-CSRF-Token': csrfKey
                    },
                    data: questTable.serialize(),
                    method: 'POST',
                    dataType: 'json',
                    success: function(res) {
                        if (res.ret == 0) {
                            var obj = res.data;
                            var options = '';
                            $(obj).each(function(index){
                                var val = obj[index];
                                var option = '<option value='+val.name+'>'+val.name+'</option>';
                                options = options + option;
                            });
                            $('.city-change').append(options);
                        } else {
                            alert('(╯‵□′)╯︵┻━┻ 失败......');
                        }
                    }, error : function() {
                        alert("系统出现问题");
                    }
                });
            }
        });

    });
})($);
