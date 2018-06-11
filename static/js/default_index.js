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
               var league = data.tDict;
               self.vue.tourneys.push(league);
        })
    }

    self.getAllTourneys = function() {
        self.vue.tourneys = [];
        self.getTourneys("rivals-championship-series");
        self.getTourneys("rivals-championship-series-season-2");
        //self.save();
    }

    self.switchLeagues = function() {
        for (var i=0; i<self.vue.tourneys.length; i++){
            if (self.vue.selected_league == self.vue.tourneys[i]['name']) {
                self.vue.selected_league_dict = self.vue.tourneys[i];
            }
        }
        self.vue.selected_subleague = '';
        self.vue.selected_subleague_dict = null;
        self.vue.players = self.vue.selected_league_dict['standings'];
    }

    self.switchSubleagues = function() {
        for (var i=0; i<self.vue.selected_league_dict['subleagues'].length; i++){
            if (self.vue.selected_subleague == self.vue.selected_league_dict['subleagues'][i]['name']) {
                self.vue.selected_subleague_dict = self.vue.selected_league_dict['subleagues'][i];
            }
        }
        self.vue.players = self.vue.selected_subleague_dict['standings'];
    }
/*
    self.save = function(){
        $.post(save_url,
        {
            d: self.vue.tourneys
        });
    }

    self.load = function(){
        $.getJSON(load_url,{},
           function (data) {
               var t = data.tDict;
               self.vue.tourneys = t;
        })
    }
*/
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            selected_league: '',
            selected_league_dict: null,
            selected_subleague: '',
            selected_subleague_dict: null,
            tourneys: [],
            slugs: [],
            players: [],
        },
        methods: {
            getTourneys: self.getTourneys,
            getAllTourneys: self.getAllTourneys,
            switchLeagues: self.switchLeagues,
            switchSubleagues: self.switchSubleagues,
            //save: self.save,
            //load: self.load
        }

    });

    //self.load();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
