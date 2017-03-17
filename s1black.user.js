// ==UserScript==
// @name         s1black
// @namespace    http://www.xu81.com/
// @version      0.1
// @description  S1 blacklist ext.
// @author       viperasi
// @match        http://bbs.saraba1st.com/2b/*
// @match        https://bbs.stage1.cc/*
// @require      http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/viperasi/s1black/master/s1black.user.js
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand

// ==/UserScript==

var BLACKLIST = 's1blacklist';
var BLACKPRE = 's1black';
var BLACKINPUT = 's1blackname';
(function () {
    'use strict';

    viewlist();
    blackthread();
    blackcomment();
})();

// 黑名单展示
function viewlist() {
    var list = get();
    var navbar_ul = $('#nv>ul');
    var view_li = $('<li>').attr('id', 's1black_bl_view').append('<a href="#">S1黑名单</a>');
    var view_panel = $('<div>').css({
        'border': 'solid 2px',
        'border-radius': '4px',
        'padding': '5px',
        'width': '500px',
        'height': '500px',
        'background': '#f6f7eb',
        'position': 'fixed',
        'z-index': '999',
        'overflow': 'hidden',
        'left': '200px',
        'top': '200px'
    });
    var view_panel_bar = $('<h3>').css('margin', '5px').append('S1黑名单插件 列表   ');
    var view_panel_add = $('<input>').css('width', '140px').attr({
        'id': BLACKINPUT,
        'placeholder': '用户ID'
    }).appendTo(view_panel_bar);
    var view_panel_add_btn = $('<button>').append('添加').click(function () {
        var theValue = $('#' + BLACKINPUT).val().trim();
        if (theValue != '') {
            add(theValue);
            $('#' + BLACKINPUT).val('');
            var btn = $('<button>X</button>').click(function () {
                del(name);
            });
            var item = $('<span>').css('margin', '5px').attr('id', BLACKPRE + theValue).append(btn).append(theValue);
            view_panel_list.append(item);
        }
    }).appendTo(view_panel_bar);
    var view_panel_close = $('<span>').css('float', 'right').addClass('flbc').append('关闭').click(function () {
        view_panel.hide();
    }).appendTo(view_panel_bar);
    view_panel.append(view_panel_bar);
    var view_panel_help = $('<div>').addClass('pbt').addClass('cl').append(
        $('<span>').addClass('z').append('添加、删除后请刷新页面.')
    ).appendTo(view_panel);
    var view_panel_list = $('<div>').css('overflow', 'auto');
    $.each(list, function (i, name) {
        var btn = $('<button>X</button>').click(function () {
            del(name);
        });
        var item = $('<span>').css('margin', '5px').attr('id', BLACKPRE + name).append(btn).append(name);
        view_panel_list.append(item);
    });
    view_panel.append(view_panel_list).appendTo('body').hide();
    view_li.on('click', function () {
        view_panel.show();
    });
    navbar_ul.append(view_li);

    var authi = $('.authi>a.xw1');
    $.each(authi, function(i, item){
        var btn = $('<button>').append('+').click(function(){
            add($(item).text());
            location.reload();
        });
        $(item).parent().append(btn);
    });
    // $.each(authi, function(i, item){
    //     console.log($(item).find('.xw1').text(), $(item));
    //     var btn = $('<button>').append('+');
    // });
}

// 添加黑名单
function add(theValue) {
    var list = get();
    for (var i = 0; i < list.length; i++) {
        var name = list[i];
        if (name == theValue) {
            return;
        }
    }
    list.push(theValue);
    save(list);
}

// 删除黑名单
function del(theValue) {
    var list = get();
    var newlist = [];
    $.each(list, function (index, name) {
        if (theValue != name) {
            newlist.push(name);
        }
    });
    save(newlist);
    $('#' + BLACKPRE + theValue).remove();
}

// 保存黑名单
function save(list) {
    GM_setValue(BLACKLIST, list);
}

// 获取黑名单列表
function get() {
    return GM_getValue(BLACKLIST, []);
}

// 屏蔽帖子
function blackthread() {
    var list = get();
    var tlist = $('tbody[id^="normalthread"]');
    $.each(tlist, function (index, thread) {
        var tname = $($(thread).find('cite>a')[0]).text();
        $.each(list, function (i, name) {
            if (tname === name) {
                $(thread).hide();
            }
        });
    });
}

// 屏蔽回帖
function blackcomment() {
    var list = get();
    var tlist = $('a.xw1');
    $.each(tlist, function (index, thread) {
        var tname = $(thread).text();
        $.each(list, function (i, name) {
            if (tname === name) {
                var div_parent = $(thread).parents('div[id^="post_"]');
                div_parent.children().hide();
                var span = $('<span>').css({
                    'display': 'block',
                    'height': '20px',
                    'text-align': 'center',
                    'border': 'solid 1px'
                }).append('黑名单已隐藏, 这是你不想看到的人的言论, 你就点下去吧.').click(function () {
                    span.hide();
                    div_parent.children('table').show();
                });
                div_parent.append(span);
            }
        });
    });
}
