// some default functionality needed to setup apps
(function() {
    var init = function() {
        setupSocial({
            element: {
                facebook: 'share-fb',
                twitter: 'share-tw'
            }
        });

        removeMobileHover();
        copyrightYear();
    };

    var setupSocial = function(params) {
        var href = window.location.href;
        var text = document.title;
        var encoded = encodeURIComponent(text);
        var twitter = 'https://twitter.com/intent/tweet?text=' + encoded + '&via=BostonGlobe&url=' + encodeURI(href);
        var facebook = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI(href);
        document.getElementsByClassName(params.element.facebook)[0].setAttribute('href', facebook);
        document.getElementsByClassName(params.element.twitter)[0].setAttribute('href', twitter);
    };

    var removeMobileHover = function() {
        // Inspired by: https://gist.github.com/rcmachado/7303143 and http://mvartan.com/2014/12/20/fixing-sticky-hover-on-mobile-devices/
        if(isMobile.any()) {
            // Loop through each stylesheet
            for(var sheetI = document.styleSheets.length - 1; sheetI >= 0; sheetI--) {
                var sheet = document.styleSheets[sheetI];
                // Verify if cssRules exists in sheet
                if(sheet.cssRules) {
                    // Loop through each rule in sheet
                    for(var ruleI = sheet.cssRules.length - 1; ruleI >= 0; ruleI--) {
                        var rule = sheet.cssRules[ruleI];
                        // Verify rule has selector text
                        if(rule.selectorText) {
                        // Replace hover psuedo-class with active psuedo-class
                            rule.selectorText = rule.selectorText.replace(":hover", ":active");
                        }
                    }
                }
            }
        }
    };

    var copyrightYear = function() {
        var d = new Date();
        var year = d.getFullYear();
        var el = document.getElementsByClassName('g-footer--copyright-year');
        if(el.length) {
            el[0].innerHTML = year;    
        }
    };

    window.isMobile = { 
        Android: function() { return navigator.userAgent.match(/Android/i); }, 
        BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
        iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
        Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
        Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
        any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
    };

    window.ieVersionOrLess = function(x) {
        x = x || 0;
        var htmlClasses = document.getElementsByTagName('html')[0].className;
        var matches = htmlClasses.match(/ie(\d+)/);
        return matches && +matches[1] <= x;
    };

    init();
})();