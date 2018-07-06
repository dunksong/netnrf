﻿//对齐方式
z.DC["dataurl_ct_colalign"] = {
    data: [
        { value: 1, text: "居左" },
        { value: 2, text: "居中" },
        { value: 3, text: "居右" }
    ],
    init: function () {
        this.panelHeight = 100;
    }
}
//显示/隐藏
z.DC["dataurl_ct_colhide"] = {
    data: [
        { value: 0, text: "显示" },
        { value: 1, text: "隐藏" }
    ],
    init: function () {
        this.panelHeight = 100;
    }
};
//冻结
z.DC["dataurl_ct_colfrozen"] = {
    data: [
        { value: 1, text: "冻结" },
        { value: 0, text: "不冻结" }
    ],
    init: function () {
        this.panelHeight = 100;
    }
};
//导出
z.DC["dataurl_ct_colexport"] = {
    data: [
        { value: 1, text: "导出" },
        { value: 0, text: "不导出" }
    ],
    init: function () {
        this.panelHeight = 100;
    }
};

//页面表索引
z.TableIndex = $('#hidtableindex').val();
//页面表名
z.TableName = $('#hidtablename').val();

//载入
var gdct = z.Grid();
gdct.url = "/Inlay/QueryConfigTable?tableName=" + z.TableName;
gdct.id = "#Gridct";
gdct.autosize = "p";
gdct.autosizePid = "#PGridct";
gdct.fitColumns = true;
gdct.striped = true;
gdct.pagination = false;
gdct.sortName = "ColOrder";
//编辑
gdct.onClickCell = function (index, field, value) {
    z.GridEditor(gdct, index, field);
}
gdct.columns = [[
    { field: "DvTitle", title: "<span style='color:#ff892a'>默认标题</span>" },
    { field: "ColTitle", title: "标题", FormType: "text" },
    { field: "ColAlign", title: "对齐方式", FormType: "combobox", FormUrl: "dataurl_ct_colalign", formatter: function (value) { return value == 2 ? "居中" : value == 3 ? "居右" : "居左"; } },
    { field: "ColWidth", title: "列宽", FormType: "text" },
    { field: "ColHide", title: "隐藏", FormType: "combobox", FormUrl: "dataurl_ct_colhide", formatter: function (value) { return value == 1 ? "隐藏" : "显示" } },
    { field: "ColFrozen", title: "冻结", FormType: "combobox", FormUrl: "dataurl_ct_colfrozen", formatter: function (value) { return value == 1 ? "冻结" : "不冻结" } },
    { field: "ColExport", title: "导出", FormType: "combobox", FormUrl: "dataurl_ct_colexport", formatter: function (value) { return value == 1 ? "导出" : "不导出" } }
]];
gdct.onBeforeBind = function () {
    $(this.columns[0]).each(function (i) {
        this.width = 1 > 1 ? 100 : 130;
    })
}
//查询条件
gdct.onBeforeLoad = function (row, param) {
    //条件
    var sq = z.SqlQuery();

    var sqitem1 = sq.item();
    sqitem1.field = "TableName";
    sqitem1.relation = "Equal";
    sqitem1.value = z.TableName;

    var sqitem2 = sq.item();
    sqitem2.field = "ColHide";
    sqitem2.relation = "Equal";
    sqitem2.value = 0;

    sq.wheres.andor = "and";
    sq.wheres.items = [];
    sq.wheres.items.push(sqitem1);
    sq.wheres.items.push(sqitem2);

    param.wheres = sq.stringify();
}
gdct.onComplete(function () {
    //高度
    AutoHeightGrid(gdct);
    //载入拖拽并启用
    if (!gdct.dnd) {
        gdct.dnd = 1;
        $.getScript('/lib/jquery-easyui-1.5.4/ext/datagrid-dnd.min.js', function () {
            gdct.func('enableDnd');
        })
    }
})

function AutoHeightGrid(gd) {
    gd.func('resize', {
        width: $(gd.autosizePid).width(),
        height: $(window).height() - 160
    });
}

//表格配置
$('#list_Config_Table').click(function () {
    if (z.mdct) {
        z.mdct.show();
    } else {
        //构建表格配置的模态框
        z.mdct = z.Modal();
        z.mdct.content = "<div id='PGridct'><div id='Gridct' class='loadingimg'></div></div>";
        z.mdct.size = 3;
        z.mdct.cancelText = "<i class='fa fa-reply-all'></i> 重置";
        z.mdct.cancelClick = function () {
            gdct.load();
        }
        z.mdct.okText = "<i class='fa fa-save'></i> 保存";
        z.mdct.okClick = function () {
            var rowData = gdct.func('getRows');
            //保存
            $.ajax({
                url: '/inlay/SaveConfigTable',
                type: 'POST',
                data: {
                    tablename: z.TableName,
                    rows: JSON.stringify(rowData)
                },
                success: function (data) {
                    if (data == "success") {
                        z.mdct.hide();
                        art('操作成功，刷新生效，是否刷新？', function () {
                            location.reload(false);
                        })
                    } else {
                        art('fail');
                    }
                },
                error: function () {
                    art('error');
                }
            })
        };
        z.mdct.append();
        var md = $("#" + z.mdct.id).addClass('fade').attr('data-backdrop', 'static');

        //设置标题
        z.FormTitle({
            icon: "fa-cog orange",
            title: "表格配置 （ 拖动排序 ）",
            required: false,
            id: md.find('h4.modal-title')
        });

        //显示时，调整大小，初始化时载入数据&点击空白结束编辑
        md.on('shown.bs.modal', function () {
            if (!gdct.isnotfirst) {
                gdct.load();
                z.GridEditorBlank(gdct);
                gdct.isnotfirst = 1;
            } else {
                AutoHeightGrid(gdct);
            }
        });
        //载入提示
        z.GridLoading(gdct);
        z.mdct.show();

        $(window).resize(function () {
            AutoHeightGrid(gdct);
        });
    }
});
