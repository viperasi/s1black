
$(function () {
    chrome.runtime.onMessage.addListener(function (request, sender, sendRequest) {
        if (request.type === 'remove') {
            blacklist();
        }
    });
    blacklist();
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
