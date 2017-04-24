
$(function () {
    chrome.runtime.onMessage.addListener(function (request, sender, sendRequest) {
        if (request.type === 'remove') {
            blacklist();
            blackthread();
        }
    });
    blacklist();
    blackthread();
})



function blacklist() {
    chrome.storage.local.get(["s1blacklist"], function (item) {
        var list;
        if (!item.s1blacklist) {
            list = [];
        } else {
            list = item.s1blacklist;
        }
        var tlist = $("tbody[id^='normalthread']");
        $.each(tlist, function (index, thread) {
            var tname = $($(thread).find('cite>a')[0]).text();
            $.each(list, function (i, name) {
                if (tname === name) {
                    $(thread).hide();
                }
            })
        });
    });
}

function blackthread(){
    chrome.storage.local.get(["s1blacklist"], function (item) {
        var list;
        if (!item.s1blacklist) {
            list = [];
        } else {
            list = item.s1blacklist;
        }
        var tlist = $("a.xw1");
        $.each(tlist, function (index, thread) {
            var tname = $(thread).text();
            $.each(list, function (i, name) {
                if (tname === name) {
                    var div_parent = $(thread).parents('div[id^="post_"]');
                    div_parent.children().hide();
                    var span = $("<span>").css({
                        "display":"block",
                        "height": "20px",
                        "text-align": "center",
                        "border": "solid 1px"
                    }).append("黑名单已隐藏, 这是你不想看到的人的言论, 你就点下去吧.").click(function(){
                        span.hide();
                        div_parent.children("table").show();
                    });
                    div_parent.append(span);
                }
            })
        });
    });
}
