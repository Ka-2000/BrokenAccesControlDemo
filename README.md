# BrokenAccesControlDemo

Le but de ce code est de proposer une demonstration d'une faille Broken Access Control plus précisement par contournement des contrôles d'accès via des méthodes HTTP. 

---

Pour cette démonstration, un petit serveur Express en Node.js à était mis en place pour démontrer cette faille de Broken Access Control via HTTP Method Tampering.

+ Voici l'arborescence du projet : 
```sh
broken-access-control-demo/
├── app.js
├── users.js
└── package.json
```

---

#Tutorial 

+ Cloner le projet ⬇️

```sh
https://github.com/Ka-2000/BrokenAccesControlDemo.git
```

+ Lancer le projet ⬇️

```sh
npm install
npm start
```

+ Acceder a l'url depuis le navigateur ⬇️

```sh
localhost:3000
```

---

# Démonstration : 

Teste simple : 

+ Modification de l'url pour acceder a des données d'autres users :

Fonctionnelle ⬇️
```sh
http://localhost:3000/api/user/2?user=2
```

Non fonctionnelle ⬇️
```sh 
http://localhost:3000/api/user/1?user=2
```

Teste en ligne de commande : 

+ Acceder à l'arborescence du projet (à modifier selon vos infos) ⬇️
```sh
cd user/Desktop/nomduprojet
```

+ Execution de la requete vulnérable ⬇️
```sh
curl -X DELETE "http://localhost:3000/api/user/1?user=2"
```

Que fait cette requete ? ⬆️

+ -X DELETE : précise la méthode HTTP à utiliser
+ L’URL contient ?user=2 afin de simuler un utilisateur non admin
+ Ainsi, on essaie de supprimer l’utilisateur 1 (probablement admin)
  
Et ça passe… alors que ça ne devrait pas ✅

+ Resultat ⬇️
```sh
User ID 1 deleted (vulnérable !)
```

+ A l'inverse, si on execute cette requete :
```sh
curl "http://localhost:3000/api/user/1?user=2"
```

Le resultat est FORBIDDEN ❌ 

+ Resultat ⬇️
```sh
Forbidden GET
```

---

#PATCH DE CORRECTION A CETTE FAILLE : 

Il suffit simplement d'ajouter une condition qui permettra de sécuriser l'accès aux droits aux utilisateurs : 

Remplacer ce code : 
```sh
app.delete("/api/user/:id", (req, res) => {
  res.send(`User ID ${req.params.id} deleted (vulnérable !)`);
});
```

Par ce code : 
```sh
app.delete("/api/user/:id", (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).send("Forbidden DELETE – admin only");
  }

  res.send(`User ID ${req.params.id} deleted (secure route)`);
});
```

Une fois les modifications faites, on peut essayer a nouveau la requete suivante :

En tant que user=2 (non admin) : 
```sh
curl -X DELETE "http://localhost:3000/api/user/1?user=2"
```

Résultat ⬇️
```sh
Forbidden DELETE – admin only
```

En tant que user=1 (admin) :
```sh
curl -X DELETE "http://localhost:3000/api/user/2?user=1"
```

Résultat ⬇️
```sh
User ID 2 deleted (secure route)
```
