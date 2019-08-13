/**
 * Author: Jether Rodrigues || 13/09/2018
 */
var EasyCookie = (function() {

    /**
     * Create cookie
     * 
     * @param {*} name 
     * @param {*} value 
     * @param {*} days 
     */
    let create = function (name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    /**
     * Read cookie by name
     * @param {*} name 
     */
    let read = function (name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(var i=0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    /**
     * Clean cookie by name
     * 
     * @param {*} name 
     */
    let remove = function (name) {
        createCookie(name, "", -1);
    }

    return {
        create: create,
        read: read,
        remove: remove
    }

})(EasyCookie || {});

// module.exports = { EasyCookie };