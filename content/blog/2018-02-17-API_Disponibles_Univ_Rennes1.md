---
layout: blog-post
title: Quelques explications pour utiliser l'authentification à Rennes 1 pour protéger vos applications Web
place: Rennes, France
categories: [teaching, istic, french]
published: true
---
Dans de nombreux projets étudiants, il est nécessaire de développer une application Web qui utilisent l'authentification de Rennes 1. 

Bonnes nouvelles, l'université utilise [CAS](https://fr.wikipedia.org/wiki/Central_Authentication_Service). Ce service peut permettre de protéger votre application Web en demandant à un utilissateur de Rennes 1 de s'authentifier. 

Je ne vais pas rentrer en détail sur le fonctionnement du CAS. Retenez que cela permet à votre application Web de rediriger une route/URL (ou un ensemble de routes) vers leserveur d'authentification. Si l'authentification se passe bien, le serveur d'authentification redirigera alors le navigateur vers l'URL d'origine en introduisant un ticket qui pourra être validé par le serveur auprès du service d'authentification afin de valider l'identifiant de l'utilisateur. 

Heureusement pour presque tous les langages, il existe des librairies pour utiliser le CAS. Dans la suite je mettrai des exemples en JavaScript. 

<!--more-->

Je fournis un premier exemple en [JS](https://github.com/barais/demoCasUR1)

Dans cet exemple, nous protégeons la route */app* avec le cas de Rennes 1. 


```js
//Require to use express and cas librarie
var app = require('express')();
var session = require('express-session');
var CASAuthentication = require('cas-authentication');
 
// Set up an Express session, which is required for CASAuthentication. 
app.use( session({
    secret            : 'super secret key', //Must be changed
    resave            : false,
    saveUninitialized : true
}));
 
// Create a new instance of CASAuthentication. 
var cas = new CASAuthentication({
    cas_url     : 'https://sso-cas.univ-rennes1.fr',
    service_url : 'http://localhost:3000', //must be changed after deploying your application. Do not forget to use let's encrypt
    cas_version     : '1.0',
    session_name    : 'cas_user',
    session_info    : 'cas_userinfo'
});
 
// Unauthenticated clients will be redirected to the CAS login and then back to 
// this route once authenticated. 
app.get( '/app', cas.bounce, function ( req, res ) {
    res.send( '<html><body>Hello! ' + req.session[ cas.session_name ] + '</body></html>' );
}); 
  
// Unauthenticated clients will be redirected to the CAS login and then to the 
// provided "redirectTo" query parameter once authenticated. 
app.get( '/authenticate', cas.bounce_redirect );
 
// This route will de-authenticate the client with the Express server and then 
// redirect the client to the CAS logout page. 
app.get( '/logout', cas.logout );

app.listen(3000, () => console.log('Example app listening on port 3000!'))

```


## Utilisation du LDAP de Rennes 1. 

Dans le cas ci dessus, on récupère l'id de la personne authentifiée dans la session (**req.session[ cas.session_name ]**). Dans ce deuxième exemple, je montre comment récupérer des informations sur un utilisateur à partir du moment où l'on connaît son identifiant. 

Le code fonctionnel est [ici](https://github.com/barais/LDAPUR1Node)

[Lightweight Directory Access Protocol (LDAP)](https://fr.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol) est à l'origine un protocole permettant l'interrogation et la modification des services d'annuaire. Il inclue un modèle de données, un modèle de nommage, un modèle fonctionnel basé sur le protocole LDAP, un modèle de sécurité et un modèle de réplication. C'est une structure arborescente dont chacun des noeuds est constitué d'attributs associés à leurs valeurs. 


```js
var ldap = require('ldapjs');
var client = ldap.createClient({url: 'ldaps://ldap.univ-rennes1.fr',tlsOptions: {}});

var opts = {
  filter: '(uid=obarais)', // Could be replace by the uid you get from req.session[ cas.session_name ]
  scope: 'sub',
  attributes: '*'//['cn', 'sn', 'uid']
};

client.search('ou=People,dc=univ-rennes1,dc=fr', opts, function(err, res) {
  res.on('searchEntry', function(entry) {
    console.log('entry: ' + JSON.stringify(entry.object));
  });
  res.on('searchReference', function(referral) {
    console.log('referral: ' + referral.uris.join());
  });
  res.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  res.on('end', function(result) {
    console.log('status: ' + result.status);
    //client.unbind(function(err) {	}); // To disconnect from the server
  });
});
```

Il vous reste ensuite à combiner ces deux exemples. 

## Autres langages

En reprenant les infos de ces exemples, vous pouvez fare la même chose en Java ou tout autre langage. 

- [Java CAS](https://github.com/apereo/java-cas-client)
- [Java LDAP](http://directory.apache.org/api/java-api.html)
