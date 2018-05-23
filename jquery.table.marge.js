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
            //合并类型 
            //1：表示指定要合并的列索引，并给出合并列时依赖的列索引（要有先后顺序）
            //   例如：
            //   colindex:[{
            //      index: 2,//要合并的列索引
            //      dependent: [0,1]//合并列依赖的列索引
            //   }]
            //2：同时指定要合并的列索引，后面的列合并时依赖前面的列索引
            //   例如：
            //   colindex:[0,1,2]//合并的列，后面的列索引依赖前面的列索引
            type: 1,
            colindex: [{
                index: 0,//要合并的列索引
                dependent: [0]//合并列依赖的列索引，如果index为0，则此值不用赋值
            }]
        };

        this.options = $.extend({}, this.defaults, this.opt);
        var me = this;

        return $eles.each(function () {
            var $this = $(this);
            var colIndexs = me.options.colindex;
            if (me.options.type == "1") {
                //循环要合并的配置，并进行合并操作
                for (var i = 0; i < colIndexs.length; i++) {
                    margetColumn($this, colIndexs[i]);
                }
            }
            else if (me.options.type == "2") {
                margetColumn2($this, me.options);
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
            rowspan: 1,
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
                isSame = true;
                if (option.index > 0 && option.dependent && option.dependent.length > 0) {
                    for (var deIndex = 0; deIndex < option.dependent.length; deIndex++) {
                        if (preRecord.text['col' + option.dependent[deIndex]] != $trs.eq(i).find('td').eq(option.dependent[deIndex]).text()) {
                            isSame = false;
                        }
                    }
                }
                if (isSame == false || preRecord.text['col' + option.index] != $trs.eq(i).find('td').eq(option.index).text()) {
                    $trs.eq(preRecord.index).find('td').eq(option.index).attr('rowspan', preRecord.rowspan);
                    preRecord.index = i;
                    preRecord.rowspan = 1;
                    preRecord.text = setPreRecord($trs.eq(i), option);
                }
                else {
                    preRecord.rowspan++;
                    $trs.eq(i).find('td').eq(option.index).hide();
                }
            }
        }
        $trs.eq(preRecord.index).find('td').eq(option.index).attr('rowspan', preRecord.rowspan);
    };

    // 合并列
    // $ele 要合并的表格
    // option 用户设置的选项
    var margetColumn2 = function ($ele, option) {
        var me = this;
        var $trs = $ele.find('tbody tr');
        var preRecord = [];//用于记录上一次值不同时的值
        var curText = "";
        for (var i = 0; i < $trs.length; i++) {
            var $tr = $trs.eq(i);
            if (i == 0) {
                for (var j = 0; j < option.colindex.length; j++) {
                    preRecord.push({
                        index: i,
                        rowspan: 1,
                        text: $tr.find('td').eq(option.colindex[j]).text()
                    });
                }
            }
            else {
                for (var j = 0; j < option.colindex.length; j++) {
                    var curText = $tr.find('td').eq(option.colindex[j]).text();
                    if (preRecord[j].text != curText) {
                        $trs.eq(preRecord[j].index).find('td').eq(option.colindex[j]).attr('rowspan', preRecord[j].rowspan);
                        preRecord[j].index = i;
                        preRecord[j].rowspan = 1;
                        preRecord[j].text = curText;
                        for (var m = j + 1; m < option.colindex.length; m++) {
                            $trs.eq(preRecord[m].index).find('td').eq(option.colindex[m]).attr('rowspan', preRecord[m].rowspan);
                            preRecord[m].index = i;
                            preRecord[m].rowspan = 1;
                            preRecord[m].text = $tr.find('td').eq(option.colindex[m]).text();
                        }
                        break;
                    }
                    else {
                        $tr.find('td').eq(option.colindex[j]).hide();
                        preRecord[j].rowspan++;
                    }
                }
            }
        }
        for (var m = 0; m < option.colindex.length; m++) {
            $trs.eq(preRecord[m].index).find('td').eq(option.colindex[m]).attr('rowspan', preRecord[m].rowspan);
        }
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