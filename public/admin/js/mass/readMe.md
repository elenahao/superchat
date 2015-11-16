#### 2015-11-16
## 选择图片并显示
1.this作用域问题 在事件中有自身的this
2.
## 编辑按钮
编辑框在添加时已经定好位置了 在修改时，直接显示就行
1. parents('.main') 即选择父元素为main的元素 不论多少层
2. index() jq 获得元素的索引值 从0开始
## 删除按钮
.remove()

1.删除某一项，editbox显示在哪
-- 删除最后一项 显示在第一项
-- 删除中间的一项 显示最后一项
2.index的值
var indx = $(this).parents(".msgItem").index()-1; 这样indx的值显示正确，减去了templete 但是用eq(indx)会出错 将templete选择，最后一个舍弃了
3.删除的编辑框
显示总是在下一个 因为前面删除掉了 他还是保持在添加时的位置
4.css('margin-top')返回的是带px单位的值 如果计算赋值需要用parseInt()先转化
.css(parseInt(top)-100)

## template类在删除和修改时总是影响其他

可以将模板算入到dom中
var indx = $(this).parents(".msgItem").index(); //这样选也是选不到他
$('.main').eq(indx).show();

？？？？？？？？？？？？？？？？？？？？？？？？？？？？？
## 左侧列表增加 删除 第二项编辑有问题
？？？？？？？？？？？？？？？？？？？？？？？？？？？？？

## 如何输入框的输入只是输入字符 排除掉删除键 空格键等
获取.val()的值 然后计算length

##$.trim() //去掉字符串开头和结尾处的空格
