// This is the js for the default/index.html view.


var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    function get_subleagues_url(leaguename) {
        return "https://api.smash.gg/tournament/" + leaguename + "?expand[]=tagsByContainer";
    }

    self.getTourneys = function(leaguename) {
        $.getJSON(get_tourneys_url,
        {
            t: leaguename
        },
           function (data) {
               var test = data.tDict;
               //var get_url = data['access_url'];
               console.log(test);
        })
    }

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            selected_tourney: '',
            tourneys: [],
            slugs: [],
            players: ['bob', 'boy', 'lammy'],
        },
        methods: {
            getTourneys: self.getTourneys
        }

    });

    self.getTourneys("rivals-championship-series");
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
