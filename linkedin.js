var LIConnect = {    

    fetchProfile: function (callback) {
        var self = this;
        IN.API.Profile("me")
            .fields(["firstName", "lastName", "twitterAccounts", "connections", "pictureUrl", "location", "skills"])
            .result(function (result) {
                var me = result.values && result.values[0];
                callback && callback(me);
        });
    },

    fetchConnections: function (callback) {
        var self = this;
        this.fetchProfile(function (profile) {
            var me = profile;
            //Sequential..
            IN.API.Connections("me")
                .fields("id", "firstName", "lastName", "headline", "pictureUrl", "publicProfileUrl", "location", "twitterAccounts", "skills")
                .result(function (me, result) {
                    callback && callback(me, result.values);
                }.bind(self, me));
        });
    },

    isAuthorized: function () {
        return IN.User.isAuthorized();
    },

    authorize: function (callback) {
        
        if (this.isAuthorized()) {
            callback && callback();
        }else{
            IN.Event.on(IN, "auth", function () {
                callback && callback();
            }, this);
            IN.UI.Authorize().place();
        }

    },
    
    loaded: false,
    onLoad: function () {         
        
        var self = LIConnect,
            callback = self._onInitCallback;
        
        self.loaded = true;        
        callback && callback();
        
    },
    
    init: function (callback) {
        
        if (this.loaded) {
            callback && callback();
            return false;
        }
        
        var self = this;
        this._onInitCallback = callback;        
        $(document).ready(function () {
            $.getScript("http://platform.linkedin.com/in.js?async=true", function success() {                
                IN.init({
                    api_key: "patlvmbz6t0o",
                    onLoad: "LIConnect.onLoad",
                    authorize: true
                });
            });
        });

        return true;

    },
    
    materialize: function (domEl) {
        domEl = domEl || document.body;
        if (IN.parse) {
            IN.parse(domEl);
        } else {
            IN.Event.on(IN, "systemReady", IN.parse.bind(this, domEl));
        }
    }

};