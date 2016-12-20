// S1 Blacklist Ext
// by: viperasi
// homepage: www.xu81.com

$(function () {
    genList();
    $("#save").click(function () {
        save($("#name").val());
        $("#name").val('');
    });
});

function genList() {
    chrome.storage.local.get("s1blacklist", function (item) {
        var list;
        if (!item.s1blacklist) {
            list = [];
        } else {
            list = item.s1blacklist;
        }
        $("#list").empty();
        $.each(list, function (index, item) {
            var btn = $("<button>X</button>").click(function () {
                del(item);
            });
            var li = $("<li>").attr("id", item).append(btn).append(item);
            $("#list").append(li);
        })
    });
}

function save(theValue) {
    if (!theValue) {
        return;
    }

    chrome.storage.local.get(["s1blacklist"], function (item) {
        var list;
        if (!item.s1blacklist) {
            list = [];
        } else {
            list = item.s1blacklist;
        }
        list.push(theValue);
        chrome.storage.local.set({ 's1blacklist': list }, function () {
            var btn = $("<button>X</button>").click(function () {
                del(theValue);
            });
            var li = $("<li>").attr("id", theValue).append(btn).append(theValue);
            $("#list").append(li);
        });

    });
}

function del(theValue) {
    chrome.storage.local.get(["s1blacklist"], function (item) {
        var list;
        if (!item.s1blacklist) {
            list = [];
        } else {
            list = item.s1blacklist;
        }
        var newlist = [];
        $.each(list, function(index, name){
            if(theValue != name){
                newlist.push(name);
            }
        })
        chrome.storage.local.set({ 's1blacklist': newlist }, function () {
            $("#"+theValue).remove();
        });

    });
}