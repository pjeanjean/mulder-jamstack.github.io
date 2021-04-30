---
layout: blog-post
title: Quick and dirty integration of JQuery module with AngularJS
description:  Integration of JQuery with angularJS
place: Rennes, France
categories: [angularjs,jquery]
published: true
---
This morning, I have to integrate a JQuery libs with angularJS. Of course, the propper way to do it is the use of directives but I have to do it quickly.

<!--more-->

In JQuery, we often use the document.ready function to know if the dom is ready to be handled by JQuery. Of course, it does not work with AngularJs. Nevertheless, in the controler, you can easily add

```js
function myController($scope) {
    $scope.$on('$viewContentLoaded', function(){/*your code here*/});
}
```

In my case, I obtain the following code for integrating this [lib](http://zurb.com/playground/javascript-annotation-plugin).

```js
'use strict';

angular.module('jhipsterApp')
    .controller('MainController', function ($scope, Principal) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });
        $scope.$on('$viewContentLoaded', function(){
          function blackNote() {
            return $(document.createElement('span')).
              addClass('black circle note')
          }
          console.log($('#nutmeg').get());
          $('#nutmeg').annotatableImage(blackNote);

          $('#serialize').click(function(event){
            event.preventDefault();
            $.each($('#nutmeg span.note').seralizeAnnotations(), function(){
              console.log('x: ' + this.x + ' y: ' + this.y + ' response_time: ' + this.response_time + 'ms');
            });

          });
        });

    });

```

Of course, it is better to use angularjs directives – that would be the cleanest way of solving this problem. The proposed solution   will work but isn’t very ‘Angular’.
