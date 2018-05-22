/*
 * 功能：用于合并单元格用
 * 作者：宙冰
 * 时间：2018/5/20
 * 依赖：jquery.1.7.1及以上
 */
; (function ($, window, document, undefined) {
    'use strict';//严格javascript模式
    var margetable = function ($eles, opt) {
        this.opt = opt;//用户的配置
        this.defaults = {
            colindex: [{
                index: 0,//要合并的列索引
                dependent: [0]//合并列依赖的列索引，如果index为0，则此值不用赋值
            }]
        };

        this.options = $.extend({}, this.defaults, this.opt);
        var me = this;

        return $eles.each(function () {
            var $this=$(this);
            var colIndexs=me.options.colindex;
            for(var i=0;i<colIndexs.length;i++){
                margetColumn($this,colIndexs[i]);
            }
        });
    };

    // 合并列
    // $ele 要合并的表格
    // option 用户设置的选项
    var margetColumn = function ($ele, option) {
        var me = this;
        var $trs = $ele.find('tbody tr');
        var preRecord = {
            index: 0,
            colspan: 1,
            text: new Object()
        };//用于记录上一次值不同时的值
        var curText = new Object();//用于记录当前午的值
        var isSame = true;//上下两午的值是否相同
        for (var i = 0; i < $trs.length; i++) {
            if (i == 0) {
                preRecord.index = i;
                preRecord.text = setPreRecord($trs.eq(i), option);
            }
            else {
                isSame=true;
                if (option.index > 0 && option.dependent && option.dependent.length > 0) {
                    for (var deIndex = 0; deIndex < option.dependent.length; deIndex++) {
                        if (preRecord.text['col' + option.dependent[deIndex]] != $trs.eq(i).find('td').eq(option.dependent[deIndex]).text()) {
                            isSame = false;
                        }
                    }
                }
                if (isSame == false || preRecord.text['col' + option.index] != $trs.eq(i).find('td').eq(option.index).text()) {
                    $trs.eq(preRecord.index).find('td').eq(option.index).attr('rowspan', preRecord.colspan);
                    preRecord.index = i;
                    preRecord.colspan = 1;
                    preRecord.text = setPreRecord($trs.eq(i), option);
                }
                else {
                    preRecord.colspan++;
                    $trs.eq(i).find('td').eq(option.index).hide();
                }
            }
        }
        $trs.eq(preRecord.index).find('td').eq(option.index).attr('rowspan', preRecord.colspan);
    };

    // 记录最近一次的不同值
    // index 当前的索引
    // $tr 当前的行
    // option 用户设置的选项
    var setPreRecord = function ($tr, option) {
        var textinfo = new Object();
        textinfo['col' + option.index] = $tr.find('td').eq(option.index).text();
        if (option.index > 0 && option.dependent && option.dependent.length > 0) {
            for (var i = 0; i < option.dependent.length; i++) {
                textinfo['col' + option.dependent[i]] = $tr.find('td').eq(option.dependent[i]).text();
            }
        }
        return textinfo;
    }

    $.fn.margetable = function (options) {
        new margetable(this, options);
    }
})(jQuery, window, document);